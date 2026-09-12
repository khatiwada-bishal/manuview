import { PublishedArticleDetails } from "./types";
import { normalizeTitle, titleSimilarity } from "./utils";

const POLITE_USER_AGENT =
  "ManuView-OpenPreSubmission/1.0 (mailto:research@manuview.org; https://github.com/khatiwada-bishal/manuview)";

/**
 * Scans text header for publication indicators and article DOI
 */
export function extractPublicationMarkers(rawText: string): {
  doi?: string;
  journalName?: string;
  publisher?: string;
  publicationDate?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  hasPublishedMarkers: boolean;
  markerCount: number;
} {
  // Inspect the first 3,500 characters (page 1 / header) to avoid reference list citations
  const headerSlice = rawText.slice(0, 3500);

  // 1. Article DOI in header
  let doi: string | undefined = undefined;
  const doiMatch = headerSlice.match(
    /(?:https?:\/\/doi\.org\/|doi:\s*|doi\.org\/)(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)/i
  );
  if (doiMatch && doiMatch[1]) {
    doi = doiMatch[1].trim().replace(/[.,;)]+$/, "");
  }

  // 2. Publication lifecycle dates
  let publicationDate: string | undefined = undefined;
  const publishedDateMatch = headerSlice.match(
    /(?:published\s+(?:online\s+)?[:\s]+|available\s+online\s+[:\s]+)(\d{1,2}\s+[A-Za-z]+\s+\d{4}|\d{4}-\d{2}-\d{2}|[A-Za-z]+\s+\d{1,2},?\s+\d{4}|\d{1,2}\s+[A-Za-z]+,?\s+\d{4})/i
  );
  if (publishedDateMatch && publishedDateMatch[1]) {
    publicationDate = publishedDateMatch[1].trim();
  }

  const acceptedMatch = /(?:accepted(?:\s+date)?\s*[:\s]+(\d{1,2}\s+[A-Za-z]+\s+\d{4}|\d{4}-\d{2}-\d{2}|[A-Za-z]+\s+\d{1,2},?\s+\d{4}))/i.test(
    headerSlice
  );

  // 3. Volume / Issue / Pages / Article Number
  let volume: string | undefined = undefined;
  let issue: string | undefined = undefined;
  let pages: string | undefined = undefined;

  const volMatch = headerSlice.match(/(?:Volume\s+(\d+)|Vol\.\s*(\d+))/i);
  if (volMatch) volume = volMatch[1] || volMatch[2];

  const issMatch = headerSlice.match(/(?:Issue\s+(\d+)|No\.\s*(\d+))/i);
  if (issMatch) issue = issMatch[1] || issMatch[2];

  const pageMatch = headerSlice.match(
    /(?:pp\.?|pages|article)\s+([A-Za-z0-9]+[\u2013-][A-Za-z0-9]+|\d{5,8})/i
  );
  if (pageMatch) pages = pageMatch[1];

  // 4. Publisher copyright / publication notices
  let publisher: string | undefined = undefined;
  const publisherMatch = headerSlice.match(
    /(?:Elsevier|Springer\s*Nature|Wiley|IEEE|Nature\s+Publishing\s+Group|Taylor\s*&\s*Francis|Sage|MDPI|Frontiers|Oxford\s+University\s+Press|Cambridge\s+University\s+Press|PLOS|BioMed\s+Central)/i
  );
  if (publisherMatch) publisher = publisherMatch[0];

  const copyrightMatch = /(?:©\s*\d{4}\s+[A-Za-z\s]+|All rights reserved|This is an open access article under the CC BY|Published by [A-Za-z\s]+)/i.test(
    headerSlice
  );

  // 5. Journal name in header banner
  let journalName: string | undefined = undefined;
  const journalHeaderMatch = headerSlice.match(
    /(?:Journal\s+of\s+[A-Za-z\s]{4,40}|International\s+Journal\s+of\s+[A-Za-z\s]{4,40}|Nature\s+[A-Za-z\s]{4,30}|IEEE\s+Transactions\s+on\s+[A-Za-z\s]{4,35})/i
  );
  if (journalHeaderMatch) {
    journalName = journalHeaderMatch[0]
      .trim()
      .replace(/\s+(vol|volume|issue|no)\b.*$/i, "");
  }

  let markerCount = 0;
  if (doi) markerCount += 3;
  if (publicationDate) markerCount += 3;
  if (acceptedMatch) markerCount += 2;
  if (volume || issue || pages) markerCount += 2;
  if (publisher || copyrightMatch) markerCount += 2;
  if (journalName) markerCount += 1;

  const hasPublishedMarkers =
    (!!doi && (!!publicationDate || acceptedMatch || !!volume || !!publisher || copyrightMatch)) ||
    (!!publicationDate && (acceptedMatch || !!volume || copyrightMatch)) ||
    markerCount >= 5;

  return {
    doi,
    journalName,
    publisher,
    publicationDate,
    volume,
    issue,
    pages,
    hasPublishedMarkers,
    markerCount,
  };
}

/**
 * Detects whether a manuscript has already been published.
 * Uses local header metadata extraction with Crossref registry verification.
 */
export async function detectPublishedArticle(
  rawText: string,
  title?: string
): Promise<PublishedArticleDetails | null> {
  const localMarkers = extractPublicationMarkers(rawText);

  // Case A: Article DOI was directly found in the header
  if (localMarkers.doi) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(
        `https://api.crossref.org/works/${encodeURIComponent(localMarkers.doi)}`,
        {
          headers: {
            "User-Agent": POLITE_USER_AGENT,
            Accept: "application/json",
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const msg = json.message || {};
        const crJournal = Array.isArray(msg["container-title"])
          ? msg["container-title"][0]
          : undefined;
        const crYear =
          msg.issued?.["date-parts"]?.[0]?.[0] ||
          msg.created?.["date-parts"]?.[0]?.[0];
        const crMonth = msg.issued?.["date-parts"]?.[0]?.[1];
        const crDate = crYear
          ? crMonth
            ? `${crYear}-${String(crMonth).padStart(2, "0")}`
            : `${crYear}`
          : localMarkers.publicationDate;

        return {
          isPublished: true,
          doi: localMarkers.doi,
          journalName: crJournal || localMarkers.journalName || "Academic Journal",
          publisher: msg.publisher || localMarkers.publisher || "Academic Publisher",
          publicationDate: crDate,
          volume: msg.volume || localMarkers.volume,
          issue: msg.issue || localMarkers.issue,
          pages: msg.page || localMarkers.pages,
          citationCount:
            typeof msg["is-referenced-by-count"] === "number"
              ? msg["is-referenced-by-count"]
              : undefined,
          articleUrl: `https://doi.org/${localMarkers.doi}`,
          detectedVia: "Crossref Official Article Registry",
        };
      }
    } catch {
      // Network failed or offline - fall back to strong local header evidence
      if (localMarkers.hasPublishedMarkers) {
        return {
          isPublished: true,
          doi: localMarkers.doi,
          journalName: localMarkers.journalName || "Academic Journal",
          publisher: localMarkers.publisher,
          publicationDate: localMarkers.publicationDate,
          volume: localMarkers.volume,
          issue: localMarkers.issue,
          pages: localMarkers.pages,
          articleUrl: `https://doi.org/${localMarkers.doi}`,
          detectedVia: "Publisher Header Metadata & Article DOI",
        };
      }
    }
  }

  // Case B: Query Crossref by Manuscript Title (if title is sufficiently distinct)
  const cleanTitle = (title || "").trim();
  if (cleanTitle.length > 25 && !/^untitled/i.test(cleanTitle)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(
        `https://api.crossref.org/works?query.title=${encodeURIComponent(
          cleanTitle
        )}&rows=1`,
        {
          headers: {
            "User-Agent": POLITE_USER_AGENT,
            Accept: "application/json",
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const topItem = json.message?.items?.[0];
        if (topItem) {
          const topTitle = Array.isArray(topItem.title)
            ? topItem.title[0]
            : topItem.title;
          const sim = titleSimilarity(cleanTitle, topTitle || "");
          const isJournalArticle =
            topItem.type === "journal-article" ||
            topItem.type === "proceedings-article";
          const crJournal = Array.isArray(topItem["container-title"])
            ? topItem["container-title"][0]
            : undefined;

          // If title similarity is high (>0.75) and confirmed journal article in Crossref
          if (sim >= 0.75 && isJournalArticle && crJournal) {
            const crYear = topItem.issued?.["date-parts"]?.[0]?.[0];
            const crMonth = topItem.issued?.["date-parts"]?.[0]?.[1];
            const crDate = crYear
              ? crMonth
                ? `${crYear}-${String(crMonth).padStart(2, "0")}`
                : `${crYear}`
              : undefined;

            return {
              isPublished: true,
              doi: topItem.DOI,
              journalName: crJournal,
              publisher: topItem.publisher,
              publicationDate: crDate,
              volume: topItem.volume,
              issue: topItem.issue,
              pages: topItem.page,
              citationCount: topItem["is-referenced-by-count"],
              articleUrl: topItem.DOI
                ? `https://doi.org/${topItem.DOI}`
                : undefined,
              detectedVia: `Crossref Title Match (${Math.round(sim * 100)}% match)`,
            };
          }
        }
      }
    } catch {
      // Network lookup failed
    }
  }

  // Case C: Strong local markers alone indicate already published
  if (
    localMarkers.hasPublishedMarkers &&
    (localMarkers.publicationDate || localMarkers.volume)
  ) {
    return {
      isPublished: true,
      doi: localMarkers.doi,
      journalName: localMarkers.journalName || "Academic Journal",
      publisher: localMarkers.publisher,
      publicationDate: localMarkers.publicationDate,
      volume: localMarkers.volume,
      issue: localMarkers.issue,
      pages: localMarkers.pages,
      articleUrl: localMarkers.doi
        ? `https://doi.org/${localMarkers.doi}`
        : undefined,
      detectedVia: "Publisher Header Metadata & Publication Lifecycle Dates",
    };
  }

  return null;
}
