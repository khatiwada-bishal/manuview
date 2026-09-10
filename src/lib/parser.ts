import mammoth from "mammoth";
import { ParsedManuscript } from "./types";
import { extractReferencesFromText } from "./utils";

export async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export function parseManuscriptText(rawText: string): ParsedManuscript {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // 1. Detect Title (typically first non-empty line or largest text)
  const title = lines.length > 0 ? lines[0] : "Untitled Manuscript";

  // 2. Detect Abstract
  let abstract = "";
  const abstractMatch = rawText.match(/(?:Abstract|Summary)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:Introduction|1\.\s*Introduction|Background|Keywords|Key words|1\b)))/i);
  if (abstractMatch && abstractMatch[1]) {
    abstract = abstractMatch[1].trim();
  } else {
    // Fallback: search for first 300 words
    abstract = lines.slice(1, 5).join(' ');
  }

  // 3. Extract sections
  const sections: ParsedManuscript['sections'] = {};

  const introMatch = rawText.match(/(?:Introduction|Background)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:Methods|Materials and Methods|Methodology|2\b)))/i);
  if (introMatch) sections.introduction = introMatch[1].trim().slice(0, 5000);

  const methodsMatch = rawText.match(/(?:Methods|Materials and Methods|Methodology)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:Results|Findings|3\b)))/i);
  if (methodsMatch) sections.methods = methodsMatch[1].trim().slice(0, 6000);

  const resultsMatch = rawText.match(/(?:Results|Findings)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:Discussion|4\b)))/i);
  if (resultsMatch) sections.results = resultsMatch[1].trim().slice(0, 6000);

  const discussionMatch = rawText.match(/(?:Discussion)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:Conclusion|Conclusions|References|5\b)))/i);
  if (discussionMatch) sections.discussion = discussionMatch[1].trim().slice(0, 5000);

  // 4. Extract References
  const references = extractReferencesFromText(rawText);

  // 5. Word count
  const wordCount = rawText.split(/\s+/).filter(Boolean).length;

  return {
    title,
    abstract,
    authors: [],
    wordCount,
    sections,
    rawText,
    references,
  };
}
