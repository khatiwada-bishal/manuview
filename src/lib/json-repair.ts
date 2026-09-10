/**
 * Robust JSON Sanitizer and Repair Utility for LLM Outputs
 *
 * LLMs frequently produce slightly malformed JSON:
 * 1. Unescaped double quotes inside array strings or property values
 *    e.g. ["The author claims "novelty" without controls"]
 *    which causes "Expected ',' or ']' after array element in JSON".
 * 2. Truncated output when hitting token limits mid-string or mid-array.
 * 3. Trailing commas before closing brackets or braces.
 * 4. Literal unescaped control characters (\n, \r, \t) inside strings.
 * 5. Markdown code fences and conversational preamble/postscript text.
 */

export function cleanAndRepairJson<T = any>(raw: string, fallback?: T): T {
  if (!raw || typeof raw !== "string") {
    if (fallback !== undefined) return fallback;
    throw new Error("Empty JSON input");
  }

  // 1. Strip markdown fences and find JSON start
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");

  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");

  // Determine starting position of structured JSON
  let startIdx = -1;
  if (firstBrace !== -1 && firstBracket !== -1) {
    startIdx = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIdx = firstBrace;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
  }

  if (startIdx === -1) {
    if (fallback !== undefined) return fallback;
    throw new Error("No opening brace or bracket found in LLM output");
  }

  cleaned = cleaned.slice(startIdx);

  // Strategy A: Direct parse
  try {
    return JSON.parse(cleaned);
  } catch {}

  // Strategy B: Slicing to the last matching closing brace/bracket
  const lastBrace = cleaned.lastIndexOf("}");
  const lastBracket = cleaned.lastIndexOf("]");
  const lastClose = Math.max(lastBrace, lastBracket);
  if (lastClose !== -1) {
    try {
      return JSON.parse(cleaned.slice(0, lastClose + 1));
    } catch {}
  }

  // Strategy C: Remove trailing commas
  let s = cleaned.replace(/,\s*([\}\]])/g, "$1");
  try {
    return JSON.parse(s);
  } catch {}

  // Strategy D: Repair unescaped control characters in strings
  s = repairUnescapedCharacters(s);
  try {
    return JSON.parse(s);
  } catch {}

  // Strategy E: Repair unescaped internal quotes inside strings
  s = repairUnescapedQuotes(s);
  try {
    return JSON.parse(s);
  } catch {}

  // Strategy F: Close truncated JSON (handles token limit cutoffs)
  s = closeTruncatedJson(s);
  try {
    return JSON.parse(s);
  } catch {}

  // Strategy G: Remove trailing commas after truncation closure
  s = s.replace(/,\s*([\}\]])/g, "$1");
  try {
    return JSON.parse(s);
  } catch {}

  // Strategy H: Extract largest balanced root object if present
  try {
    const balanced = extractBalancedJson(cleaned);
    if (balanced) {
      let b = repairUnescapedCharacters(balanced);
      b = repairUnescapedQuotes(b);
      b = b.replace(/,\s*([\}\]])/g, "$1");
      return JSON.parse(b);
    }
  } catch {}

  if (fallback !== undefined) {
    return fallback;
  }

  // If all strategies fail, attempt one last parse to get the detailed error
  return JSON.parse(s);
}

/**
 * Escapes literal raw newlines, carriage returns, and tabs inside JSON string literals.
 */
function repairUnescapedCharacters(jsonStr: string): string {
  let inString = false;
  let escaped = false;
  let result = "";

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];

    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      result += char;
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }

    if (inString) {
      if (char === "\n") result += "\\n";
      else if (char === "\r") result += "\\r";
      else if (char === "\t") result += "\\t";
      else result += char;
    } else {
      result += char;
    }
  }

  return result;
}

/**
 * Repairs unescaped internal quotes within string values/keys.
 * Distinguishes whether the quote is a legitimate structural JSON delimiter or internal quote.
 */
function repairUnescapedQuotes(jsonStr: string): string {
  let out = "";
  const stack: ("object" | "expect_key" | "object_val" | "array")[] = [];
  let inString = false;
  let stringType: "key" | "val" | null = null;
  let escaped = false;

  for (let i = 0; i < jsonStr.length; i++) {
    const c = jsonStr[i];

    if (escaped) {
      out += c;
      escaped = false;
      continue;
    }

    if (c === "\\") {
      out += c;
      escaped = true;
      continue;
    }

    if (c === '"') {
      if (!inString) {
        const top = stack[stack.length - 1];
        stringType = (top === "object" || top === "expect_key") ? "key" : "val";
        inString = true;
        out += c;
      } else {
        // Look ahead to next non-whitespace character
        let j = i + 1;
        while (
          j < jsonStr.length &&
          (jsonStr[j] === " " || jsonStr[j] === "\t" || jsonStr[j] === "\n" || jsonStr[j] === "\r")
        ) {
          j++;
        }
        const nextChar = j < jsonStr.length ? jsonStr[j] : "";

        if (stringType === "key") {
          if (nextChar === ":") {
            inString = false;
            stringType = null;
            out += c;
          } else {
            out += '\\"';
          }
        } else {
          // Inside a value (e.g. inside an array element or object value)
          if (nextChar === "," || nextChar === "}" || nextChar === "]" || nextChar === "") {
            inString = false;
            stringType = null;
            out += c;
          } else {
            out += '\\"';
          }
        }
      }
      continue;
    }

    if (!inString) {
      if (c === "{") {
        stack.push("object");
      } else if (c === "}") {
        if (stack.length > 0) stack.pop();
      } else if (c === "[") {
        stack.push("array");
      } else if (c === "]") {
        if (stack.length > 0) stack.pop();
      } else if (c === ":") {
        if (stack.length > 0 && (stack[stack.length - 1] === "object" || stack[stack.length - 1] === "expect_key")) {
          stack[stack.length - 1] = "object_val";
        }
      } else if (c === ",") {
        if (stack.length > 0) {
          const top = stack[stack.length - 1];
          if (top === "object_val" || top === "object") {
            stack[stack.length - 1] = "expect_key";
          }
        }
      }
    }

    out += c;
  }

  return out;
}

/**
 * Closes unclosed strings, arrays, and objects caused by LLM token limit truncation.
 */
function closeTruncatedJson(jsonStr: string): string {
  let str = jsonStr.trim();
  str = str.replace(/[,:\s]+$/, "");

  const stack: string[] = [];
  let inString = false;
  let escaped = false;
  let lastStringStart = -1;

  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (c === "\\") {
      escaped = true;
      continue;
    }
    if (c === '"') {
      if (!inString) {
        inString = true;
        lastStringStart = i;
      } else {
        inString = false;
      }
      continue;
    }
    if (!inString) {
      if (c === "{") stack.push("}");
      else if (c === "[") stack.push("]");
      else if (c === "}" || c === "]") {
        if (stack.length > 0 && stack[stack.length - 1] === c) {
          stack.pop();
        }
      }
    }
  }

  const top = stack[stack.length - 1];

  // If ended inside a string while expecting an object key, prune the incomplete key
  let prevChar = "";
  if (lastStringStart > 0) {
    let p = lastStringStart - 1;
    while (p >= 0 && (str[p] === " " || str[p] === "\t" || str[p] === "\n" || str[p] === "\r")) {
      p--;
    }
    if (p >= 0) prevChar = str[p];
  }

  if (inString) {
    if (top === "}" && (prevChar === "," || prevChar === "{")) {
      // Incomplete key in an object; strip it back before the comma or opening brace
      if (prevChar === ",") {
        str = str.slice(0, lastStringStart).replace(/,\s*$/, "");
      } else if (prevChar === "{") {
        str = str.slice(0, lastStringStart).trim();
      }
    } else {
      // Completed value or array item: close the string
      str += '"';
    }
  } else {
    // If not in a string, but ended on an incomplete key or dangling colon in an object
    if (top === "}") {
      str = str.replace(/,\s*"[^"]*"\s*:\s*$/, "");
      str = str.replace(/\{\s*"[^"]*"\s*:\s*$/, "{");
      str = str.replace(/,\s*"[^"]*"\s*$/, "");
      str = str.replace(/\{\s*"[^"]*"\s*$/, "{");
    }
  }

  str = str.replace(/[,:\s]+$/, "");

  // Recompute closing stack for the clean string
  const finalStack: string[] = [];
  let finalInString = false;
  let finalEscaped = false;

  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (finalEscaped) {
      finalEscaped = false;
      continue;
    }
    if (c === "\\") {
      finalEscaped = true;
      continue;
    }
    if (c === '"') {
      finalInString = !finalInString;
      continue;
    }
    if (!finalInString) {
      if (c === "{") finalStack.push("}");
      else if (c === "[") finalStack.push("]");
      else if (c === "}" || c === "]") {
        if (finalStack.length > 0 && finalStack[finalStack.length - 1] === c) {
          finalStack.pop();
        }
      }
    }
  }

  if (finalInString) {
    str += '"';
  }
  str = str.replace(/[,:\s]+$/, "");

  while (finalStack.length > 0) {
    str += finalStack.pop();
  }

  return str;
}

/**
 * Attempts to extract the largest balanced JSON block from text.
 */
function extractBalancedJson(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (c === "\\") {
      escaped = true;
      continue;
    }
    if (c === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) {
          return text.slice(start, i + 1);
        }
      }
    }
  }

  return null;
}
