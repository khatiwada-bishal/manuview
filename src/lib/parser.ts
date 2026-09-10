import mammoth from "mammoth";
import { ParsedManuscript, DocumentClassification, DocumentCategory } from "./types";
import { extractReferencesFromText } from "./utils";

import zlib from "zlib";

export async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

/**
 * Native PDF stream text extraction fallback.
 * Decompresses FlateDecode and raw text streams directly using zlib,
 * extracting text tokens (Tj, TJ, ', ") without depending on external PDF workers.
 */
export function fallbackExtractPdfText(buffer: Buffer): string {
  const binaryString = buffer.toString("binary");
  const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
  let match: RegExpExecArray | null;
  const chunks: string[] = [];

  while ((match = streamRegex.exec(binaryString)) !== null) {
    const rawStream = Buffer.from(match[1], "binary");
    let decompressed: string | null = null;

    try {
      decompressed = zlib.inflateSync(rawStream).toString("utf-8");
    } catch {
      try {
        decompressed = zlib.inflateRawSync(rawStream).toString("utf-8");
      } catch {
        // Maybe uncompressed ASCII stream
        decompressed = rawStream.toString("utf-8");
      }
    }

    if (decompressed) {
      // 1. Extract (Text) Tj, ', "
      const tjMatches = decompressed.match(/\(([^)]+)\)\s*(?:Tj|'|")/g);
      if (tjMatches) {
        for (const m of tjMatches) {
          const text = m.replace(/^\(/, "").replace(/\)\s*(?:Tj|'|")$/, "");
          if (text.trim()) chunks.push(text);
        }
      }

      // 2. Extract [(T) 10 (e) 20 (x) (t)] TJ
      const bigTjMatches = decompressed.match(/\[([^\]]+)\]\s*TJ/g);
      if (bigTjMatches) {
        for (const m of bigTjMatches) {
          const inner = m.replace(/^\[/, "").replace(/\]\s*TJ$/, "");
          const subMatches = inner.match(/\(([^)]+)\)/g);
          if (subMatches) {
            const combined = subMatches.map((s) => s.slice(1, -1)).join("");
            if (combined.trim()) chunks.push(combined);
          }
        }
      }
    }
  }

  // Join lines and clean up excessive whitespace
  return chunks.join(" ").replace(/\s{2,}/g, " ").trim();
}

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  const uint8Data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);

  // 1. Try standard pdf-parse with safe Uint8Array
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: uint8Data });
    const textResult = await parser.getText({ pageJoiner: "\n\n" });
    const cleanText = textResult.pages?.map((p: any) => p.text).filter(Boolean).join("\n\n") || textResult.text || "";
    await parser.destroy();

    if (cleanText.trim().length >= 20) {
      return cleanText;
    }
  } catch (primaryErr: any) {
    console.warn("Primary PDF parser encountered an issue, falling back to native stream extraction:", primaryErr?.message);
  }

  // 2. Resilient native PDF stream fallback
  try {
    const fallbackText = fallbackExtractPdfText(buffer);
    if (fallbackText.trim().length >= 20) {
      return fallbackText;
    }
  } catch (fallbackErr: any) {
    console.warn("Fallback PDF stream extraction failed:", fallbackErr?.message);
  }

  // 3. Informative error if no extractable text is present
  throw new Error(
    "The uploaded PDF does not contain extractable text. It may be an image-only scan or password-protected. Please upload a PDF with a selectable text layer, a Word document (.docx), or paste the text directly."
  );
}

/**
 * Heuristically classifies uploaded/pasted text into document categories
 * to distinguish authentic academic manuscripts from code, resumes, proposals, or random files.
 */
/**
 * Heuristically classifies uploaded/pasted text into document categories
 * to distinguish authentic academic manuscripts from code, resumes, proposals, or random files.
 * Accurately supports empirical, clinical, theoretical, mathematical, operations research,
 * computational, and review manuscripts.
 */
export function classifyDocument(rawText: string, filename?: string): DocumentClassification {
  const clean = rawText.trim();
  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  const lower = clean.toLowerCase();
  const ext = filename ? filename.split('.').pop()?.toLowerCase() : '';

  // =========================================================================
  // 1. ACADEMIC MANUSCRIPT DETECTION (Primary Comprehensive Check)
  // Evaluates whether this document possesses authentic scholarly architecture:
  // - Empirical & Clinical Science
  // - Theoretical & Mathematical / Operations Research Formulations
  // - Computational & Machine Learning Articles
  // - Systematic Reviews & Meta-Analyses
  // =========================================================================

  const hasAbstract = /(?:^|\n)\s*(?:Abstract|Summary)\s*[:\n\r]/i.test(clean) || /^\s*Abstract\b/im.test(clean);
  const hasIntro = /(?:^|\n)\s*(?:\d+[\.\s]+)?(?:Introduction|Background|Literature Review)\b/i.test(clean);
  const hasMethodsOrModel = /(?:^|\n)\s*(?:\d+[\.\s]+)?(?:Methods|Materials and Methods|Methodology|Model Development|Mathematical Formulation|Theoretical Framework|System Model|Problem Formulation|Assumptions|Solution Procedure|Algorithm \d+)\b/i.test(clean);
  const hasResultsOrNumerical = /(?:^|\n)\s*(?:\d+[\.\s]+)?(?:Results|Findings|Numerical Example|Numerical Analysis|Numerical Results|Simulation Results|Computational Experiments|Sensitivity Analysis|Case Study)\b/i.test(clean);
  const hasDiscussionOrImplications = /(?:^|\n)\s*(?:\d+[\.\s]+)?(?:Discussion|Practical Implications|Managerial Insights)\b/i.test(clean);
  const hasConclusion = /(?:^|\n)\s*(?:\d+[\.\s]+)?(?:Conclusion|Conclusions|Concluding Remarks|Summary and Outlook)\b/i.test(clean);
  
  const hasReferences = /(?:^|\n)\s*(?:References|Bibliography|Works Cited|Literature Cited)\s*[:\n\r]/i.test(clean) ||
                        /DOI:\s*10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/i.test(clean) ||
                        /(?:\n\s*(?:\[\d+\]|\d+\.)\s+[A-Z][a-z]+,\s*[A-Z])/i.test(clean);

  // Scholarly metadata (publishers, peer review status, university affiliation, editorial tracking)
  const hasScholarlyMeta = /(?:Department of\s+|Faculty of\s+|University\b|Institute of\s+|doi:\s*10\.\d+|Received:\s*\d|Accepted:\s*\d|©\s*The Author|Keywords\s*[:\s]|Index Terms|Corresponding author|Springer|Elsevier|IEEE|Nature|Wiley)/i.test(clean);

  // Domain scientific & quantitative vocabulary across disciplines
  const hasAcademicTerms = /(?:statistically\s+significant|p\s*[<=]\s*0\.\d+|confidence\s+interval|optimization|equilibrium|formulation|theorem|lemma|proposition|sensitivity analysis|simulation|algorithm|objective function|decision variable|supply chain|carbon tax|cap-and-trade|hypothesis|empirical|regression|in\s+vivo|in\s+vitro|assay|cohort|organoid)/i.test(clean);

  let academicScore = 0;
  if (hasAbstract) academicScore += 3;
  if (hasReferences) academicScore += 3;
  if (hasIntro) academicScore += 2;
  if (hasMethodsOrModel) academicScore += 2;
  if (hasResultsOrNumerical) academicScore += 2;
  if (hasDiscussionOrImplications) academicScore += 1;
  if (hasConclusion) academicScore += 1;
  if (hasScholarlyMeta) academicScore += 2;
  if (hasAcademicTerms) academicScore += 1;

  const isAcademic = (academicScore >= 5) || 
                     (hasAbstract && (hasReferences || hasIntro || hasMethodsOrModel || hasResultsOrNumerical)) ||
                     (hasReferences && (hasIntro || hasMethodsOrModel || hasResultsOrNumerical));

  if (isAcademic) {
    const detected: string[] = [];
    if (hasAbstract) detected.push('Abstract / Summary section identified');
    if (hasMethodsOrModel) detected.push('Methodology / Theoretical Model formulation identified');
    if (hasResultsOrNumerical) detected.push('Results / Numerical experiments identified');
    if (hasReferences) detected.push('Scholarly Bibliography / Reference citations detected');
    if (hasScholarlyMeta) detected.push('Academic metadata & institutional affiliation detected');
    if (hasAcademicTerms) detected.push('Domain scientific & quantitative terminology verified');

    let subType = 'Empirical / Theoretical Research Article';
    if (/nonlinear optimization|supply chain|inventory model|decision variable|theorem|lemma|objective function|cap-and-trade/i.test(clean)) {
      subType = 'Theoretical & Operations Research Formulation';
    } else if (/in vivo|in vitro|clinical trial|patient|cohort|assay|crispr|tumor|pathology/i.test(clean)) {
      subType = 'Empirical Laboratory / Clinical Study';
    } else if (/systematic review|meta-analysis|prisma|literature review|scoping review/i.test(clean)) {
      subType = 'Review / Synthesis Article';
    } else if (/neural network|deep learning|transformer|benchmark|dataset|convolutional/i.test(clean)) {
      subType = 'Computational & Algorithmic Research';
    }

    return {
      category: 'academic_manuscript',
      categoryLabel: `Academic Manuscript (${subType})`,
      isAcademicManuscript: true,
      confidence: Math.min(0.85 + (academicScore * 0.02), 0.99),
      detectedFeatures: detected,
      salutation: 'Dear Author / Contributing Researcher',
      advisoryMessage: `Your submission has been verified as an authentic ${subType}. ManuView has evaluated your work against rigorous peer-review rubrics across 6 core dimensions, screening for causal overclaims, mathematical/statistical soundness, reference integrity, and journal desk-rejection hazards.`,
      customGuidance: 'Review the prioritized action items (Priority A desk-reject hazards and Priority B reviewer pushback) and consult the 4 simulated peer-reviewer personas before submitting to your target journal.'
    };
  }

  // =========================================================================
  // 2. Source Code / Software Script Detection
  // Only flags true source code repositories or standalone scripts, never scholarly papers with math or algorithms.
  // =========================================================================
  const codeExtensions = ['py', 'js', 'ts', 'tsx', 'jsx', 'java', 'cpp', 'c', 'h', 'cs', 'go', 'rs', 'rb', 'php', 'swift', 'kt', 'sh', 'bash', 'sql'];
  const isCodeFileExt = codeExtensions.includes(ext || '');

  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);
  const codeLines = lines.filter(l => 
    /^(?:import\s+.+from|from\s+\w+\s+import|const\s+\w+\s*=|let\s+\w+\s*=|var\s+\w+\s*=|def\s+\w+\(|function\s+\w*\(|public\s+class\s+\w+|class\s+\w+[\s\w]*\{|#include\s+<|package\s+[\w\.]+;|console\.log\(|return\s+.*;|if\s*\(.+\)\s*\{|}\s*else\s*\{|\/\*|\*\/|\/\/)/.test(l)
  );
  const codeRatio = lines.length > 0 ? codeLines.length / lines.length : 0;
  const isCode = isCodeFileExt || (codeRatio > 0.35 && lines.length > 5);

  if (isCode) {
    return {
      category: 'source_code',
      categoryLabel: 'Source Code / Software Script',
      isAcademicManuscript: false,
      confidence: 0.95,
      detectedFeatures: [
        'Programming language syntax and structure detected',
        'Functions, classes, or package declarations identified',
        'Absence of empirical scholarly IMRaD sections'
      ],
      salutation: 'Hello Developer / Software Engineer',
      advisoryMessage: 'We detected that this file is source code or a software script rather than an academic research manuscript. While computational code is critical for reproducibility, ManuView is calibrated for scientific peer review of empirical and theoretical manuscripts (research hypotheses, experimental design, causal inferences, and reference integrity).',
      customGuidance: 'If you are preparing a computational methods paper or software article for a journal (e.g., Nature Methods, Bioinformatics, JOSS), please provide the full manuscript draft including Abstract, Methodology, Benchmarking, and Literature Citations alongside your code.'
    };
  }

  // =========================================================================
  // 3. Resume / Curriculum Vitae
  // =========================================================================
  const resumeHeadingRegex = /(?:\bcurriculum\s+vitae\b|\bresume\b|work\s+experience|professional\s+experience|employment\s+history|education\s*(?::|\n)|technical\s+skills|certifications\s*(?::|\n)|honors\s*(&|and)\s*awards|references\s+available\s+upon\s+request)/i;
  const contactPatternRegex = /(?:email\s*:|phone\s*:|linkedin\.com\/|github\.com\/|\bgpa\s*:\s*\d)/i;
  const isResume = resumeHeadingRegex.test(clean) && (contactPatternRegex.test(clean) || lower.includes('curriculum vitae') || lower.includes('resume'));

  if (isResume) {
    return {
      category: 'resume_cv',
      categoryLabel: 'Curriculum Vitae / Resume',
      isAcademicManuscript: false,
      confidence: 0.92,
      detectedFeatures: [
        'Curriculum Vitae or Resume section headings identified',
        'Professional experience, education, or skill listings detected',
        'Contact details or biographical profile structure'
      ],
      salutation: 'Hello Candidate / Academic Professional',
      advisoryMessage: 'We detected that this document is a Curriculum Vitae or professional resume. Standard journal peer-review metrics (such as experimental controls, sample size justification, and desk-rejection hazards) do not apply to professional qualification records.',
      customGuidance: 'To evaluate scientific research readiness, please submit an empirical manuscript, preprint draft, or grant research narrative.'
    };
  }

  // =========================================================================
  // 4. Grant / Research Project Proposal
  // =========================================================================
  const grantProposalRegex = /(?:specific\s+aims|broader\s+impacts|intellectual\s+merit|project\s+narrative|budget\s+justification|principal\s+investigator|co-pi\b|nih\s+grant|nsf\s+proposal|funding\s+opportunity)/i;
  if (grantProposalRegex.test(clean) && !lower.includes('journal') && !lower.includes('peer review')) {
    return {
      category: 'grant_proposal',
      categoryLabel: 'Grant / Project Proposal',
      isAcademicManuscript: false,
      confidence: 0.88,
      detectedFeatures: [
        'Grant funding proposal markers detected (e.g. Specific Aims / Project Narrative)',
        'Investigator role or funding agency terminology present'
      ],
      salutation: 'Hello Principal Investigator / Project Lead',
      advisoryMessage: 'We detected that this document is structured as a grant funding application or research project proposal rather than a completed journal manuscript. Grant evaluations emphasize project feasibility and institutional resources rather than journal publication scope.',
      customGuidance: 'Focus your review on whether Specific Aims are clearly independent, feasibility is supported by preliminary data, and potential pitfalls are accompanied by robust mitigation strategies.'
    };
  }

  // =========================================================================
  // 5. Business or Administrative Document
  // =========================================================================
  const businessAdminRegex = /(?:invoice\s*#|bill\s+to\s*:|total\s+due\s*:|statement\s+of\s+work|\bnda\b|non-disclosure\s+agreement|balance\s+sheet|purchase\s+order|meeting\s+minutes|terms\s+and\s+conditions)/i;
  if (businessAdminRegex.test(clean)) {
    return {
      category: 'business_or_admin',
      categoryLabel: 'Administrative / Business Document',
      isAcademicManuscript: false,
      confidence: 0.90,
      detectedFeatures: [
        'Administrative, commercial, or legal formatting detected',
        'Absence of scholarly hypotheses and empirical data'
      ],
      salutation: 'Notice to Submitter (Administrative / Business Document)',
      advisoryMessage: 'We detected that this document is an administrative, commercial, or operational document (such as an invoice, contract, or internal memo). ManuView is designed specifically to analyze scientific preprints and journal research papers.',
      customGuidance: 'Please upload an academic research draft (empirical paper, review article, or clinical study) to use our peer-review diagnostic features.'
    };
  }

  // =========================================================================
  // 6. Very short or unstructured text
  // =========================================================================
  const isShortOrFragment = wordCount < 45;
  const shoppingListKeywords = ['buy', 'milk', 'eggs', 'bread', 'apples', 'groceries', 'store', 'tomorrow', 'meeting', 'reminder'];
  const matchedShopping = shoppingListKeywords.filter(k => lower.includes(k)).length;

  if ((isShortOrFragment && !hasAcademicTerms) || matchedShopping >= 3) {
    return {
      category: 'random_unstructured',
      categoryLabel: 'Unstructured / Random Text',
      isAcademicManuscript: false,
      confidence: 0.96,
      detectedFeatures: [
        `Word count is very low (${wordCount} words)`,
        'No scholarly structure (Title, Abstract, Methods, Results, or References)',
        'Informal or fragmented phrasing'
      ],
      salutation: 'Attention: Unstructured or Non-Academic Text Detected',
      advisoryMessage: 'The submitted content consists of unstructured text, casual notes, or brief fragments rather than a scholarly manuscript. Academic peer review requires a coherent research narrative: a title, research context (abstract/introduction), formal methodology, empirical findings, and references.',
      customGuidance: "To see how ManuView evaluates a genuine research paper, click 'Load Sample Preprint' above or upload a complete .docx or .pdf manuscript with Title, Abstract, Methods, and References."
    };
  }

  // =========================================================================
  // 7. Technical Documentation / Whitepaper
  // =========================================================================
  const techDocRegex = /(?:api\s+reference|endpoints?\s*:|installation\s+guide|getting\s+started|sdk\s+reference|architecture\s+overview|prerequisites\s*:|quickstart)/i;
  if (techDocRegex.test(clean)) {
    return {
      category: 'technical_doc',
      categoryLabel: 'Technical Documentation / Whitepaper',
      isAcademicManuscript: false,
      confidence: 0.85,
      detectedFeatures: [
        'Technical documentation or software specification headings found',
        'Instructional or API reference structure'
      ],
      salutation: 'Hello Technical Author / Documentation Lead',
      advisoryMessage: 'We detected technical documentation or product specifications. While technically rigorous, documentation differs from peer-reviewed scientific literature where hypotheses, statistical power, and academic literature citations are systematically audited.',
      customGuidance: 'If this technical work introduces a novel algorithm or system architecture for academic submission, structure it with empirical baselines, related work citations, and ablation studies for venues like IEEE, ACM, or NeurIPS.'
    };
  }

  // =========================================================================
  // 8. General essay or creative writing fallback
  // =========================================================================
  return {
    category: 'general_or_creative',
    categoryLabel: 'General Essay / Non-Academic Prose',
    isAcademicManuscript: false,
    confidence: 0.75,
    detectedFeatures: [
      'Prose text in paragraph format',
      'Absence of formal empirical methods or scientific data tables',
      'Absence of peer-reviewed references or DOI citations'
    ],
    salutation: 'Hello Author / Writer',
    advisoryMessage: 'We detected a general essay, opinion piece, or informational text without empirical scientific methodology or peer-reviewed literature citations. ManuView is calibrated for scientific preprints and journal submissions.',
    customGuidance: 'If this is intended as an academic perspective or review article, ensure formal literature citations, scholarly framing, and structured theoretical or empirical analysis are incorporated.'
  };
}

export function parseManuscriptText(rawText: string, filename?: string): ParsedManuscript {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // 1. Classify document type
  const classification = classifyDocument(rawText, filename);

  // 2. Detect Title (filters out journal banners, category tags, DOIs, and preprint watermarks)
  let title = "Untitled Document";
  const skipHeaderRegex = /^(?:biorxiv|medrxiv|arxiv|springer|nature|elsevier|ieee|cell|wiley|plos|frontiers|mdpi|iop|acm|sage|taylor|oxford|cambridge|opsearch|journal\b|international\s+journal|annals\b|proceedings\b|theoretical\s+article|original\s+(?:research|article)|research\s+article|review\s+article|regular\s+article|brief\s+report|case\s+report|short\s+communication|perspective|commentary|editorial|letter\s+to|check\s+for\s+updates|extended\s+author|published\s+online|received\s*:|accepted\s*:|revised\s*:|https?:|doi\s*:|page\s+\d+|vol\.\s*\d+|no\.\s*\d+|open\s+access|peer-reviewed|copyright|the\s+author\(s\)|all\s+rights\s+reserved|©)/i;

  for (let i = 0; i < Math.min(lines.length, 12); i++) {
    const candidate = lines[i];
    if (skipHeaderRegex.test(candidate)) continue;
    if (/^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}$/.test(candidate) || /^\d+$/.test(candidate)) continue;
    if (candidate.length > 12) {
      // Check if line wraps onto the next line (common in two-line article titles)
      if (
        i + 1 < lines.length &&
        !skipHeaderRegex.test(lines[i + 1]) &&
        !/^(?:by\b|abstract\b|[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s*,\s*|\s*·|\s+and\s+)|\d+\b|keywords)/i.test(lines[i + 1]) &&
        lines[i + 1].length > 5 &&
        lines[i + 1].length < 85
      ) {
        title = `${candidate} ${lines[i + 1]}`;
      } else {
        title = candidate;
      }
      break;
    }
  }
  if (title === "Untitled Document" && lines.length > 0) {
    title = lines[0];
  }

  // 3. Detect Abstract
  let abstract = "";
  const abstractMatch = rawText.match(/(?:Abstract|Summary)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:Keywords|Key\s*words|1\b|Introduction|Background)))/i);
  if (abstractMatch && abstractMatch[1]) {
    abstract = abstractMatch[1].trim();
  } else {
    // Fallback: search for first 300 words
    abstract = lines.slice(1, 5).join(' ');
  }

  // 4. Extract sections (supporting empirical, clinical, theoretical, and operations research)
  const sections: ParsedManuscript['sections'] = {};

  // Introduction / Background / Literature Review
  const introMatch = rawText.match(/(?:^|\n)\s*(?:\d+[\.\s]+)?(?:Introduction|Background|Literature Review)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:\d+[\.\s]+)?(?:Methods|Materials and Methods|Methodology|Model|Theoretical|Assumptions|Problem Formulation|2\b)))/i);
  if (introMatch) sections.introduction = introMatch[1].trim().slice(0, 5000);

  // Methodology / Model Development / Theoretical Formulation
  const methodsMatch = rawText.match(/(?:^|\n)\s*(?:\d+[\.\s]+)?(?:Methods|Materials and Methods|Methodology|Model Development|Mathematical Formulation|Theoretical Framework|System Model|Assumptions|Problem Formulation|Proposed Approach)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:\d+[\.\s]+)?(?:Results|Findings|Numerical Example|Numerical Analysis|Numerical Results|Simulation Results|Computational Experiments|Sensitivity Analysis|Discussion|Conclusion|7\b|8\b)))/i);
  if (methodsMatch) sections.methods = methodsMatch[1].trim().slice(0, 6000);

  // Results / Numerical Examples / Experiments
  const resultsMatch = rawText.match(/(?:^|\n)\s*(?:\d+[\.\s]+)?(?:Results|Findings|Numerical Example|Numerical Analysis|Numerical Results|Simulation Results|Computational Experiments|Sensitivity Analysis|Case Study)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:\d+[\.\s]+)?(?:Discussion|Managerial Insights|Practical Implications|Conclusion|Conclusions|10\b|11\b|References)))/i);
  if (resultsMatch) sections.results = resultsMatch[1].trim().slice(0, 6000);

  // Discussion / Managerial Insights / Practical Implications
  const discussionMatch = rawText.match(/(?:^|\n)\s*(?:\d+[\.\s]+)?(?:Discussion|Managerial Insights|Practical Implications)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:\d+[\.\s]+)?(?:Conclusion|Conclusions|References|11\b)))/i);
  if (discussionMatch) sections.discussion = discussionMatch[1].trim().slice(0, 5000);

  // 5. Extract References
  const references = extractReferencesFromText(rawText);

  // 6. Word count
  const wordCount = rawText.split(/\s+/).filter(Boolean).length;

  return {
    title,
    abstract,
    authors: [],
    wordCount,
    sections,
    rawText,
    references,
    classification,
  };
}
