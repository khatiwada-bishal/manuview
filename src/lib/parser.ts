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
export function classifyDocument(rawText: string, filename?: string): DocumentClassification {
  const clean = rawText.trim();
  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  const lower = clean.toLowerCase();

  // 1. Check filename extension if provided
  const ext = filename ? filename.split('.').pop()?.toLowerCase() : '';
  const codeExtensions = ['py', 'js', 'ts', 'tsx', 'jsx', 'java', 'cpp', 'c', 'h', 'cs', 'go', 'rs', 'rb', 'php', 'swift', 'kt', 'sh', 'bash', 'sql', 'json', 'yaml', 'yml', 'xml', 'html', 'css'];

  // Code indicators
  const codeKeywordsRegex = /(?:^\s*(?:import\s+|from\s+\w+\s+import|const\s+|let\s+|var\s+|def\s+\w+|function\s+\w*|public\s+class|func\s+\w+|#include|package\s+\w+|SELECT\s+.*FROM|CREATE\s+TABLE)\b)/m;
  const codeSyntaxCount = (clean.match(/(?:=>|===|!==|;|{|}|console\.log|print\(|\bdef\s+|\bdef\b|\bint\s+\w+|System\.out\.println)/g) || []).length;
  const isCode = codeExtensions.includes(ext || '') || (codeSyntaxCount > 5 && codeKeywordsRegex.test(clean));

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
      advisoryMessage: 'We detected that this file is source code or a software script rather than an academic research manuscript. While computational code is critical for reproducibility, ManuView is calibrated for scientific peer review of empirical manuscripts (research hypotheses, experimental design, causal inferences, and reference integrity).',
      customGuidance: 'If you are preparing a computational methods paper or software article for a journal (e.g., Nature Methods, Bioinformatics, JOSS), please provide the full manuscript draft including Abstract, Methodology, Benchmarking, and Literature Citations alongside your code.'
    };
  }

  // 2. Resume / CV indicators
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

  // 3. Grant / Research Project Proposal indicators
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

  // 4. Business or Administrative Document indicators
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

  // 5. Very short or unstructured text (Shopping list, fragments, casual chat)
  const isShortOrFragment = wordCount < 45;
  const shoppingListKeywords = ['buy', 'milk', 'eggs', 'bread', 'apples', 'groceries', 'store', 'tomorrow', 'meeting', 'reminder'];
  const matchedShopping = shoppingListKeywords.filter(k => lower.includes(k)).length;
  const hasAcademicKeywords = /(?:abstract|methods|results|discussion|doi|hypothesis|significant|cohort|p\s*[<=]\s*0\.\d+)/i.test(clean);

  if ((isShortOrFragment && !hasAcademicKeywords) || matchedShopping >= 3) {
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
      customGuidance: "To see how ManuView evaluates a genuine research paper, click 'Load Sample Preprint' above or upload a complete .docx manuscript with Title, Abstract, Methods, and References."
    };
  }

  // 6. Technical Documentation / Whitepaper
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

  // 7. Academic Manuscript Check
  const hasAbstract = /(?:Abstract|Summary)\s*[:\n\r]/i.test(clean);
  const hasMethods = /(?:Methods|Materials and Methods|Methodology)\s*[:\n\r]/i.test(clean);
  const hasResults = /(?:Results|Findings)\s*[:\n\r]/i.test(clean);
  const hasDiscussion = /(?:Discussion|Conclusion|Conclusions)\s*[:\n\r]/i.test(clean);
  const hasReferences = /(?:References|Bibliography|Works Cited)\s*[:\n\r]/i.test(clean) || /DOI:\s*10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/i.test(clean);
  const hasScholarlyTerms = /(?:statistically\s+significant|p\s*[<=]\s*0\.\d+|confidence\s+interval|in\s+vivo|in\s+vitro|assay|knockdown|crispr|cohort|organoid|two-tailed|fold\s+change|transcription)/i.test(clean);

  const academicScore = (hasAbstract ? 2 : 0) + 
                        (hasMethods ? 2 : 0) + 
                        (hasResults ? 2 : 0) + 
                        (hasDiscussion ? 1 : 0) + 
                        (hasReferences ? 2 : 0) + 
                        (hasScholarlyTerms ? 2 : 0);

  if (academicScore >= 4 || (hasAbstract && (hasMethods || hasReferences))) {
    const detected: string[] = [];
    if (hasAbstract) detected.push('Abstract / Summary section identified');
    if (hasMethods) detected.push('Empirical Methodology section identified');
    if (hasResults) detected.push('Experimental Results / Findings identified');
    if (hasReferences) detected.push('Scholarly Bibliography / DOI references detected');
    if (hasScholarlyTerms) detected.push('Scientific statistical terminology present');

    return {
      category: 'academic_manuscript',
      categoryLabel: 'Academic Research Manuscript',
      isAcademicManuscript: true,
      confidence: Math.min(0.70 + (academicScore * 0.03), 0.99),
      detectedFeatures: detected,
      salutation: 'Dear Author / Contributing Researcher',
      advisoryMessage: 'Your submission has been verified as an academic research draft. ManuView has evaluated your work against rigorous peer-review rubrics across 6 core dimensions, screening for causal overclaims, sample power, reference integrity, and journal desk-rejection hazards.',
      customGuidance: 'Review the prioritized action items (Priority A desk-reject hazards and Priority B reviewer pushback) and consult the 4 simulated peer-reviewer personas before submitting to your target journal.'
    };
  }

  // 8. General essay or creative writing fallback
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

  // 2. Detect Title (typically first substantive non-header line)
  let title = "Untitled Document";
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const candidate = lines[i];
    // Skip running headers, preprint servers, and DOI watermarks common in PDF exports
    if (/^(?:biorxiv|medrxiv|arxiv|springer|nature|elsevier|ieee|cell|wiley|plos|doi:|https?:|page\s+\d+|article\b|review\b|vol\.\s*\d+|open\s+access|peer-reviewed)/i.test(candidate)) {
      continue;
    }
    // Skip lines that are just dates or volume numbers
    if (/^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}$/.test(candidate) || /^\d+$/.test(candidate)) {
      continue;
    }
    if (candidate.length > 12) {
      title = candidate;
      break;
    }
  }
  if (title === "Untitled Document" && lines.length > 0) {
    title = lines[0];
  }

  // 3. Detect Abstract
  let abstract = "";
  const abstractMatch = rawText.match(/(?:Abstract|Summary)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:Introduction|1\.\s*Introduction|Background|Keywords|Key words|1\b)))/i);
  if (abstractMatch && abstractMatch[1]) {
    abstract = abstractMatch[1].trim();
  } else {
    // Fallback: search for first 300 words
    abstract = lines.slice(1, 5).join(' ');
  }

  // 4. Extract sections
  const sections: ParsedManuscript['sections'] = {};

  const introMatch = rawText.match(/(?:Introduction|Background)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:Methods|Materials and Methods|Methodology|2\b)))/i);
  if (introMatch) sections.introduction = introMatch[1].trim().slice(0, 5000);

  const methodsMatch = rawText.match(/(?:Methods|Materials and Methods|Methodology)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:Results|Findings|3\b)))/i);
  if (methodsMatch) sections.methods = methodsMatch[1].trim().slice(0, 6000);

  const resultsMatch = rawText.match(/(?:Results|Findings)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:Discussion|4\b)))/i);
  if (resultsMatch) sections.results = resultsMatch[1].trim().slice(0, 6000);

  const discussionMatch = rawText.match(/(?:Discussion)\s*[:\n\r]+([\s\S]*?)(?=(?:\n\s*(?:Conclusion|Conclusions|References|5\b)))/i);
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
