// OpenAlex free academic API client for bibliographic lookup and journal source retrieval
import { titleSimilarity, normalizeTitle } from "./utils";

const POLITE_USER_AGENT = "ManuView-OpenPreSubmission/1.0 (mailto:research@manuview.org)";
const POLITE_MAILTO = "research@manuview.org";

export interface OpenAlexWork {
  id: string;
  doi?: string;
  title: string;
  publicationYear?: number;
  citedByCount?: number;
  abstract?: string;
  isOpenAccess: boolean;
}

export interface OpenAlexSource {
  id: string;
  displayName: string;
  hostOrganization?: string;
  issn?: string[];
  isOa: boolean;
  twoYearMeanCitedness?: number;
  hIndex?: number;
  concepts: { id: string; displayName: string; score: number }[];
  topics: { id: string; displayName: string; subfield?: string; field?: string; domain?: string }[];
  homepageUrl?: string;
  worksCount?: number;
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
  const url = `https://api.openalex.org/works/https://doi.org/${cleanDoi}?mailto=${encodeURIComponent(POLITE_MAILTO)}`;

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

export type OpenAlexLookup =
  | { outcome: 'found'; source: OpenAlexSource }
  | { outcome: 'not_found' }
  | { outcome: 'low_confidence'; candidate: string; similarity: number }
  | { outcome: 'unavailable'; reason: string };

/**
 * Searches OpenAlex /sources for live journal scope concepts, metrics, and topics (A5, REQ-OA-01)
 */
export async function searchJournalInOpenAlex(journalName: string): Promise<OpenAlexLookup> {
  const cleanName = journalName.trim();
  if (!cleanName || cleanName.length < 3) return { outcome: 'not_found' };

  const url = `https://api.openalex.org/sources?search=${encodeURIComponent(cleanName)}&mailto=${encodeURIComponent(POLITE_MAILTO)}`;

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

    if (res.status === 429) {
      return { outcome: 'unavailable', reason: 'OpenAlex API rate limit reached (HTTP 429)' };
    }

    if (!res.ok) {
      return { outcome: 'unavailable', reason: `OpenAlex service returned HTTP ${res.status}` };
    }

    const data = await res.json();
    const hit = data.results?.[0];
    if (!hit || !hit.display_name) {
      return { outcome: 'not_found' };
    }

    // Verify name match confidence
    const sim = titleSimilarity(hit.display_name, cleanName);
    const normHit = normalizeTitle(hit.display_name);
    const normQuery = normalizeTitle(cleanName);

    if (sim < 0.35 && !normHit.includes(normQuery) && !normQuery.includes(normHit)) {
      return { outcome: 'low_confidence', candidate: hit.display_name, similarity: sim };
    }

    const concepts = (hit.x_concepts || []).map((c: { id: string; display_name: string; score?: number }) => ({
      id: c.id,
      displayName: c.display_name,
      score: c.score || 0,
    }));

    const topics = (hit.topics || []).map((t: { id: string; display_name: string; subfield?: { display_name?: string }; field?: { display_name?: string }; domain?: { display_name?: string } }) => ({
      id: t.id,
      displayName: t.display_name,
      subfield: t.subfield?.display_name,
      field: t.field?.display_name,
      domain: t.domain?.display_name,
    }));

    const source: OpenAlexSource = {
      id: hit.id,
      displayName: hit.display_name,
      hostOrganization: hit.host_organization_name,
      issn: hit.issn,
      isOa: Boolean(hit.is_oa),
      twoYearMeanCitedness: hit.summary_stats?.["2yr_mean_citedness"] !== undefined ? Number(hit.summary_stats["2yr_mean_citedness"]) : undefined,
      hIndex: hit.summary_stats?.["h_index"] !== undefined ? Number(hit.summary_stats["h_index"]) : undefined,
      concepts,
      topics,
      homepageUrl: hit.homepage_url,
      worksCount: hit.works_count,
    };

    return { outcome: 'found', source };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return { outcome: 'unavailable', reason: 'OpenAlex request timed out' };
    }
    return { outcome: 'unavailable', reason: err?.message || 'OpenAlex service unreachable' };
  }
}

/**
 * Computes semantic scope overlap between a manuscript and an OpenAlex journal source profile
 */
export function evaluateOpenAlexScopeFit(
  source: OpenAlexSource,
  manuscriptText: string,
  keywords: string[] = []
): {
  isScopeMatch: boolean;
  matchedConcepts: string[];
  scopeConfidence: number;
  summary: string;
} {
  const normText = normalizeTitle(manuscriptText);
  const normKeywords = keywords.map((k) => normalizeTitle(k));

  const matchedConcepts: string[] = [];

  for (const c of source.concepts) {
    const conceptLower = c.displayName.toLowerCase();
    const isConceptInText = normText.includes(conceptLower);
    const isConceptInKeywords = normKeywords.some((k) => k.includes(conceptLower) || conceptLower.includes(k));

    if (isConceptInText || isConceptInKeywords) {
      matchedConcepts.push(c.displayName);
    }
  }

  for (const t of source.topics) {
    if (t.subfield && normText.includes(t.subfield.toLowerCase())) {
      if (!matchedConcepts.includes(t.subfield)) matchedConcepts.push(t.subfield);
    }
    if (t.field && normText.includes(t.field.toLowerCase())) {
      if (!matchedConcepts.includes(t.field)) matchedConcepts.push(t.field);
    }
  }

  const isScopeMatch = matchedConcepts.length > 0;
  const scopeConfidence = isScopeMatch
    ? Math.min(92, Math.max(72, 72 + (matchedConcepts.length - 1) * 6))
    : 44;

  const summary = isScopeMatch
    ? `Thematic scope alignment verified via OpenAlex concept indexing: ${matchedConcepts.slice(0, 3).join(", ")}.`
    : `Manuscript shows limited direct keyword overlap with OpenAlex primary subject headings for ${source.displayName}.`;

  return {
    isScopeMatch,
    matchedConcepts,
    scopeConfidence,
    summary,
  };
}
