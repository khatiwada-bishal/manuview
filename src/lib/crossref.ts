import { ReferenceVerification } from "./types";
import { checkRetractionStatus } from "./retractions";

const POLITE_USER_AGENT = "ManuView-OpenPreSubmission/1.0 (mailto:research@manuview.org; https://github.com/khatiwada-bishal/manuview)";

export async function verifyDOIWithCrossref(doi: string): Promise<Partial<ReferenceVerification>> {
  const cleanDoi = encodeURIComponent(doi.trim());
  const url = `https://api.crossref.org/works/${cleanDoi}`;

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

    if (res.status === 404) {
      return {
        doi,
        status: "unresolvable",
        isRetracted: false,
      };
    }

    if (!res.ok) {
      return {
        doi,
        status: "unresolvable",
        isRetracted: false,
      };
    }

    const data = await res.json();
    const message = data.message || {};

    const title = Array.isArray(message.title) ? message.title[0] : message.title;
    const journal = Array.isArray(message['container-title']) ? message['container-title'][0] : undefined;
    const year = message.created?.['date-parts']?.[0]?.[0] || message.issued?.['date-parts']?.[0]?.[0];
    const authors = Array.isArray(message.author) 
      ? message.author.map((a: { given?: string; family?: string }) => `${a.given || ''} ${a.family || ''}`.trim())
      : [];

    // Check Crossref update metadata for retraction
    const updates = message['update-to'] || [];
    let isRetracted = false;
    let retractionDetails: string | undefined = undefined;

    for (const update of updates) {
      if (update.type === 'retraction') {
        isRetracted = true;
        retractionDetails = `Crossref update indicates retraction (update DOI: ${update.doi})`;
        break;
      }
    }

    // Also check known retractions list
    const knownStatus = checkRetractionStatus(doi, title);
    if (knownStatus.isRetracted) {
      isRetracted = true;
      retractionDetails = knownStatus.reason;
    }

    return {
      doi,
      title,
      journal,
      year,
      authors,
      status: isRetracted ? "retracted" : "valid",
      isRetracted,
      retractionDetails,
      crossrefUrl: message.URL || `https://doi.org/${doi}`,
    };
  } catch {
    // If request timed out or network error, fallback to graceful response
    return {
      doi,
      status: "unresolvable",
      isRetracted: false,
    };
  }
}

export async function batchVerifyReferences(rawReferences: string[]): Promise<ReferenceVerification[]> {
  const results: ReferenceVerification[] = [];

  for (const raw of rawReferences) {
    // Extract DOI if present
    const doiMatch = raw.match(/\b(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)\b/i);
    const doi = doiMatch ? doiMatch[1].replace(/[.,;)]$/, '') : undefined;

    if (doi) {
      const crossrefData = await verifyDOIWithCrossref(doi);
      results.push({
        raw,
        doi,
        title: crossrefData.title,
        journal: crossrefData.journal,
        year: crossrefData.year,
        authors: crossrefData.authors,
        status: crossrefData.status || "unresolvable",
        isRetracted: crossrefData.isRetracted || false,
        retractionDetails: crossrefData.retractionDetails,
        crossrefUrl: crossrefData.crossrefUrl,
      });
    } else {
      // Check for textual retraction markers
      const retractionCheck = checkRetractionStatus(undefined, raw);
      results.push({
        raw,
        status: retractionCheck.isRetracted ? "retracted" : "valid",
        isRetracted: retractionCheck.isRetracted,
        retractionDetails: retractionCheck.reason,
      });
    }
  }

  return results;
}
