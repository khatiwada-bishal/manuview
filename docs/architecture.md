# ManuView System Architecture

This document describes the architectural design, data flow, and module boundaries of the **ManuView** platform.

---

## 1. High-Level System Overview

ManuView is structured into four decoupled layers:

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
│        (Next.js App Router, Tailwind CSS, shadcn/ui)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Application API Layer                    │
│    (Next.js Server Actions / REST API / Streaming SSE)      │
└──────────────┬───────────────┬───────────────┬──────────────┘
               │               │               │
┌──────────────▼────┐   ┌──────▼──────┐   ┌────▼──────────────┐
│ Ingestion Engine  │   │ Verification│   │ Diagnostic Engine │
│  - PDF/DOCX Parser│   │  - Crossref │   │  - 6-Dim Rubric   │
│  - Section Split  │   │  - OpenAlex │   │  - 4-Persona Sim  │
│  - Ref Extraction │   │  - Retractions│ │  - Priority Matrix│
└───────────────────┘   └─────────────┘   └───────────┬───────┘
                                                      │
                                          ┌───────────▼───────┐
                                          │ LLM Gateway       │
                                          │  - Local (Ollama) │
                                          │  - Cloud API Keys │
                                          └───────────────────┘
```

---

## 2. Core Pipelines

### Pipeline A: Document Ingestion & Parsing
1. **Input**: PDF or DOCX manuscript uploaded by author.
2. **Text & Structure Extraction**:
   - Title, Authors, Affiliations.
   - Abstract extraction.
   - Main sections: Introduction, Methods, Results, Discussion, Conclusion.
   - Figure legends and Table captions.
   - Bibliography / Reference list.
3. **Chunking & Token Budgeting**: Prepares structured semantic segments for targeted multi-pass analysis.

### Pipeline B: Bibliographic & Citation Verification
1. **Reference Parsing**: Extracts DOIs, titles, authors, years, and journals from bibliography.
2. **DOI & Metadata Resolution**:
   - Queries Crossref polite pool (`mailto:`) for title/DOI resolution.
   - Cross-checks with OpenAlex API for open metadata.
3. **Integrity Screening**:
   - Flag 1: Unresolvable / Hallucinated references.
   - Flag 2: Retracted papers or expressions of concern.
   - Flag 3: Excessive self-citation (>25%).
   - Flag 4: Citation recency breakdown (<5 yrs, 5-10 yrs, >10 yrs).
4. **Citation Claim Verification**:
   - Extracts sentences containing citations.
   - Fetches cited paper abstract.
   - Natural Language Inference evaluates if cited paper validates the claim.

### Pipeline C: The Multi-Stage Review & Persona Engine
1. **Pass 1: Abstract & Structural Scrutiny**:
   - Verifies canonical structure (`Problem`, `Knowledge Gap`, `Methodology`, `Key Findings`, `Broader Significance`).
2. **Pass 2: Claim vs. Evidence Audit**:
   - Scans for unsupported causal assertions, correlation mistaken for causation, and missing control conditions.
3. **Pass 3: Methodology & Statistical Evaluation**:
   - Checks sample size rationale, statistical tests, power calculation, blinding, and data transparency.
4. **Pass 4: 4-Persona Reviewer Simulation**:
   - Methods Reviewer
   - Domain Specialist
   - Journal Editor
   - Biostatistician / Statistician
5. **Pass 5: Prioritized Action Plan**:
   - Classifies issues into Priority A (desk reject), Priority B (reviewer objection), Priority C (minor polish).

---

## 3. Privacy-First Principle

- Manuscripts are never saved to long-term databases without explicit opt-in.
- For maximum security, researchers can run ManuView locally with **Ollama** (`ollama run llama3.3` or `mistral`), keeping 100% of data on their local machine.
