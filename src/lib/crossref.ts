import { ReferenceVerification, ReferenceStatus } from "./types";
import { checkRetractionStatus } from "./retractions";

const POLITE_USER_AGENT = "ManuView-OpenPreSubmission/1.0 (mailto:research@manuview.org; https://github.com/khatiwada-bishal/manuview)";
const POLITE_MAILTO = "research@manuview.org";

export async function verifyDOIWithCrossref(doi: string): Promise<Partial<ReferenceVerification>> {
  const cleanDoi = encodeURIComponent(doi.trim());
  // Append mailto parameter so polite pool works reliably even when browser fetch strips custom User-Agent headers
  const url = `https://api.crossref.org/works/${cleanDoi}?mailto=${encodeURIComponent(POLITE_MAILTO)}`;

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

    // Only genuine 404 indicates an unresolvable / nonexistent DOI
    if (res.status === 404) {
      return {
        doi,
        status: "unresolvable",
        isRetracted: false,
        retractionDetails: "DOI not found in Crossref registry (HTTP 404)",
      };
    }

    // Rate limit or server error - do NOT accuse user of AI hallucination
    if (res.status === 429) {
      return {
        doi,
        status: "unchecked",
        isRetracted: false,
        retractionDetails: "Crossref rate limit reached (HTTP 429). Status unconfirmed.",
      };
    }

    if (!res.ok) {
      return {
        doi,
        status: "unchecked",
        isRetracted: false,
        retractionDetails: `Crossref query unavailable (HTTP ${res.status}). Status unconfirmed.`,
      };
    }

    const data = await res.json();
    const message = data.message || {};

    const title = Array.isArray(message.title) ? message.title[0] : message.title;
    const journal = Array.isArray(message['container-title']) ? message['container-title'][0] : undefined;
    const year = message.created?.['date-parts']?.[0]?.[0] || message.issued?.['date-parts']?.[0]?.[0];
    const authors = Array.isArray(message.author) 
      ? message.author.map((a: { given?: string; family?: string }) => `${a.given || ''} ${a.family || ''}`.trim()).filter(Boolean)
      : [];

    let isRetracted = false;
    let isExpressionOfConcern = false;
    let retractionDetails: string | undefined = undefined;

    // Check Crossref update metadata:
    // 'updated-by' contains records that update THIS work (retraction notices, errata, expressions of concern)
    // 'update-to' contains records that this work updates (if this record is itself a notice)
    const updatedBy = Array.isArray(message['updated-by']) ? message['updated-by'] : [];
    const updateTo = Array.isArray(message['update-to']) ? message['update-to'] : [];
    const allUpdates = [...updatedBy, ...updateTo];

    for (const update of allUpdates) {
      const uType = String(update.type || '').toLowerCase();
      const uLabel = String(update.label || '').toLowerCase();

      if (uType === 'retraction' || uLabel.includes('retract')) {
        isRetracted = true;
        retractionDetails = update.doi
          ? `Crossref metadata indicates retraction (Notice DOI: ${update.doi})`
          : "Crossref metadata indicates article has been retracted";
        break;
      } else if (uType === 'expression_of_concern' || uLabel.includes('expression of concern')) {
        isExpressionOfConcern = true;
        retractionDetails = update.doi
          ? `Crossref metadata indicates Expression of Concern (Notice DOI: ${update.doi})`
          : "Subject to an editorial Expression of Concern";
      }
    }

    // Also check if publication type is retraction
    if (message.type === 'retraction') {
      isRetracted = true;
      retractionDetails = retractionDetails || "Crossref work type is classified as retraction";
    }

    // Check for explicit title prefix/marker (handles publisher deposits where update links weren't linked)
    const titleStr = typeof title === 'string' ? title : '';
    if (/^retracted\b/i.test(titleStr) || /[\[(]retracted[\])]/i.test(titleStr)) {
      isRetracted = true;
      retractionDetails = retractionDetails || "Article title explicitly marked as RETRACTED";
    } else if (/[\[(]expression of concern[\])]/i.test(titleStr)) {
      isExpressionOfConcern = true;
      retractionDetails = retractionDetails || "Article title explicitly marked with Expression of Concern";
    }

    // Also cross-reference against curated high-profile retractions database
    const knownStatus = checkRetractionStatus(doi, title);
    if (knownStatus.isRetracted) {
      isRetracted = true;
      retractionDetails = knownStatus.reason || retractionDetails;
    } else if (knownStatus.isExpressionOfConcern && !isRetracted) {
      isExpressionOfConcern = true;
      retractionDetails = knownStatus.reason || retractionDetails;
    }

    const finalStatus: ReferenceStatus = isRetracted
      ? "retracted"
      : isExpressionOfConcern
      ? "expression_of_concern"
      : "valid";

    return {
      doi,
      title,
      journal,
      year,
      authors,
      status: finalStatus,
      isRetracted,
      retractionDetails,
      crossrefUrl: message.URL || `https://doi.org/${doi}`,
    };
  } catch {
    // If request timed out or network error, mark as unchecked, NOT unresolvable
    return {
      doi,
      status: "unchecked",
      isRetracted: false,
      retractionDetails: "Crossref lookup timed out or network unavailable. Status unconfirmed.",
    };
  }
}

export async function batchVerifyReferences(rawReferences: string[]): Promise<ReferenceVerification[]> {
  const results: ReferenceVerification[] = new Array(rawReferences.length);
  const concurrency = 6;
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < rawReferences.length) {
      const idx = currentIndex++;
      const raw = rawReferences[idx];

      // Extract DOI if present, stripping trailing punctuation (dots, commas, semicolons, brackets)
      const doiMatch = raw.match(/\b(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)\b/i);
      const doi = doiMatch ? doiMatch[1].replace(/[.,;)\]]+$/, '') : undefined;

      if (doi) {
        const crossrefData = await verifyDOIWithCrossref(doi);
        results[idx] = {
          raw,
          doi,
          title: crossrefData.title,
          journal: crossrefData.journal,
          year: crossrefData.year,
          authors: crossrefData.authors,
          status: crossrefData.status || "unchecked",
          isRetracted: crossrefData.isRetracted || false,
          retractionDetails: crossrefData.retractionDetails,
          crossrefUrl: crossrefData.crossrefUrl,
        };
      } else {
        // Check for textual retraction or expression of concern markers
        const retractionCheck = checkRetractionStatus(undefined, raw);
        const isRetracted = retractionCheck.isRetracted;
        const isExpressionOfConcern = retractionCheck.isExpressionOfConcern;
        
        const status: ReferenceStatus = isRetracted
          ? "retracted"
          : isExpressionOfConcern
          ? "expression_of_concern"
          : "unchecked"; // Without a DOI or online match, references are UNCHECKED, never falsely claimed 'valid'

        results[idx] = {
          raw,
          status,
          isRetracted,
          retractionDetails: retractionCheck.reason,
        };
      }
    }
  }

  const workerCount = Math.min(concurrency, rawReferences.length);
  const workers = Array.from({ length: workerCount }, () => worker());
  await Promise.all(workers);

  return results;
}
