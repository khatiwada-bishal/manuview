import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DOI_REGEX = /\b(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)\b/gi;

/**
 * Normalizes title string for robust academic title comparison
 */
export function normalizeTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Computes word overlap Jaccard similarity between two titles/strings
 */
export function titleSimilarity(t1: string, t2: string): number {
  const words1 = new Set(normalizeTitle(t1).split(" ").filter((w) => w.length > 2));
  const words2 = new Set(normalizeTitle(t2).split(" ").filter((w) => w.length > 2));
  if (words1.size === 0 || words2.size === 0) return 0;
  let intersection = 0;
  words1.forEach((w) => {
    if (words2.has(w)) intersection++;
  });
  const allWords = new Set<string>();
  words1.forEach((w) => allWords.add(w));
  words2.forEach((w) => allWords.add(w));
  const union = allWords.size;
  return union > 0 ? intersection / union : 0;
}

export function extractDOIs(text: string): string[] {
  // Matches typical DOIs like 10.1038/s41586-020-2649-2 or 10.1126/science.123456
  const matches = text.match(DOI_REGEX) || [];
  // Clean trailing punctuation
  return Array.from(new Set(matches.map(d => d.replace(/[.,;)\]]+$/, ''))));
}

export function extractReferencesFromText(text: string): string[] {
  // Locate "References", "Bibliography", or "Literature Cited"
  // Pick the last heading occurrence that has sufficient text following it (avoids TOC rows in PDFs)
  const refHeadingRegex = /(?:\n|^)(?:References|Bibliography|Literature Cited|Works Cited)\s*(?:\n|:|$)/gi;
  const matches = Array.from(text.matchAll(refHeadingRegex));

  let matchIndex = -1;
  for (let i = matches.length - 1; i >= 0; i--) {
    const idx = matches[i].index;
    if (typeof idx === "number" && text.length - idx >= 50) {
      matchIndex = idx;
      break;
    }
  }

  if (matchIndex === -1) {
    // If no heading, check for bracketed references [1], [2] or author-year citations
    const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 20);
    const numberedRefs = lines.filter((l) =>
      /^(?:\[\d+\]|\d{1,3}\.\s+[A-Z]|\([A-Za-z]+,\s*\d{4}\))/.test(l)
    );
    if (numberedRefs.length >= 3) return numberedRefs;
    return [];
  }

  const refSection = text.slice(matchIndex);
  const lines = refSection
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 25 && !/^(?:References|Bibliography|Literature Cited|Works Cited)\b/i.test(l));

  // Group multi-line entries
  const refs: string[] = [];
  let currentRef = "";

  for (const line of lines) {
    if (/^(?:\[\d+\]|\d{1,3}\.\s+[A-Z]|\([A-Za-z]+,\s*\d{4}\)|[A-Z][a-z]+,\s*[A-Z])/.test(line)) {
      if (currentRef) refs.push(currentRef);
      currentRef = line;
    } else {
      if (currentRef) {
        currentRef += " " + line;
      } else {
        currentRef = line;
      }
    }
  }
  if (currentRef) refs.push(currentRef);

  // Return parsed references, or empty array if none parsed (never slice arbitrary body lines)
  return refs;
}

const BARE_SECTION_OR_GENERIC_LABELS = new Set([
  "title",
  "abstract",
  "introduction",
  "background",
  "methods",
  "methodology",
  "materials and methods",
  "results",
  "discussion",
  "conclusion",
  "conclusions",
  "references",
  "bibliography",
  "limitations",
  "acknowledgements",
  "appendix",
  "figures",
  "tables",
  "study design",
  "data availability",
  "funding",
  "competing interests",
  "declarations",
]);

/**
 * Filters out bare manuscript section headers, generic labels, or trivial fragments from reviewer observations
 */
export function isSubstantiveReviewerObservation(item: string): boolean {
  if (typeof item !== "string") return false;
  const clean = item.trim();
  // Too short to be an actionable reviewer critique or observation
  if (clean.length < 25) return false;

  const lower = clean.toLowerCase();
  // Exact match against bare section headings
  if (BARE_SECTION_OR_GENERIC_LABELS.has(lower)) return false;

  // Header patterns like "Section: Methods", "Part 2: Discussion", "Methods Section"
  if (/^(?:section|heading|part|item)\s*(?:\d+|:|\-)\s*\w+$/i.test(clean)) return false;
  if (/^(?:title|abstract|introduction|methods|results|discussion|conclusion|references)\s*(?:section|header)?$/i.test(clean)) return false;

  // Must contain at least 4 words
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length < 4) return false;

  return true;
}

