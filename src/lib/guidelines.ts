import { ParsedManuscript, ReportingGuidelineCheck, ReportingGuidelineItem } from "./types";

interface GuidelineDetectorResult {
  matched: boolean;
  excerpt?: string;
  partial?: boolean;
  evidenceSection?: string;
  evidenceOffset?: number;
}

interface GuidelineDefinitionItem {
  itemNumber: number;
  name: string;
  section: string;
  description: string;
  detector: (bodyText: string, manuscript: ParsedManuscript) => GuidelineDetectorResult;
  recommendationIfAbsent: string;
}

/**
 * Extracts the exact sentence spanning the matched keyword or regex (REQ-GL-03)
 */
export function extractSentenceExcerpt(text: string, matchIndex: number, matchLength: number): string {
  if (!text || matchIndex < 0 || matchIndex >= text.length) return "";
  const matchedText = text.slice(matchIndex, matchIndex + matchLength).trim();
  if (!matchedText) return "";

  // Locate the sentence that spans matchIndex by searching backwards to previous sentence terminator
  let start = 0;
  for (let i = matchIndex - 1; i >= 0; i--) {
    if (/[.?!]/.test(text[i]) && (i + 1 === text.length || /\s/.test(text[i + 1]))) {
      start = i + 1;
      break;
    }
  }

  // Search forwards to next sentence terminator
  let end = text.length;
  for (let i = matchIndex + matchLength; i < text.length; i++) {
    if (/[.?!]/.test(text[i]) && (i + 1 === text.length || /\s/.test(text[i + 1]))) {
      end = i + 1;
      break;
    }
  }

  let sentence = text.slice(start, end).replace(/\s+/g, " ").trim();
  if (sentence.length > 220) {
    const localStart = Math.max(0, matchIndex - start - 80);
    const localEnd = Math.min(sentence.length, matchIndex - start + matchLength + 80);
    sentence = sentence.slice(localStart, localEnd).trim();
  }

  // REQ-GL-03: Assert the returned excerpt contains the matched substring; if not, return empty string
  if (!sentence.toLowerCase().includes(matchedText.toLowerCase())) {
    return "";
  }

  return sentence;
}

/**
 * Strips bibliography / references section from raw text (REQ-GL-04)
 */
export function stripReferences(rawText: string): string {
  if (!rawText) return "";
  const refIndex = rawText.search(/\n\s*(?:references|bibliography|works cited)\b/i);
  if (refIndex !== -1 && refIndex > rawText.length * 0.3) {
    return rawText.slice(0, refIndex);
  }
  return rawText;
}

function regexMatcher(pattern: RegExp, preferredSection?: string) {
  return (bodyText: string, manuscript: ParsedManuscript): GuidelineDetectorResult => {
    let targetText: string | undefined = undefined;

    if (preferredSection === "abstract" && manuscript.abstract) {
      targetText = manuscript.abstract;
    } else if (
      preferredSection &&
      manuscript.sections &&
      manuscript.sections[preferredSection as keyof typeof manuscript.sections]
    ) {
      targetText = manuscript.sections[preferredSection as keyof typeof manuscript.sections]!;
    }

    if (targetText) {
      const match = targetText.match(pattern);
      if (match && typeof match.index === "number") {
        const excerpt = extractSentenceExcerpt(targetText, match.index, match[0].length);
        return {
          matched: true,
          partial: false,
          excerpt,
          evidenceSection: preferredSection,
          evidenceOffset: match.index,
        };
      }
    }

    // REQ-GL-04: If preferredSection was specified and not found/matched in that section:
    // Search bodyText (with references stripped). If matched outside preferred section, mark partial!
    if (preferredSection) {
      const bodyMatch = bodyText.match(pattern);
      if (bodyMatch && typeof bodyMatch.index === "number") {
        const excerpt = extractSentenceExcerpt(bodyText, bodyMatch.index, bodyMatch[0].length);
        return {
          matched: true,
          partial: true,
          excerpt,
          evidenceSection: "document-wide",
          evidenceOffset: bodyMatch.index,
        };
      }
      return { matched: false };
    }

    // No preferred section: search bodyText
    const match = bodyText.match(pattern);
    if (match && typeof match.index === "number") {
      const excerpt = extractSentenceExcerpt(bodyText, match.index, match[0].length);
      return {
        matched: true,
        partial: false,
        excerpt,
        evidenceSection: "body",
        evidenceOffset: match.index,
      };
    }
    return { matched: false };
  };
}

// ----------------------------------------------------------------------
// 1. STROBE (22 Items - Observational Studies)
// ----------------------------------------------------------------------
const STROBE_ITEMS: GuidelineDefinitionItem[] = [
  {
    itemNumber: 1,
    name: "Title and Abstract",
    section: "Title/Abstract",
    description: "Indicate study design with a commonly used term in title or abstract",
    detector: regexMatcher(/\b(cohort|case-control|cross-sectional|longitudinal|observational|prospective|retrospective)\b/i, "abstract"),
    recommendationIfAbsent: "Explicitly state the observational study design (cohort, case-control, cross-sectional) in the abstract.",
  },
  {
    itemNumber: 2,
    name: "Background / Rationale",
    section: "Introduction",
    description: "Explain the scientific background and rationale for the investigation",
    detector: regexMatcher(/\b(background|rationale|prior research|unclear whether|remains poorly understood|knowledge gap)\b/i, "introduction"),
    recommendationIfAbsent: "Clarify the specific scientific background and unresolved question being addressed.",
  },
  {
    itemNumber: 3,
    name: "Objectives & Hypotheses",
    section: "Introduction",
    description: "State specific objectives, including any prespecified hypotheses",
    detector: regexMatcher(/\b(we hypothesized|aim of (?:this|the) study|primary objective|we aimed to|investigate whether)\b/i, "introduction"),
    recommendationIfAbsent: "Conclude the Introduction with an explicit, formal statement of primary objectives and study hypotheses.",
  },
  {
    itemNumber: 4,
    name: "Study Design",
    section: "Methods",
    description: "Present key elements of study design early in the paper",
    detector: regexMatcher(/\b(study design|study population|study protocol|cohort design|cross-sectional design)\b/i, "methods"),
    recommendationIfAbsent: "Dedicate an early subsection in Methods defining the overarching design, timeframes, and design framework.",
  },
  {
    itemNumber: 5,
    name: "Setting & Timeline",
    section: "Methods",
    description: "Describe the setting, locations, and relevant dates, including periods of recruitment, exposure, and follow-up",
    detector: regexMatcher(/\b(conducted at|enrolled between|recruited between|between (?:19|20)\d\d and (?:19|20)\d\d|follow-up period|institutional setting)\b/i, "methods"),
    recommendationIfAbsent: "Document exact recruitment calendars, physical hospital/regional settings, and duration of follow-up observation.",
  },
  {
    itemNumber: 6,
    name: "Participants / Eligibility",
    section: "Methods",
    description: "Give eligibility criteria, sources, and methods of selection of participants",
    detector: regexMatcher(/\b(inclusion criteria|exclusion criteria|eligible (?:patients|participants|subjects)|inclusion and exclusion)\b/i, "methods"),
    recommendationIfAbsent: "Itemize formal inclusion and exclusion criteria to allow reproducibility and assess selection validity.",
  },
  {
    itemNumber: 7,
    name: "Variables & Operationalization",
    section: "Methods",
    description: "Clearly define all outcomes, exposures, predictors, potential confounders, and effect modifiers",
    detector: regexMatcher(/\b(primary outcome|secondary outcome|dependent variable|independent variable|exposure variable|covariates|confounding)\b/i, "methods"),
    recommendationIfAbsent: "Explicitly classify variables into exposures, primary/secondary outcomes, and pre-specified confounding covariates.",
  },
  {
    itemNumber: 8,
    name: "Data Sources & Measurement",
    section: "Methods",
    description: "Give sources of data and details of methods of assessment (measurement)",
    detector: regexMatcher(/\b(data source|extracted from|registry|electronic health records|questionnaire|assay|spectrometry|measurement protocol)\b/i, "methods"),
    recommendationIfAbsent: "Describe the measurement instruments, sensor models, lab assays, or clinical registry extraction protocols.",
  },
  {
    itemNumber: 9,
    name: "Bias Mitigation",
    section: "Methods",
    description: "Describe any efforts to address potential sources of bias",
    detector: regexMatcher(/\b(selection bias|recall bias|observer bias|confounding|propensity score|matching|attrition bias|mitigate bias)\b/i, "methods"),
    recommendationIfAbsent: "Detail specific methodological or analytical steps implemented to mitigate confounding and selection bias.",
  },
  {
    itemNumber: 10,
    name: "Study Size & Power",
    section: "Methods",
    description: "Explain how the study size was arrived at",
    detector: regexMatcher(/\b(sample size calculation|power calculation|statistical power|g\*power|alpha = 0\.05|80% power|sample size was determined)\b/i, "methods"),
    recommendationIfAbsent: "Include an explicit a priori or post-hoc power calculation justifying sample cohort size.",
  },
  {
    itemNumber: 11,
    name: "Quantitative Variables",
    section: "Methods",
    description: "Explain how quantitative variables were handled in the analyses",
    detector: regexMatcher(/\b(continuous variables|categorized as|dichotomized|quartiles|normal distribution|median and interquartile|mean ± sd)\b/i, "methods"),
    recommendationIfAbsent: "State how continuous variables were grouped, dichotomized, or verified for normality.",
  },
  {
    itemNumber: 12,
    name: "Statistical Methods",
    section: "Methods",
    description: "Describe all statistical methods, including those used to control for confounding and handle missing data",
    detector: regexMatcher(/\b(regression|anova|logistic regression|cox proportional|multivariate|missing data|multiple imputation|p < 0\.05)\b/i, "methods"),
    recommendationIfAbsent: "Itemize all statistical tests, software versions, missing data protocols, and significance thresholds.",
  },
  {
    itemNumber: 13,
    name: "Participant Counts & Attrition",
    section: "Results",
    description: "Report numbers of individuals at each stage of study",
    detector: regexMatcher(/\b(total of \d+|enrolled (\d+)|lost to follow-up|excluded \(n = \d+\)|completed the study)\b/i, "results"),
    recommendationIfAbsent: "Document the exact participant flow (screened, eligible, included, excluded, lost to follow-up).",
  },
  {
    itemNumber: 14,
    name: "Descriptive Baseline Data",
    section: "Results",
    description: "Give characteristics of study participants and information on exposures and potential confounders",
    detector: regexMatcher(/\b(table 1|baseline characteristics|demographic characteristics|mean age|male|female|median)\b/i, "results"),
    recommendationIfAbsent: "Provide a comprehensive baseline characteristics table (Table 1) detailing cohort demographics.",
  },
  {
    itemNumber: 15,
    name: "Outcome Data",
    section: "Results",
    description: "Report numbers of outcome events or summary measures over time",
    detector: regexMatcher(/\b(incidence rate|events occurred|prevalence of|event rate|survival rate|mortality)\b/i, "results"),
    recommendationIfAbsent: "Present explicit counts or frequencies for primary and secondary outcome events.",
  },
  {
    itemNumber: 16,
    name: "Main Effect Estimates",
    section: "Results",
    description: "Give unadjusted and adjusted estimates with 95% confidence intervals",
    detector: regexMatcher(/\b(odds ratio|relative risk|hazard ratio|95% ci|95% confidence interval|adjusted for)\b/i, "results"),
    recommendationIfAbsent: "Report precision metrics (95% confidence intervals) alongside all effect sizes, reporting both crude and adjusted values.",
  },
  {
    itemNumber: 17,
    name: "Sensitivity & Secondary Analyses",
    section: "Results",
    description: "Report other analyses done (e.g. analyses of subgroups and interactions, and sensitivity analyses)",
    detector: regexMatcher(/\b(sensitivity analysis|subgroup analysis|interaction term|robustness check|stratified by)\b/i, "results"),
    recommendationIfAbsent: "Conduct and report sensitivity analyses or subgroup stratifications to test conclusion robustness.",
  },
  {
    itemNumber: 18,
    name: "Summary of Key Results",
    section: "Discussion",
    description: "Summarise key results with reference to study objectives",
    detector: regexMatcher(/\b(in this study|we found that|our findings indicate|demonstrated that|principal finding)\b/i, "discussion"),
    recommendationIfAbsent: "Open the Discussion with a clear summary linking primary empirical findings back to the initial hypothesis.",
  },
  {
    itemNumber: 19,
    name: "Limitations",
    section: "Discussion",
    description: "Discuss limitations of the study, taking into account sources of potential bias or imprecision",
    detector: regexMatcher(/\b(limitations|several limitations|potential limitations|residual confounding|unmeasured confounder|retrospective nature)\b/i, "discussion"),
    recommendationIfAbsent: "Include a dedicated limitations section analyzing sources of imprecision, unmeasured variables, and design boundaries.",
  },
  {
    itemNumber: 20,
    name: "Interpretation",
    section: "Discussion",
    description: "Give a cautious overall interpretation of results considering objectives, limitations, and other relevant evidence",
    detector: regexMatcher(/\b(consistent with prior|in contrast to|biological plausibility|mechanistic explanation|plausible mechanism)\b/i, "discussion"),
    recommendationIfAbsent: "Situate findings within existing literature, contextualizing contrasting findings and theoretical mechanisms.",
  },
  {
    itemNumber: 21,
    name: "Generalisability",
    section: "Discussion",
    description: "Discuss the generalisability (external validity) of the study results",
    detector: regexMatcher(/\b(generalizability|external validity|extrapolated to|wider population|applicability to other settings)\b/i, "discussion"),
    recommendationIfAbsent: "Discuss external validity and boundary conditions for applying findings to different demographics or settings.",
  },
  {
    itemNumber: 22,
    name: "Funding & Disclosures",
    section: "Back Matter",
    description: "Give the source of funding and the role of the funders",
    detector: regexMatcher(/\b(funding|grant number|funded by|financial support|conflict of interest|competing interests|no competing interest)\b/i),
    recommendationIfAbsent: "Disclose all funding grants, sponsor roles, and author conflict-of-interest declarations.",
  },
];

// ----------------------------------------------------------------------
// 2. CONSORT (Core Selection of 15 Key Items for Trials)
// ----------------------------------------------------------------------
const CONSORT_ITEMS: GuidelineDefinitionItem[] = [
  {
    itemNumber: 1,
    name: "Trial Identification",
    section: "Title/Abstract",
    description: "Identification as a randomised trial in the title or abstract",
    detector: regexMatcher(/\b(randomised|randomized|clinical trial|controlled trial|rct)\b/i, "abstract"),
    recommendationIfAbsent: "State that the investigation is a randomized controlled trial in the title and abstract.",
  },
  {
    itemNumber: 2,
    name: "Trial Design",
    section: "Methods",
    description: "Description of trial design (such as parallel, factorial, crossover) including allocation ratio",
    detector: regexMatcher(/\b(parallel-group|crossover|factorial|allocation ratio|1:1 ratio|2:1)\b/i, "methods"),
    recommendationIfAbsent: "Specify the trial design framework and allocation ratio (e.g. 1:1 parallel group).",
  },
  {
    itemNumber: 3,
    name: "Eligibility Criteria",
    section: "Methods",
    description: "Eligibility criteria for participants and settings and locations where data were collected",
    detector: regexMatcher(/\b(inclusion criteria|exclusion criteria|eligible patients|recruited at)\b/i, "methods"),
    recommendationIfAbsent: "Itemize all clinical inclusion/exclusion criteria.",
  },
  {
    itemNumber: 4,
    name: "Interventions",
    section: "Methods",
    description: "The interventions for each group with sufficient details to allow replication, including placebo/control",
    detector: regexMatcher(/\b(administered|dosage|dose of|placebo|control group|intervention group|regimen)\b/i, "methods"),
    recommendationIfAbsent: "Detail intervention dosage, route, administration timing, and comparator specifications.",
  },
  {
    itemNumber: 5,
    name: "Primary & Secondary Outcomes",
    section: "Methods",
    description: "Completely defined pre-specified primary and secondary outcome measures",
    detector: regexMatcher(/\b(primary outcome|primary endpoint|secondary outcomes|secondary endpoints)\b/i, "methods"),
    recommendationIfAbsent: "Distinguish primary and secondary clinical endpoints with measurement time points.",
  },
  {
    itemNumber: 6,
    name: "Sample Size Determination",
    section: "Methods",
    description: "How sample size was determined, power, effect size assumed",
    detector: regexMatcher(/\b(sample size was calculated|power of 80%|power of 90%|two-sided alpha|detect a difference of)\b/i, "methods"),
    recommendationIfAbsent: "Report the statistical power, expected effect size, and sample size formula used.",
  },
  {
    itemNumber: 7,
    name: "Random Sequence Generation",
    section: "Methods",
    description: "Method used to generate the random allocation sequence",
    detector: regexMatcher(/\b(computer-generated random|random number table|permuted block|block randomization|stratified randomization)\b/i, "methods"),
    recommendationIfAbsent: "Describe the exact algorithm or protocol used to generate the randomization sequence.",
  },
  {
    itemNumber: 8,
    name: "Allocation Concealment",
    section: "Methods",
    description: "Mechanism used to implement the random allocation sequence",
    detector: regexMatcher(/\b(allocation concealment|sequentially numbered|opaque sealed envelopes|central web-based|interactive voice response)\b/i, "methods"),
    recommendationIfAbsent: "Explain the allocation concealment mechanism preventing prior knowledge of assignment.",
  },
  {
    itemNumber: 9,
    name: "Blinding / Masking",
    section: "Methods",
    description: "Who was blinded after assignment to interventions (participants, providers, outcome assessors)",
    detector: regexMatcher(/\b(double-blind|triple-blind|single-blind|blinded to treatment|masked|identical placebo)\b/i, "methods"),
    recommendationIfAbsent: "State clearly who was blinded to allocation (participants, care providers, outcome evaluators).",
  },
  {
    itemNumber: 10,
    name: "Statistical Analysis Methods",
    section: "Methods",
    description: "Statistical methods used to compare groups for primary and secondary outcomes",
    detector: regexMatcher(/\b(intention-to-treat|per-protocol|chi-square|student's t-test|hazard ratio|log-rank)\b/i, "methods"),
    recommendationIfAbsent: "Specify intention-to-treat vs per-protocol analysis strategy.",
  },
  {
    itemNumber: 11,
    name: "Participant Flow & Attrition",
    section: "Results",
    description: "For each group, the numbers of participants randomly assigned, receiving intervention, and analysed",
    detector: regexMatcher(/\b(consort flow|randomly assigned to|assigned to receive|discontinued intervention|analyzed for primary outcome)\b/i, "results"),
    recommendationIfAbsent: "Provide a CONSORT flow diagram or textual account of flow through each trial arm.",
  },
  {
    itemNumber: 12,
    name: "Baseline Demographic Data",
    section: "Results",
    description: "A table showing baseline demographic and clinical characteristics for each group",
    detector: regexMatcher(/\b(table 1|baseline characteristics|demographic data|age, sex)\b/i, "results"),
    recommendationIfAbsent: "Include a Table 1 comparing baseline characteristics across trial groups.",
  },
  {
    itemNumber: 13,
    name: "Outcomes & Estimation",
    section: "Results",
    description: "For each primary and secondary outcome, results for each group, and the estimated effect size and precision",
    detector: regexMatcher(/\b(relative risk|odds ratio|mean difference|confidence interval|p-value|hazard ratio)\b/i, "results"),
    recommendationIfAbsent: "Report effect sizes with 95% confidence intervals for every stated endpoint.",
  },
  {
    itemNumber: 14,
    name: "Adverse Events & Harms",
    section: "Results",
    description: "All important harms or unintended effects in each group",
    detector: regexMatcher(/\b(adverse event|serious adverse event|safety profile|side effects|toxicity|tolerability)\b/i, "results"),
    recommendationIfAbsent: "Document all observed adverse events, toxicities, and harms by group.",
  },
  {
    itemNumber: 15,
    name: "Trial Registration & Ethics",
    section: "Back Matter",
    description: "Registration number and name of trial registry, ethics committee approval",
    detector: regexMatcher(/\b(clinicaltrials\.gov|nct\d{8}|isrctn|institutional review board|irb approval|ethics committee)\b/i),
    recommendationIfAbsent: "Disclose the public clinical trial registration ID and IRB ethics committee approval number.",
  },
];

// ----------------------------------------------------------------------
// 3. ARRIVE (Preclinical Animal Models & Laboratory Assays)
// ----------------------------------------------------------------------
const ARRIVE_ITEMS: GuidelineDefinitionItem[] = [
  {
    itemNumber: 1,
    name: "Ethical Approval & Animal Welfare",
    section: "Methods",
    description: "Ethical review committee approval, animal welfare regulations and 3Rs compliance",
    detector: regexMatcher(/\b(iacuc|institutional animal care|animal welfare|ethics committee approval|guidelines for the care and use)\b/i, "methods"),
    recommendationIfAbsent: "Provide IACUC ethics protocol approval code and adherence to laboratory animal care guidelines.",
  },
  {
    itemNumber: 2,
    name: "Experimental Animals Specification",
    section: "Methods",
    description: "Species, strain, substrain, sex, age/developmental stage, and weight of animals",
    detector: regexMatcher(/\b(c57bl\/6|balb\/c|mice|rats|male|female|weeks of age|weighing \d+|strain)\b/i, "methods"),
    recommendationIfAbsent: "Itemize exact species, strain, supplier, sex, age, and initial weight ranges.",
  },
  {
    itemNumber: 3,
    name: "Housing & Husbandry",
    section: "Methods",
    description: "Housing conditions, light/dark cycle, temperature, humidity, cage type, bedding, food/water",
    detector: regexMatcher(/\b(12-h light|dark cycle|pathogen-free|ad libitum|housing conditions|temperature \(2\d°c\))\b/i, "methods"),
    recommendationIfAbsent: "Describe vivarium environmental conditions (photoperiod, cage enrichment, feeding regimen).",
  },
  {
    itemNumber: 4,
    name: "Experimental Procedures",
    section: "Methods",
    description: "Details of all procedures: dosing, anesthesia, surgical protocol, euthanasia",
    detector: regexMatcher(/\b(anesthetized|ketamine|xylazine|isoflurane|euthanasia|cervical dislocation|injected|surgical)\b/i, "methods"),
    recommendationIfAbsent: "Detail surgical anesthetics, drug vehicle, delivery routes, and humane endpoint protocols.",
  },
  {
    itemNumber: 5,
    name: "Sample Size Calculation & Blinding",
    section: "Methods",
    description: "Justification of animal numbers per group, randomization, and blinding of observers",
    detector: regexMatcher(/\b(sample size calculation|animals per group|randomly assigned|investigator was blinded|blinded to treatment)\b/i, "methods"),
    recommendationIfAbsent: "State animal sample size rationale (resource equation or power test) and operator blinding.",
  },
];

// ----------------------------------------------------------------------
// 4. PRISMA (Core Selection of 12 Key Items for Systematic Reviews - PRISMA 2020)
// ----------------------------------------------------------------------
const PRISMA_ITEMS: GuidelineDefinitionItem[] = [
  {
    itemNumber: 1,
    name: "Title Identification",
    section: "Title/Abstract",
    description: "Identify the report as a systematic review or meta-analysis in title or abstract",
    detector: regexMatcher(/\b(systematic review|meta-analysis|systematic literature review)\b/i, "abstract"),
    recommendationIfAbsent: "Identify the report explicitly as a systematic review or meta-analysis in title or abstract.",
  },
  {
    itemNumber: 2,
    name: "Structured Abstract",
    section: "Abstract",
    description: "Provide a structured abstract covering background, methods, results, and discussion",
    detector: regexMatcher(/\b(background|objective|methods|results|conclusions?)\b/i, "abstract"),
    recommendationIfAbsent: "Structure the abstract explicitly into Background, Methods, Results, and Conclusions.",
  },
  {
    itemNumber: 3,
    name: "Rationale",
    section: "Introduction",
    description: "Describe the rationale for the review in the context of what is already known",
    detector: regexMatcher(/\b(rationale|prior systematic review|need for this review|unresolved questions|knowledge gap)\b/i, "introduction"),
    recommendationIfAbsent: "Describe the scientific rationale for this review in the context of current literature.",
  },
  {
    itemNumber: 4,
    name: "Objectives & Framework",
    section: "Introduction",
    description: "Provide an explicit statement of the question(s) being addressed using PICO or similar framework",
    detector: regexMatcher(/\b(objective|research question|pico|aim of this review|we systematically evaluated)\b/i, "introduction"),
    recommendationIfAbsent: "State explicit review questions using the PICO framework (population, intervention, comparator, outcome).",
  },
  {
    itemNumber: 5,
    name: "Eligibility Criteria",
    section: "Methods",
    description: "Specify the inclusion and exclusion criteria for the review and how studies were grouped",
    detector: regexMatcher(/\b(inclusion criteria|exclusion criteria|eligibility criteria|studies were eligible)\b/i, "methods"),
    recommendationIfAbsent: "Itemize explicit study eligibility criteria (inclusion and exclusion rules).",
  },
  {
    itemNumber: 6,
    name: "Information Sources & Search Dates",
    section: "Methods",
    description: "Specify all databases, registers, websites, and date ranges searched",
    detector: regexMatcher(/\b(pubmed|medline|embase|web of science|scopus|cochrane|searched from|search date)\b/i, "methods"),
    recommendationIfAbsent: "Detail all bibliographic databases searched along with search date coverage limits.",
  },
  {
    itemNumber: 7,
    name: "Full Search Strategy",
    section: "Methods",
    description: "Present the full search strategy for at least one database, including filters applied",
    detector: regexMatcher(/\b(search terms|search strategy|boolean operators|mesh terms|keywords used)\b/i, "methods"),
    recommendationIfAbsent: "Provide the complete search string with Boolean operators for at least one major database.",
  },
  {
    itemNumber: 8,
    name: "Selection & Screening Process",
    section: "Methods",
    description: "Specify the methods used to decide whether a study met inclusion criteria (e.g., dual screening)",
    detector: regexMatcher(/\b(screened independently|two reviewers|dual screening|disagreements were resolved|title and abstract screening)\b/i, "methods"),
    recommendationIfAbsent: "State whether screening was conducted independently by two or more reviewers.",
  },
  {
    itemNumber: 9,
    name: "Data Collection Process",
    section: "Methods",
    description: "Describe data extraction methods, pilot forms, and verification processes",
    detector: regexMatcher(/\b(data extraction|extracted independently|standardized form|data abstraction)\b/i, "methods"),
    recommendationIfAbsent: "Detail the data extraction process and whether independent extraction was employed.",
  },
  {
    itemNumber: 11,
    name: "Risk of Bias in Included Studies",
    section: "Methods",
    description: "Specify methods used to assess risk of bias in the included studies (RoB 2, ROBINS-I, Newcastle-Ottawa)",
    detector: regexMatcher(/\b(risk of bias|cochrane risk of bias|robins-i|quality assessment|jadad scale|newcastle-ottawa)\b/i, "methods"),
    recommendationIfAbsent: "Specify the validated assessment tool used to evaluate risk of bias in included studies.",
  },
  {
    itemNumber: 13,
    name: "Synthesis Methods & Statistical Models",
    section: "Methods",
    description: "Describe processes used to decide which studies were eligible for synthesis, models, and heterogeneity metrics",
    detector: regexMatcher(/\b(random-effects model|fixed-effect|meta-analysis|forest plot|heterogeneity|i2 statistic|pooled risk ratio|pooled odds ratio)\b/i, "methods"),
    recommendationIfAbsent: "Describe quantitative synthesis models, statistical software, and heterogeneity metrics (e.g. I^2).",
  },
  {
    itemNumber: 23,
    name: "Discussion & Review Limitations",
    section: "Discussion",
    description: "Discuss limitations of the included evidence and review processes",
    detector: regexMatcher(/\b(limitations of this review|publication bias|heterogeneity among studies|risk of bias across studies)\b/i, "discussion"),
    recommendationIfAbsent: "Discuss methodological limitations of the review process and evidence quality.",
  },
];

// ----------------------------------------------------------------------
// 5. ML / Reproducibility Checklist (CS & Operations Research)
// ----------------------------------------------------------------------
const ML_REPRODUCIBILITY_ITEMS: GuidelineDefinitionItem[] = [
  {
    itemNumber: 1,
    name: "Algorithmic Formulation",
    section: "Methods",
    description: "Mathematical formulation, objective function, and formal pseudocode or algorithmic steps",
    detector: regexMatcher(/\b(algorithm \d+|pseudocode|objective function|loss function|formulation|minimizing|maximizing)\b/i, "methods"),
    recommendationIfAbsent: "Provide formal mathematical formulations or pseudocode detailing algorithmic step execution.",
  },
  {
    itemNumber: 2,
    name: "Code & Data Replication Archive",
    section: "Methods",
    description: "Link to code repository, dependencies, and replication dataset",
    detector: regexMatcher(/\b(github\.com|gitlab|zenodo|osf\.io|code is available at|repository|open-source)\b/i),
    recommendationIfAbsent: "Provide a public DOI or repository link (GitHub, Zenodo) containing runnable code and environment configs.",
  },
  {
    itemNumber: 3,
    name: "Hyperparameter Configuration",
    section: "Methods",
    description: "Search spaces, chosen hyperparameters, and tuning protocol",
    detector: regexMatcher(/\b(hyperparameter|learning rate|batch size|grid search|cross-validation|optimizer|adam|epochs)\b/i, "methods"),
    recommendationIfAbsent: "Document hyperparameter search ranges, final configurations, and tuning selection criteria.",
  },
  {
    itemNumber: 4,
    name: "Computational Environment & Complexity",
    section: "Methods",
    description: "Hardware specs (GPUs/CPUs), operating system, software packages, and runtimes",
    detector: regexMatcher(/\b(nvidia|gpu|cpu|ram|runtime|computational complexity|pytorch|tensorflow|gurobi|cplex)\b/i, "methods"),
    recommendationIfAbsent: "Specify hardware accelerator architecture, runtime wall-clock metrics, and solver package versions.",
  },
  {
    itemNumber: 5,
    name: "Statistical Variance & Seeds",
    section: "Results",
    description: "Multiple trials, random seeds, standard deviations, and statistical significance tests",
    detector: regexMatcher(/\b(random seed|mean ± std|error bars|trials|runs|standard deviation|wilcoxon|paired t-test)\b/i, "results"),
    recommendationIfAbsent: "Report results averaged across multiple random seeds with error margins or confidence intervals.",
  },
];

/**
 * Executes deep reporting guideline audit against manuscript text
 */
export function auditReportingGuidelines(
  manuscript: ParsedManuscript,
  discipline: string
): ReportingGuidelineCheck {
  const fullText = manuscript.rawText || "";
  const abstract = manuscript.abstract || "";
  const methods = manuscript.sections.methods || "";

  // 1. Select appropriate guideline based on document cues and discipline
  let guidelineItems: GuidelineDefinitionItem[] = STROBE_ITEMS;
  let guidelineName = "STROBE (22-Item Observational Epidemiological Checklist)";
  let standardType = "Observational & Cohort Quantitative Research";
  let itemSetScope: "full" | "core_subset" = "full";
  let itemSetSize = 22;
  let standardVersion = "STROBE Statement v4";
  let standardUrl = "https://www.strobe-statement.org/";

  const bodyText = stripReferences(fullText);

  // REQ-GL-04: Scope guideline routing strictly to abstract + methods, never fullText!
  const routingContext = `${abstract} ${methods}`;

  const isSystematicReview = /\b(systematic review|meta-analysis|prisma|search strategy|scoping review)\b/i.test(routingContext);
  const isClinicalTrial = /\b(randomized controlled trial|clinical trial|rct|double-blind trial)\b/i.test(routingContext);
  const isAnimalStudy = /\b(mice|rats|murine|c57bl\/6|in vivo animal|iacuc)\b/i.test(methods);
  const isComputerScienceOrOR =
    discipline === "Computer Science" ||
    discipline === "Operations Research & Management" ||
    /\b(neural network|reinforcement learning|benchmark dataset|loss function|mixed-integer)\b/i.test(routingContext);

  if (isSystematicReview) {
    guidelineItems = PRISMA_ITEMS;
    guidelineName = "PRISMA 2020 — 12 of 27 core items screened";
    standardType = "Systematic Reviews & Meta-Analyses";
    itemSetScope = "core_subset";
    itemSetSize = 27;
    standardVersion = "PRISMA 2020";
    standardUrl = "http://www.prisma-statement.org/";
  } else if (isClinicalTrial) {
    guidelineItems = CONSORT_ITEMS;
    guidelineName = "CONSORT 2010 — 15 of 25 core items screened";
    standardType = "Randomized Controlled Trials & Interventions";
    itemSetScope = "core_subset";
    itemSetSize = 25;
    standardVersion = "CONSORT 2010";
    standardUrl = "https://www.consort-statement.org/";
  } else if (isAnimalStudy) {
    guidelineItems = ARRIVE_ITEMS;
    guidelineName = "ARRIVE 2.0 — 5 of 21 core items screened";
    standardType = "Preclinical Experimental Physiology & In Vivo Assays";
    itemSetScope = "core_subset";
    itemSetSize = 21;
    standardVersion = "ARRIVE 2.0";
    standardUrl = "https://arriveguidelines.org/";
  } else if (isComputerScienceOrOR) {
    guidelineItems = ML_REPRODUCIBILITY_ITEMS;
    guidelineName = "NeurIPS / ACM Reproducibility — 6 of 10 core items screened";
    standardType = "Computational, Algorithmic & Optimization Benchmarks";
    itemSetScope = "core_subset";
    itemSetSize = 10;
    standardVersion = "NeurIPS 2020 ML Reproducibility";
    standardUrl = "https://neurips.cc/public/guides/PaperChecklist";
  } else {
    guidelineItems = STROBE_ITEMS;
    guidelineName = "STROBE (22-Item Observational Epidemiological Checklist)";
    standardType = "Observational Cohort, Case-Control & Cross-Sectional Studies";
    itemSetScope = "full";
    itemSetSize = 22;
    standardVersion = "STROBE Statement v4";
    standardUrl = "https://www.strobe-statement.org/";
  }

  // 2. Audit each item
  const structuredItems: ReportingGuidelineItem[] = [];
  const compliantItems: string[] = [];
  const missingOrPartialItems: string[] = [];

  let evidencedCount = 0;
  let partialCount = 0;
  let absentCount = 0;

  for (const item of guidelineItems) {
    const check = item.detector(bodyText, manuscript);

    if (check.matched && !check.partial) {
      evidencedCount++;
      structuredItems.push({
        itemNumber: item.itemNumber,
        name: item.name,
        section: item.section,
        description: item.description,
        status: "evidenced",
        evidenceExcerpt: check.excerpt,
        evidenceSection: check.evidenceSection,
        evidenceOffset: check.evidenceOffset,
      });

      const label = `Item ${item.itemNumber} (${item.name}): Evidenced${
        check.excerpt ? ` — "${check.excerpt}"` : ""
      }`;
      compliantItems.push(label);
    } else if (check.matched && check.partial) {
      partialCount++;
      structuredItems.push({
        itemNumber: item.itemNumber,
        name: item.name,
        section: item.section,
        description: item.description,
        status: "partial",
        evidenceExcerpt: check.excerpt,
        evidenceSection: check.evidenceSection || "document-wide",
        evidenceOffset: check.evidenceOffset,
        recommendation: `Mentioned in ${check.evidenceSection || "text"}, but recommended in formal ${item.section} section.`,
      });

      const label = `Item ${item.itemNumber} (${item.name}): Partial — found in ${check.evidenceSection || "text"}${
        check.excerpt ? `: "${check.excerpt}"` : ""
      }`;
      missingOrPartialItems.push(label);
    } else {
      absentCount++;
      structuredItems.push({
        itemNumber: item.itemNumber,
        name: item.name,
        section: item.section,
        description: item.description,
        status: "absent",
        recommendation: item.recommendationIfAbsent,
      });

      const label = `Item ${item.itemNumber} (${item.name}): Absent — ${item.recommendationIfAbsent}`;
      missingOrPartialItems.push(label);
    }
  }

  const totalItems = guidelineItems.length;
  const scorePercent =
    totalItems > 0
      ? Math.round(((evidencedCount + 0.5 * partialCount) / totalItems) * 100)
      : 0;

  return {
    guidelineName,
    standardType,
    scorePercent,
    totalItems,
    evidencedCount,
    partialCount,
    absentCount,
    itemSetScope,
    itemSetSize,
    standardVersion,
    standardUrl,
    items: structuredItems,
    compliantItems,
    missingOrPartialItems,
  };
}
