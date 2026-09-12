export type ScoreDimension = 
  | 'originality'
  | 'broad_interest'
  | 'claims_vs_evidence'
  | 'methodology'
  | 'clarity'
  | 'prior_work';

export interface DimensionScore {
  score: number; // 1 to 5
  label: string;
  verdict: string;
  strengths: string[];
  vulnerabilities: string[];
  source?: 'llm' | 'heuristic';
}

export type PriorityLevel = 'A' | 'B' | 'C';

export interface PriorityIssue {
  id: string;
  priority: PriorityLevel;
  title: string;
  category: 'Methodology' | 'Causal Claims' | 'Statistics' | 'Citations' | 'Scope/Fit' | 'Clarity';
  description: string;
  location?: string;
  evidenceAnchor?: string; // Typed anchor: text: §X "...", equation: Eq. Y, absence: ...
  reviewerQuote: string; // How a reviewer or editor would formulate this critique
  actionableFix: string; // Specific concrete step to resolve before submission
  rebuttalStrategy?: string; // Point-by-point author rebuttal framing for journal response letter
  source?: 'llm' | 'heuristic' | 'crossref';
}

export interface ReviewerPersonaFeedback {
  persona: 'methods_reviewer' | 'domain_expert' | 'journal_editor' | 'statistician' | 'devils_advocate';
  name: string;
  title: string;
  affiliation: string;
  expertise: string;
  roleDescription: string;
  decisionRecommendation: 'Major Revision' | 'Reject / Resubmit' | 'Desk Reject' | 'Minor Revision';
  keyChallenge: string;
  assessment: string;
  majorCritiques: string[];
  missingControlsOrAnalyses: string[];
  mustAddressItems: string[];
  evidenceAnchors?: string[];
  counterArguments?: string[];
  source?: 'llm' | 'heuristic';
}

export type ReferenceStatus = 'valid' | 'retracted' | 'expression_of_concern' | 'unresolvable' | 'unchecked';

export interface ReferenceVerification {
  raw: string;
  doi?: string;
  title?: string;
  authors?: string[];
  familyNames?: string[];
  matchConfidence?: number;
  year?: number;
  journal?: string;
  status: ReferenceStatus;
  isRetracted: boolean;
  retractionDetails?: string;
  crossrefUrl?: string;
  resolutionMethod?: 'doi' | 'bibliographic_search' | 'unresolved';
}

export interface CitationIntegritySummary {
  totalReferences: number;
  sampledCount: number;
  checkedCount: number;
  coverageNote: string;
  verifiedCount: number;
  unresolvableCount: number; // Potential AI hallucination (confirmed 404)
  uncheckedCount: number; // References without DOI or lookup offline/rate-limited
  retractedCount: number;
  expressionOfConcernCount?: number;
  retractionCheckAvailable: boolean; // false if Crossref/network failed or offline
  selfCitationRatio?: number; // Omitted if authors cannot be matched or checkedCount < 10
  recencyProfile?: {
    last5YearsPercent: number;
    olderThan5YearsPercent: number;
  };
  references: ReferenceVerification[];
}

export interface JournalRecommendation {
  tier: 'Reach' | 'Realistic' | 'Fallback';
  journalName: string;
  impactFactor: number | string;
  publisher: string;
  fitScore: number; // percentage 0-100
  scopeRationale: string;
  rejectionRisks: string[];
  requiredRevisionsForFit: string[];
}

export type DocumentCategory = 
  | 'academic_manuscript'        // Research paper, empirical study, review, clinical study, preprint
  | 'source_code'                // Programming scripts (Python, JS, C++, etc.), configs
  | 'resume_cv'                  // Resume, Curriculum Vitae, bio
  | 'grant_proposal'             // Grant application, project proposal, funding narrative
  | 'technical_doc'              // Technical spec, API docs, release notes, manual
  | 'business_or_admin'          // Invoice, financial report, business memo, agreement
  | 'general_or_creative'        // Essay, fiction, journalism, blog post
  | 'random_unstructured';       // Shopping list, notes, fragments, disorganized text

export interface DocumentClassification {
  category: DocumentCategory;
  categoryLabel: string;
  isAcademicManuscript: boolean;
  confidence: number; // 0 to 1
  detectedFeatures: string[];
  salutation: string; // e.g. "Dear Author / Researcher", "Hello Developer / Software Engineer"
  advisoryMessage: string; // Direct address explaining the file classification and context
  customGuidance: string; // Actionable advice tailored to this specific file type
}

export interface ManuscriptSection {
  title: string;
  content: string;
}

export interface SectionProvenance {
  methodsInferred?: boolean;
  resultsInferred?: boolean;
  methodsMissing?: boolean;
  resultsMissing?: boolean;
  introductionInferred?: boolean;
  discussionInferred?: boolean;
}

export interface ParsedManuscript {
  title: string;
  abstract: string;
  authors: string[];
  wordCount: number;
  sections: {
    introduction?: string;
    methods?: string;
    results?: string;
    discussion?: string;
    conclusion?: string;
  };
  sectionProvenance?: SectionProvenance;
  rawText: string;
  references: string[];
  classification?: DocumentClassification;
  empiricalCues?: {
    sampleSizes?: string[];
    statisticalMetrics?: string[];
    equations?: string[];
    dataRepositories?: string[];
    causalAssertions?: string[];
    detectedGuidelines?: string[];
    declaredLimitations?: string[];
  };
}

export interface ReportingGuidelineItem {
  itemNumber: number;
  name: string;
  section: string;
  description?: string;
  status: 'evidenced' | 'partial' | 'absent';
  evidenceExcerpt?: string;
  evidenceSection?: string;
  evidenceOffset?: number;
  recommendation?: string;
}

export interface ReportingGuidelineCheck {
  guidelineName: string; // e.g. STROBE, CONSORT, PRISMA, ARRIVE, Econometric Rigor
  standardType: string; // e.g. "Observational / Customs Microdata", "Randomized Controlled Trial", "Nonlinear Model"
  scorePercent: number; // 0 - 100
  totalItems?: number;
  evidencedCount?: number;
  partialCount?: number;
  absentCount?: number;
  itemSetScope?: 'full' | 'core_subset';
  itemSetSize?: number;
  standardVersion?: string;
  standardUrl?: string;
  items?: ReportingGuidelineItem[];
  compliantItems: string[];
  missingOrPartialItems: string[];
  additionalReviewerObservations?: string[];
}

export interface PublishedArticleDetails {
  isPublished: boolean;
  doi?: string;
  journalName?: string;
  publisher?: string;
  publicationDate?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  articleUrl?: string;
  citationCount?: number;
  detectedVia: string;
}

export interface FullReviewReport {
  mode: 'full';
  id: string;
  createdAt: string;
  title: string;
  targetJournal?: string;
  overallScore?: number; // 0 to 100 (omitted if non-academic or already published)
  isEligibleForReview?: boolean; // false if already published OR non-academic manuscript
  ineligibilityReason?: 'already_published' | 'non_academic_document';
  publishedDetails?: PublishedArticleDetails;
  summary: string;
  classification: DocumentClassification;
  dimensions?: Record<ScoreDimension, DimensionScore>;
  priorityIssues: PriorityIssue[];
  reviewerPersonas: ReviewerPersonaFeedback[];
  journalRecommendations: JournalRecommendation[];
  citationIntegrity: CitationIntegritySummary;
  reportingGuideline?: ReportingGuidelineCheck;
  executionMode?: 'llm_synthesized' | 'partial_llm' | 'heuristic_offline';
  llmCallError?: string;
}

export interface BriefJournalFitReport {
  mode: 'brief_fit';
  id: string;
  createdAt: string;
  title: string;
  abstract: string;
  keywords: string[];
  targetJournal: string;
  fitScore?: number; // 0 to 100 (omitted when not assessed)
  verdict:
    | 'Strong Editorial Fit'
    | 'Moderate Scope Match'
    | 'Scope Mismatch / High Desk-Reject Hazard'
    | 'Not Assessed — journal profile unavailable';
  verdictColor: 'green' | 'amber' | 'red' | 'grey';
  scopeAssessment: {
    method: 'curated_catalog' | 'openalex_profile' | 'llm_only' | 'unavailable';
    reason?: string;
  };
  summary: string;
  dimensions: {
    domainMatch: { score?: number; feedback: string };
    noveltySignificance: { score?: number; feedback: string };
    readershipAlignment: { score?: number; feedback: string };
    keywordRelevance: { score?: number; feedback: string };
  };
  keyHighlights: string[];
  deskRejectHazards: string[];
  framingSuggestions: string[];
  alternativeJournals: {
    name: string;
    publisher?: string;
    impactFactor?: number;
    tier: 'Reach' | 'Realistic' | 'Safe Fallback';
    matchReason: string;
  }[];
  openAlexMetrics?: {
    twoYearMeanCitedness?: number;
    hIndex?: number;
    matchedConcepts?: string[];
    sourceId?: string;
  };
}

export type ReviewReport = FullReviewReport | BriefJournalFitReport;

export type LLMProvider = 'ollama' | 'gemini' | 'groq' | 'openai' | 'anthropic';

export interface ProviderConfig {
  provider: LLMProvider;
  model: string;
  baseUrl?: string; // e.g. http://localhost:11434 for Ollama
  apiKey?: string;
}

export interface AvailableModel {
  id: string;
  name: string;
  description: string;
  tag?: string;
  recommended?: boolean;
  isLive?: boolean;
}

