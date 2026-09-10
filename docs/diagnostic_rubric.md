# ManuView Diagnostic Rubric & Review Methodology

This document outlines the reviewer-calibrated evaluation rubric used by ManuView to assess pre-submission manuscripts.

---

## 1. The Six Scoring Dimensions (Scale: 1 to 5)

Scores are calibrated against high-impact journal peer-review expectations (e.g. *Nature*, *Cell*, *Science*, *The Lancet*, *IEEE TPAMI*).

### Dimension 1: Originality & Novelty
- **Score 5**: Substantial theoretical, conceptual, or mechanistic leap that opens new avenues of inquiry.
- **Score 3**: Meaningful incremental advancement; solid addition to existing literature without major paradigm shift.
- **Score 1**: Highly derivative; repeats established findings with trivial parameter variations; lacks clear novelty differentiation.

### Dimension 2: Importance & Broad Field Interest
- **Score 5**: Broadly generalizable insights relevant to scholars across multiple subfields or domains.
- **Score 3**: Clear importance to the immediate subfield, but with limited cross-disciplinary appeal.
- **Score 1**: Hyper-specialized or localized case study lacking broader implications or conceptual framing.

### Dimension 3: Strength of Claims vs. Evidence
- **Score 5**: Rigorously bounded conclusions where every causal statement is directly supported by mechanistic controls and experimental proof.
- **Score 3**: Findings largely support the core claims, but contains mild overstatements or extrapolations beyond tested conditions.
- **Score 1**: Severe overstatement: correlational associations claimed as causal; sensationalized conclusions without adequate controls or biological validation.

### Dimension 4: Methodological & Statistical Soundness
- **Score 5**: Fully reproducible; explicit sample size justification and power analysis; appropriate statistical tests with multiple testing corrections; clear blinding/randomization.
- **Score 3**: Methods are sound but missing minor reporting details (e.g. exact degrees of freedom, software versions, or pre-registration notes).
- **Score 1**: Fatal methodological vulnerabilities: underpowered sample size, inappropriate statistical tests, missing negative/positive controls, severe confounding factors.

### Dimension 5: Clarity, Structure & Presentation
- **Score 5**: Masterful narrative architecture; abstract follows strict Problem-Gap-Method-Result-Impact flow; figures are self-explanatory and publication-ready.
- **Score 3**: Legible and logical, but suffers from dense jargon, fragmented transitions, or suboptimally labeled figures.
- **Score 1**: Disorganized; incomplete abstract; disconnected sections; figures missing legends or error bar definitions.

### Dimension 6: Prior Work & Reference Integrity
- **Score 5**: Balanced, up-to-date bibliographic foundation citing primary discoveries; 0 unresolvable DOIs; <15% self-citation.
- **Score 3**: Adequate literature coverage with minor gaps in very recent (<2 years) literature.
- **Score 1**: Hallucinated references; citations of retracted works; excessive self-citation (>25%); failure to cite landmark competitor papers.

---

## 2. Priority Classification Matrix

Every identified weakness is categorized into one of three action levels:

- 🚨 **Priority A (Desk-Reject Vulnerabilities)**:
  - Fatal statistical flaws or underpowered sample sizes.
  - Direct causal overclaiming without experimental verification.
  - Hallucinated or retracted references.
  - Scope mismatch with the target journal.
- ⚠️ **Priority B (Reviewer Pushback Risks)**:
  - Missing control experiments or unaddressed alternative explanations.
  - Suboptimal figure/table communication.
  - Unclear parameter sensitivity or benchmark comparisons.
- 💡 **Priority C (Refinement & Polish)**:
  - Narrative flow, terminology standardization, and stylistic clarity.

---

## 3. The 4 Reviewer Personas

During the comprehensive review stage, the manuscript is evaluated across four distinct simulated perspectives:

1. **Methods Reviewer**: "Can another laboratory replicate this protocol without guessing? Are all reagents, scripts, and parameters documented?"
2. **Domain Specialist**: "Does this actually advance what we know in this specific domain, or does it overlook competitor publications from the past 18 months?"
3. **Journal Editor**: "Why should our broad readership care about this paper? Does the abstract immediately explain why this work matters today?"
4. **Statistician**: "Are the statistical tests appropriate for the data distribution? Were p-values adjusted for multiple comparisons? Are error bars standard deviation or standard error?"
