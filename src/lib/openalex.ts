// OpenAlex free academic API client for bibliographic lookup and abstract retrieval

const POLITE_USER_AGENT = "ManuView-OpenPreSubmission/1.0 (mailto:research@manuview.org)";

export interface OpenAlexWork {
  id: string;
  doi?: string;
  title: string;
  publicationYear?: number;
  citedByCount?: number;
  abstract?: string;
  isOpenAccess: boolean;
}

// OpenAlex inverted abstract reconstructor
function reconstructAbstract(invertedIndex?: Record<string, number[]>): string {
  if (!invertedIndex) return "";
  const words: { word: string; pos: number }[] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words.push({ word, pos });
    }
  }
  words.sort((a, b) => a.pos - b.pos);
  return words.map(w => w.word).join(" ");
}

export async function fetchWorkByDOI(doi: string): Promise<OpenAlexWork | null> {
  const cleanDoi = encodeURIComponent(doi.trim());
  const url = `https://api.openalex.org/works/https://doi.org/${cleanDoi}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      headers: {
        "User-Agent": POLITE_USER_AGENT,
        "Accept": "application/json",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const data = await res.json();
    return {
      id: data.id,
      doi: data.doi,
      title: data.title,
      publicationYear: data.publication_year,
      citedByCount: data.cited_by_count,
      abstract: reconstructAbstract(data.abstract_inverted_index),
      isOpenAccess: data.open_access?.is_oa || false,
    };
  } catch {
    return null;
  }
}
