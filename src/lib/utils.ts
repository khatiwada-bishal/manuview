import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractDOIs(text: string): string[] {
  // Matches typical DOIs like 10.1038/s41586-020-2649-2 or 10.1126/science.123456
  const doiRegex = /\b(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)\b/gi;
  const matches = text.match(doiRegex) || [];
  // Clean trailing punctuation
  return Array.from(new Set(matches.map(d => d.replace(/[.,;)]$/, ''))));
}

export function extractReferencesFromText(text: string): string[] {
  // Locate "References", "Bibliography", or "Literature Cited"
  const refHeadingRegex = /(?:\n|^)(?:References|Bibliography|Literature Cited|Works Cited)\b/i;
  const match = text.search(refHeadingRegex);
  
  if (match === -1) {
    // If no heading, check for bracketed references [1], [2] or numbered lists
    const lines = text.split('\n').filter(l => l.trim().length > 20);
    const numberedRefs = lines.filter(l => /^(?:\[\d+\]|\d+\.|\([A-Za-z]+,\s*\d{4}\))/.test(l.trim()));
    if (numberedRefs.length >= 3) return numberedRefs;
    return [];
  }

  const refSection = text.slice(match);
  const lines = refSection
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 25 && !/^(References|Bibliography|Literature Cited)$/i.test(l));

  // Group multi-line entries if needed
  const refs: string[] = [];
  let currentRef = '';

  for (const line of lines) {
    if (/^(?:\[\d+\]|\d+\.|\([A-Za-z]+,\s*\d{4}\)|[A-Z][a-z]+,\s*[A-Z])/.test(line)) {
      if (currentRef) refs.push(currentRef);
      currentRef = line;
    } else {
      if (currentRef) {
        currentRef += ' ' + line;
      } else {
        currentRef = line;
      }
    }
  }
  if (currentRef) refs.push(currentRef);

  return refs.length > 0 ? refs : lines.slice(0, 50);
}
