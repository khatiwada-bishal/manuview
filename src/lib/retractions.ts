// Retraction keywords, flagged publishers, and common retracted DOI prefixes / examples
export interface RetractionCheckResult {
  isRetracted: boolean;
  isExpressionOfConcern: boolean;
  reason?: string;
}

// Known high-profile retracted papers database (sample representative corpus)
const KNOWN_RETRACTED_DOIS: Record<string, string> = {
  // Wakefield MMR autism paper (The Lancet)
  "10.1016/S0140-6736(97)11096-0": "Retracted: Completely falsified data regarding MMR vaccine and autism.",
  // Surgisphere COVID-19 Hydroxychloroquine paper (The Lancet)
  "10.1016/S0140-6736(20)31180-6": "Retracted: Authors unable to conduct independent audit of Surgisphere database.",
  // Surgisphere COVID-19 cardiovascular paper (NEJM)
  "10.1056/NEJMoa2007621": "Retracted: Database veracity could not be validated.",
  // STAP cell pluripotency (Nature)
  "10.1038/nature13008": "Retracted: Critical errors and fabricated image data found in multiple figures.",
  // Superconductivity LK-99 / Room temp SC claims (Nature)
  "10.1038/s41586-020-2801-z": "Retracted: Irregularities in background subtraction methods.",
  // Disputed microplastics in fish larvae (Science)
  "10.1126/science.aad8828": "Retracted: Suspected data fabrication and missing raw files.",
  // Plant biology falsified western blots
  "10.1073/pnas.1206123109": "Retracted: Re-use of spliced western blot lanes.",
};

export function checkRetractionStatus(doi?: string, rawText?: string): RetractionCheckResult {
  if (doi) {
    const cleanDoi = doi.trim().toLowerCase();
    for (const [retractedDoi, reason] of Object.entries(KNOWN_RETRACTED_DOIS)) {
      if (cleanDoi.toLowerCase() === retractedDoi.toLowerCase()) {
        return {
          isRetracted: true,
          isExpressionOfConcern: false,
          reason,
        };
      }
    }
  }

  if (rawText) {
    const lower = rawText.toLowerCase();
    if (lower.includes("[retracted]") || lower.includes("(retracted)") || lower.includes("retraction notice")) {
      return {
        isRetracted: true,
        isExpressionOfConcern: false,
        reason: "Reference explicitly contains retraction notice or marker.",
      };
    }
    if (lower.includes("expression of concern")) {
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
