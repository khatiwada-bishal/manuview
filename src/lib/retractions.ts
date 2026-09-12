// Retraction keywords, flagged publishers, and common retracted DOI prefixes / examples
export interface RetractionCheckResult {
  isRetracted: boolean;
  isExpressionOfConcern: boolean;
  reason?: string;
}

// Known high-profile retracted papers database (verified primary sources)
const KNOWN_RETRACTED_DOIS: Record<string, string> = {
  // Wakefield MMR autism paper (The Lancet) - Verified retraction
  "10.1016/s0140-6736(97)11096-0": "Retracted: Completely falsified data regarding MMR vaccine and autism.",
  // Surgisphere COVID-19 Hydroxychloroquine paper (The Lancet) - Verified retraction
  "10.1016/s0140-6736(20)31180-6": "Retracted: Authors unable to conduct independent audit of Surgisphere database.",
  // Surgisphere COVID-19 cardiovascular paper (NEJM) - Verified retraction
  "10.1056/nejmoa2007621": "Retracted: Database veracity could not be validated.",
  // STAP cell pluripotency (Obokata et al., Nature 2014) - Verified retraction
  "10.1038/nature12968": "Retracted: Critical errors and fabricated image data in STAP cell pluripotency study.",
  // Room-temperature superconductivity CSH claim (Snider, Dias et al., Nature 2020) - Verified retraction
  "10.1038/s41586-020-2801-z": "Retracted: Irregularities in background subtraction methods.",
  // Disputed microplastics in fish larvae (Lönnstedt & Eklöv, Science 2016) - Verified retraction
  "10.1126/science.aad8828": "Retracted: Suspected data fabrication and missing raw files.",
  // Substance dependence association (Gelernter et al., PNAS 2009) - Verified retraction
  "10.1073/pnas.0908521106": "Retracted: Irreproducible genotyping in PKNOX2 substance dependence association study.",
};

export function checkRetractionStatus(doi?: string, textOrTitle?: string): RetractionCheckResult {
  if (doi) {
    const cleanDoi = doi.trim().toLowerCase();
    for (const [retractedDoi, reason] of Object.entries(KNOWN_RETRACTED_DOIS)) {
      if (cleanDoi === retractedDoi.toLowerCase()) {
        return {
          isRetracted: true,
          isExpressionOfConcern: false,
          reason,
        };
      }
    }
  }

  if (textOrTitle) {
    // Scope textual-marker scan strictly to the title portion of reference string (REQ-CIT-03)
    let titleToScan = textOrTitle;
    const quoteMatch = textOrTitle.match(/["“]([^"”]+)["”]/);
    if (quoteMatch) {
      titleToScan = quoteMatch[1];
    } else {
      const parts = textOrTitle.split(/\.\s+/);
      if (parts.length >= 2) {
        // Author. Title. Journal / Year
        titleToScan = parts[1];
      }
    }

    const lower = titleToScan.toLowerCase();
    if (
      lower.includes("[retracted]") ||
      lower.includes("(retracted)") ||
      /^retracted\b/i.test(lower) ||
      lower.includes("retraction notice:") ||
      lower.includes("retraction of:")
    ) {
      return {
        isRetracted: true,
        isExpressionOfConcern: false,
        reason: "Reference title explicitly contains retraction notice or marker.",
      };
    }

    // Only flag Expression of Concern if present in the article title, not in a journal name/note
    if (
      lower.includes("expression of concern") &&
      !lower.includes("journal of") &&
      !lower.includes("annual review")
    ) {
      return {
        isRetracted: false,
        isExpressionOfConcern: true,
        reason: "Subject to an editorial Expression of Concern.",
      };
    }
  }

  return {
    isRetracted: false,
    isExpressionOfConcern: false,
  };
}
