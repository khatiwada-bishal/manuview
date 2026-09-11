import type { FullReviewReport, BriefJournalFitReport, ReviewReport } from "./types";

function escapeHtml(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeFilename(title: string): string {
  return (title || "Manuscript")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 45);
}

function triggerDownload(content: string, filename: string, mimeType: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates and triggers download of a 100% self-contained, standalone
 * interactive HTML report that opens in any browser offline.
 */
export function exportInteractiveHtmlReport(report: ReviewReport) {
  const isFullReport = !("fitScore" in report);
  const filename = `ManuView_Interactive_Report_${sanitizeFilename(report.title)}.html`;
  const htmlContent = isFullReport
    ? generateFullReportHtml(report as FullReviewReport)
    : generateBriefReportHtml(report as BriefJournalFitReport);

  triggerDownload(htmlContent, filename, "text/html;charset=utf-8");
}

/**
 * Generates and triggers download of a native-compatible Microsoft Word document (.doc/.docx).
 */
export function exportWordDocReport(report: ReviewReport) {
  const isFullReport = !("fitScore" in report);
  const filename = `ManuView_Diagnostic_Report_${sanitizeFilename(report.title)}.doc`;
  const wordContent = isFullReport
    ? generateFullReportWord(report as FullReviewReport)
    : generateBriefReportWord(report as BriefJournalFitReport);

  triggerDownload(wordContent, filename, "application/msword;charset=utf-8");
}

// -----------------------------------------------------------------------------
// 1. FULL REPORT - STANDALONE INTERACTIVE HTML GENERATOR
// -----------------------------------------------------------------------------
function generateFullReportHtml(r: FullReviewReport): string {
  const title = escapeHtml(r.title);
  const targetJournal = escapeHtml(r.targetJournal || "General High Impact Journal");
  const overallScore =
    r.isEligibleForReview === false
      ? r.ineligibilityReason === "already_published"
        ? "PUB"
        : "N/A"
      : r.overallScore || 70;
  const dateStr = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const personasJson = JSON.stringify(r.reviewerPersonas || []);
  const issuesJson = JSON.stringify(r.priorityIssues || []);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ManuView Report: ${title}</title>
  <style>
    :root {
      --bg: #0F172A;
      --card-bg: #FFFFFF;
      --card-border: #E2E8F0;
      --text-main: #1E293B;
      --text-muted: #64748B;
      --accent: #2563EB;
      --priority-a: #DC2626;
      --priority-b: #D97706;
      --priority-c: #16A34A;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #F8FAFC;
      color: var(--text-main);
      line-height: 1.5;
      padding: 24px;
    }
    .container { max-width: 1100px; margin: 0 auto; }
    .header-card {
      background: #FFFFFF;
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .brand {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--card-border);
    }
    .brand-title { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
    .brand-title span { color: var(--accent); }
    .meta-badge {
      display: inline-block;
      font-size: 12px;
      font-weight: 600;
      background: #EFF6FF;
      color: #1D4ED8;
      padding: 4px 12px;
      border-radius: 9999px;
      border: 1px solid #BFDBFE;
    }
    h1 {
      font-family: Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 16px;
      color: #0F172A;
    }
    .score-banner {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
      justify-content: space-between;
      background: #F1F5F9;
      border-radius: 12px;
      padding: 16px 20px;
      margin-top: 20px;
    }
    .score-meter { display: flex; align-items: baseline; gap: 8px; }
    .score-number { font-size: 36px; font-weight: 800; color: #0F172A; }
    .score-label { font-size: 13px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .btn-print {
      background: #0F172A;
      color: #FFF;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-print:hover { background: #334155; }
    
    /* Navigation Tabs */
    .tabs-nav {
      display: flex;
      gap: 8px;
      border-bottom: 2px solid #E2E8F0;
      margin-bottom: 24px;
      overflow-x: auto;
    }
    .tab-btn {
      background: none;
      border: none;
      padding: 12px 18px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .tab-btn:hover { color: var(--text-main); }
    .tab-btn.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }
    .tab-content { display: none; }
    .tab-content.active { display: block; }

    /* Cards */
    .card {
      background: #FFFFFF;
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 12px;
      color: #0F172A;
    }
    .dimension-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
    }
    .dimension-card {
      background: #FFFFFF;
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 18px;
    }
    .dim-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .dim-score { font-weight: 800; font-size: 16px; color: var(--accent); }
    .dim-verdict { font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 10px; }
    .dim-list { font-size: 12px; list-style: square; padding-left: 18px; color: #334155; margin-bottom: 8px; }
    .dim-list li { margin-bottom: 4px; }
    .vuln-item { color: #B91C1C; }

    /* Reviewer Personas */
    .persona-selector {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }
    .persona-pill {
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
    }
    .persona-pill.active {
      background: #0F172A;
      color: #FFF;
      border-color: #0F172A;
    }
    .persona-panel { display: none; }
    .persona-panel.active { display: block; }
    .persona-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 6px;
      background: #FEF3C7;
      color: #92400E;
      margin-bottom: 8px;
    }
    .critique-box {
      background: #F8FAFC;
      border-left: 4px solid var(--accent);
      padding: 14px 16px;
      border-radius: 0 8px 8px 0;
      margin-top: 14px;
      font-size: 13px;
    }

    /* Priority Issues */
    .filter-pills { display: flex; gap: 8px; margin-bottom: 16px; }
    .filter-btn {
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .filter-btn.active { background: #0F172A; color: #FFF; border-color: #0F172A; }
    .issue-item {
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .issue-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .badge-a { background: #FEE2E2; color: #991B1B; font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 6px; }
    .badge-b { background: #FEF3C7; color: #92400E; font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 6px; }
    .badge-c { background: #DCFCE7; color: #166534; font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 6px; }
    .quote-box { font-style: italic; background: #F8FAFC; padding: 10px; border-radius: 6px; margin: 8px 0; font-size: 12px; color: #475569; }
    .fix-box { background: #ECFDF5; border-left: 3px solid #10B981; padding: 8px 12px; font-size: 12px; color: #065F46; }

    /* Target Journals */
    .journal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    .journal-card { border: 1px solid var(--card-border); border-radius: 12px; padding: 18px; background: #FFF; }
    .journal-tier { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--accent); }
    .journal-name { font-size: 16px; font-weight: 700; margin: 4px 0; }
    .journal-meta { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }

    @media print {
      body { background: #FFF; padding: 0; }
      .btn-print, .tabs-nav, .filter-pills, .persona-selector { display: none !important; }
      .tab-content, .persona-panel { display: block !important; }
      .card { border: 1px solid #CCC !important; page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-card">
      <div class="brand">
        <div class="brand-title">Manu<span>View</span> Diagnostic Suite</div>
        <div class="meta-badge">Target: ${targetJournal}</div>
      </div>
      <h1>${title}</h1>
      <p style="color: var(--text-muted); font-size: 13px;">Generated on ${dateStr} • Peer-Review Calibrated Pre-Submission Diagnostic</p>

      <div class="score-banner">
        <div class="score-meter">
          <span class="score-number">${overallScore}</span>
          <span class="score-label">/ 100 Overall Acceptance Potential</span>
        </div>
        <button class="btn-print" onclick="window.print()">
          <span>🖨️ Print / Save as PDF</span>
        </button>
      </div>
    </div>

    <!-- Interactive Navigation Tabs -->
    <div class="tabs-nav">
      <button class="tab-btn active" onclick="switchTab('overview')">Executive Overview</button>
      <button class="tab-btn" onclick="switchTab('reviewers')">${(r.reviewerPersonas || []).length || 5} Reviewer Personas</button>
      <button class="tab-btn" onclick="switchTab('dimensions')">6 Scoring Dimensions</button>
      <button class="tab-btn" onclick="switchTab('issues')">Priority Action Items (${(r.priorityIssues || []).length})</button>
      <button class="tab-btn" onclick="switchTab('journals')">Target Journals</button>
    </div>

    <!-- Tab 1: Overview -->
    <div id="tab-overview" class="tab-content active">
      <div class="card">
        <div class="card-title">Editorial Synthesis & Triage Assessment</div>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">${escapeHtml(r.summary)}</p>
      </div>

      ${r.classification ? `
      <div class="card" style="border-left: 4px solid var(--accent);">
        <div class="card-title">Document Classification: ${escapeHtml(r.classification.categoryLabel)}</div>
        <p style="font-size: 13px; color: #475569; margin-bottom: 8px;"><strong>${escapeHtml(r.classification.salutation)}:</strong> ${escapeHtml(r.classification.advisoryMessage)}</p>
        <p style="font-size: 12px; color: #64748B;">${escapeHtml(r.classification.customGuidance)}</p>
      </div>
      ` : ""}

      ${r.reportingGuideline ? `
      <div class="card" style="border-left: 4px solid ${r.reportingGuideline.scorePercent >= 80 ? "#10B981" : r.reportingGuideline.scorePercent >= 60 ? "#F59E0B" : "#EF4444"};">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
          <div class="card-title" style="margin-bottom: 0;">Reporting Guideline Compliance: ${escapeHtml(r.reportingGuideline.guidelineName)}</div>
          <span style="font-size: 13px; font-weight: 700; color: ${r.reportingGuideline.scorePercent >= 80 ? "#10B981" : r.reportingGuideline.scorePercent >= 60 ? "#F59E0B" : "#EF4444"};">
            ${r.reportingGuideline.scorePercent}% Compliant
          </span>
        </div>
        <p style="font-size: 12px; color: #64748B; margin-bottom: 12px;">Standardized reporting checklist audit based on international peer-review expectations.</p>

        ${(r.reportingGuideline.compliantItems && r.reportingGuideline.compliantItems.length > 0) ? `
          <div style="font-size: 11px; font-weight: 700; color: #166534; margin-bottom: 4px;">COMPLIANT ELEMENTS:</div>
          <ul style="font-size: 12px; padding-left: 18px; color: #166534; margin-bottom: 10px;">
            ${r.reportingGuideline.compliantItems.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        ` : ""}

        ${(r.reportingGuideline.missingOrPartialItems && r.reportingGuideline.missingOrPartialItems.length > 0) ? `
          <div style="font-size: 11px; font-weight: 700; color: #991B1B; margin-bottom: 4px;">MISSING OR PARTIALLY ADDRESSED CHECKLIST ITEMS:</div>
          <ul style="font-size: 12px; padding-left: 18px; color: #991B1B;">
            ${r.reportingGuideline.missingOrPartialItems.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        ` : ""}
      </div>
      ` : ""}
    </div>

    <!-- Tab 2: Reviewer Personas -->
    <div id="tab-reviewers" class="tab-content">
      <div class="card">
        <div class="persona-selector" id="persona-buttons">
          ${(r.reviewerPersonas || []).map((p, idx) => `
            <button class="persona-pill ${idx === 0 ? "active" : ""}" onclick="switchPersona(${idx})">
              ${p.persona === "devils_advocate" ? "⚡ " : ""}${escapeHtml(p.name)} (${escapeHtml(p.roleDescription)})
            </button>
          `).join("")}
        </div>

        ${(r.reviewerPersonas || []).map((p, idx) => `
          <div id="persona-panel-${idx}" class="persona-panel ${idx === 0 ? "active" : ""}" ${p.persona === "devils_advocate" ? 'style="border-left: 3px solid #F43F5E; padding-left: 12px;"' : ""}>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div class="persona-badge" ${p.persona === "devils_advocate" ? 'style="background: #FFE4E6; color: #9F1239;"' : ""}>${escapeHtml(p.decisionRecommendation)}</div>
              ${p.persona === "devils_advocate" ? `<span style="font-size: 11px; font-weight: 700; color: #E11D48; background: #FFF1F2; border: 1px solid #FECDD3; border-radius: 4px; padding: 2px 6px;">⚡ Hostile Stress-Test / Adversarial Referee</span>` : ""}
            </div>
            <h3 style="font-size: 18px; margin-bottom: 4px;">${escapeHtml(p.name)}</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">${escapeHtml(p.title)} • ${escapeHtml(p.affiliation)}</p>
            
            <div style="background: #FEF2F2; border-left: 3px solid #EF4444; padding: 10px 14px; border-radius: 6px; font-size: 13px; color: #991B1B; margin-bottom: 14px;">
              <strong>Key Challenge:</strong> ${escapeHtml(p.keyChallenge)}
            </div>

            <p style="font-size: 13px; line-height: 1.6; color: #334155; margin-bottom: 16px;">${escapeHtml(p.assessment)}</p>

            ${(p.evidenceAnchors && p.evidenceAnchors.length > 0) ? `
              <div style="margin-bottom: 14px; background: #F8FAFC; border: 1px dashed #CBD5E1; padding: 10px 14px; border-radius: 8px;">
                <strong style="font-size: 11px; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px;">Manuscript Evidence Anchors (Grounding):</strong>
                <ul style="font-size: 12px; font-family: monospace; padding-left: 18px; color: #334155; margin-top: 6px;">
                  ${p.evidenceAnchors.map(a => `<li style="margin-bottom: 3px;">${escapeHtml(a)}</li>`).join("")}
                </ul>
              </div>
            ` : ""}

            <div style="margin-bottom: 12px;">
              <strong style="font-size: 13px; color: #0F172A;">Major Critiques:</strong>
              <ul style="font-size: 13px; padding-left: 20px; color: #334155; margin-top: 6px;">
                ${(p.majorCritiques || []).map(c => `<li style="margin-bottom: 4px;">${escapeHtml(c)}</li>`).join("")}
              </ul>
            </div>

            <div style="margin-bottom: 12px;">
              <strong style="font-size: 13px; color: #0F172A;">Must-Address Prior to Submission:</strong>
              <ul style="font-size: 13px; padding-left: 20px; color: #166534; margin-top: 6px;">
                ${(p.mustAddressItems || []).map(m => `<li style="margin-bottom: 4px;">${escapeHtml(m)}</li>`).join("")}
              </ul>
            </div>

            ${(p.counterArguments && p.counterArguments.length > 0) ? `
              <div style="margin-top: 14px; background: #FFF1F2; border: 1px solid #FECDD3; padding: 10px 14px; border-radius: 8px;">
                <strong style="font-size: 11px; color: #9F1239; text-transform: uppercase; letter-spacing: 0.5px;">Adversarial Defenses & Pre-emptive Arguments:</strong>
                <ul style="font-size: 12px; padding-left: 18px; color: #9F1239; margin-top: 6px;">
                  ${p.counterArguments.map(arg => `<li style="margin-bottom: 3px;">${escapeHtml(arg)}</li>`).join("")}
                </ul>
              </div>
            ` : ""}
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Tab 3: Dimensions -->
    <div id="tab-dimensions" class="tab-content">
      <div class="dimension-grid">
        ${Object.entries(r.dimensions || {}).map(([_, dim]) => `
          <div class="dimension-card">
            <div class="dim-header">
              <strong style="font-size: 14px;">${escapeHtml(dim.label)}</strong>
              <span class="dim-score">${dim.score} / 5</span>
            </div>
            <div class="dim-verdict">${escapeHtml(dim.verdict)}</div>
            ${(dim.strengths && dim.strengths.length > 0) ? `
              <div style="font-size: 11px; font-weight: 700; color: #166534; margin-top: 8px;">STRENGTHS:</div>
              <ul class="dim-list">
                ${dim.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join("")}
              </ul>
            ` : ""}
            ${(dim.vulnerabilities && dim.vulnerabilities.length > 0) ? `
              <div style="font-size: 11px; font-weight: 700; color: #991B1B; margin-top: 8px;">VULNERABILITIES:</div>
              <ul class="dim-list vuln-item">
                ${dim.vulnerabilities.map(v => `<li>${escapeHtml(v)}</li>`).join("")}
              </ul>
            ` : ""}
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Tab 4: Priority Issues -->
    <div id="tab-issues" class="tab-content">
      <div class="filter-pills">
        <button class="filter-btn active" onclick="filterIssues('all')">All Issues</button>
        <button class="filter-btn" onclick="filterIssues('A')">🚨 Priority A (Desk-Reject Risk)</button>
        <button class="filter-btn" onclick="filterIssues('B')">⚠️ Priority B (Major Technical)</button>
        <button class="filter-btn" onclick="filterIssues('C')">💡 Priority C (Presentation)</button>
      </div>

      <div id="issues-container">
        ${(r.priorityIssues || []).map(iss => `
          <div class="issue-item" data-priority="${iss.priority}">
            <div class="issue-header">
              <span class="badge-${iss.priority.toLowerCase()}">Priority ${iss.priority}: ${escapeHtml(iss.category)}</span>
              <span style="font-size: 11px; color: var(--text-muted); font-mono;">${iss.id}</span>
            </div>
            <h4 style="font-size: 15px; margin: 6px 0;">${escapeHtml(iss.title)}</h4>
            ${iss.evidenceAnchor ? `
              <div style="font-family: monospace; font-size: 11px; background: #F1F5F9; color: #475569; padding: 3px 8px; border-radius: 4px; display: inline-block; margin-bottom: 6px;">
                Anchor: ${escapeHtml(iss.evidenceAnchor)}
              </div>
            ` : ""}
            <p style="font-size: 13px; color: #334155;">${escapeHtml(iss.description)}</p>
            ${iss.reviewerQuote ? `<div class="quote-box">Reviewer Anticipated Reaction: ${escapeHtml(iss.reviewerQuote)}</div>` : ""}
            ${iss.actionableFix ? `<div class="fix-box"><strong>Actionable Fix:</strong> ${escapeHtml(iss.actionableFix)}</div>` : ""}
            ${iss.rebuttalStrategy ? `
              <div style="margin-top: 8px; background: #F5F3FF; border-left: 3px solid #8B5CF6; padding: 8px 12px; font-size: 12px; color: #5B21B6; border-radius: 0 6px 6px 0;">
                <strong>Author Rebuttal Strategy:</strong> ${escapeHtml(iss.rebuttalStrategy)}
              </div>
            ` : ""}
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Tab 5: Journals -->
    <div id="tab-journals" class="tab-content">
      <div class="journal-grid">
        ${(r.journalRecommendations || []).map(j => `
          <div class="journal-card">
            <div class="journal-tier">${escapeHtml(j.tier)} Match (Fit: ${j.fitScore}%)</div>
            <div class="journal-name">${escapeHtml(j.journalName)}</div>
            <div class="journal-meta">Impact Factor: ${j.impactFactor} • ${escapeHtml(j.publisher)}</div>
            <p style="font-size: 13px; color: #334155; margin-bottom: 12px;">${escapeHtml(j.scopeRationale)}</p>
            ${(j.rejectionRisks && j.rejectionRisks.length > 0) ? `
              <div style="font-size: 11px; font-weight: 700; color: #991B1B; margin-top: 8px;">DESK-REJECT RISKS:</div>
              <ul style="font-size: 12px; padding-left: 18px; color: #991B1B; margin-top: 4px;">
                ${j.rejectionRisks.map(risk => `<li>${escapeHtml(risk)}</li>`).join("")}
              </ul>
            ` : ""}
          </div>
        `).join("")}
      </div>
    </div>
  </div>

  <script>
    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      event.target.classList.add('active');
      const el = document.getElementById('tab-' + tabId);
      if (el) el.classList.add('active');
    }

    function switchPersona(idx) {
      document.querySelectorAll('.persona-pill').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.persona-panel').forEach(p => p.classList.remove('active'));
      event.target.classList.add('active');
      const panel = document.getElementById('persona-panel-' + idx);
      if (panel) panel.classList.add('active');
    }

    function filterIssues(level) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
      document.querySelectorAll('.issue-item').forEach(item => {
        if (level === 'all' || item.getAttribute('data-priority') === level) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>`;
}

// -----------------------------------------------------------------------------
// 2. BRIEF SCOPE FIT REPORT - STANDALONE INTERACTIVE HTML GENERATOR
// -----------------------------------------------------------------------------
function generateBriefReportHtml(r: BriefJournalFitReport): string {
  const title = escapeHtml(r.title);
  const targetJournal = escapeHtml(r.targetJournal);
  const fitScore = r.fitScore || 75;
  const dateStr = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ManuView Scope Fit Report: ${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #F8FAFC;
      color: #1E293B;
      line-height: 1.5;
      padding: 24px;
    }
    .container { max-width: 900px; margin: 0 auto; }
    .card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    h1 { font-family: Georgia, serif; font-size: 24px; margin: 12px 0; color: #0F172A; }
    .btn-print {
      background: #0F172A; color: #FFF; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong style="font-size: 16px;">ManuView Editorial Scope Report</strong>
        <button class="btn-print" onclick="window.print()">Print / PDF</button>
      </div>
      <h1>${title}</h1>
      <p style="font-size: 13px; color: #64748B;">Target Journal: <strong>${targetJournal}</strong> • Generated on ${dateStr}</p>
      <div style="background: #F1F5F9; border-radius: 10px; padding: 16px; margin-top: 16px;">
        <div style="font-size: 28px; font-weight: 800;">${fitScore}% Match — ${escapeHtml(r.verdict)}</div>
        <p style="font-size: 14px; color: #334155; margin-top: 8px;">${escapeHtml(r.summary)}</p>
      </div>
    </div>

    <div class="card">
      <h3 style="font-size: 16px; margin-bottom: 12px;">Scope Strengths Supporting Submission</h3>
      <ul style="font-size: 13px; padding-left: 20px; color: #166534;">
        ${(r.keyHighlights || []).map(h => `<li style="margin-bottom: 6px;">${escapeHtml(h)}</li>`).join("")}
      </ul>
    </div>

    <div class="card">
      <h3 style="font-size: 16px; margin-bottom: 12px; color: #991B1B;">Desk-Reject Hazards for ${targetJournal}</h3>
      <ul style="font-size: 13px; padding-left: 20px; color: #991B1B;">
        ${(r.deskRejectHazards || []).map(h => `<li style="margin-bottom: 6px;">${escapeHtml(h)}</li>`).join("")}
      </ul>
    </div>

    <div class="card">
      <h3 style="font-size: 16px; margin-bottom: 12px;">Alternative Target Journals</h3>
      ${(r.alternativeJournals || []).map(j => `
        <div style="border-bottom: 1px solid #E2E8F0; padding: 10px 0;">
          <strong>${escapeHtml(j.tier)}: ${escapeHtml(j.name)}</strong> (Impact Factor: ${j.impactFactor || "N/A"})
          <p style="font-size: 12px; color: #475569; margin-top: 4px;">${escapeHtml(j.matchReason)}</p>
        </div>
      `).join("")}
    </div>
  </div>
</body>
</html>`;
}

// -----------------------------------------------------------------------------
// 3. FULL REPORT - MICROSOFT WORD (.DOC/.DOCX) EXPORT GENERATOR
// -----------------------------------------------------------------------------
function generateFullReportWord(r: FullReviewReport): string {
  const title = escapeHtml(r.title);
  const targetJournal = escapeHtml(r.targetJournal || "General High Impact Journal");
  const overallScore = r.overallScore || 70;
  const dateStr = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>ManuView Diagnostic Report: ${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 8.5in 11.0in;
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: .5in;
      mso-footer-margin: .5in;
    }
    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #1E293B;
    }
    h1 { font-family: 'Georgia', serif; font-size: 20pt; color: #0F172A; margin-bottom: 4pt; }
    h2 { font-family: 'Calibri', sans-serif; font-size: 14pt; color: #0F172A; border-bottom: 2pt solid #2563EB; padding-bottom: 3pt; margin-top: 18pt; margin-bottom: 6pt; }
    h3 { font-family: 'Calibri', sans-serif; font-size: 12pt; color: #1E293B; margin-top: 12pt; margin-bottom: 4pt; }
    table { border-collapse: collapse; width: 100%; margin-top: 8pt; margin-bottom: 12pt; }
    th { background-color: #F1F5F9; border: 1pt solid #CBD5E1; padding: 6pt 8pt; text-align: left; font-size: 10pt; font-weight: bold; }
    td { border: 1pt solid #CBD5E1; padding: 6pt 8pt; font-size: 10pt; vertical-align: top; }
    .callout { background-color: #F8FAFC; border-left: 3pt solid #2563EB; padding: 8pt 12pt; margin: 8pt 0; }
    .badge-a { color: #DC2626; font-weight: bold; }
    .badge-b { color: #D97706; font-weight: bold; }
    .badge-c { color: #16A34A; font-weight: bold; }
    ul { margin-top: 4pt; margin-bottom: 8pt; padding-left: 18pt; }
    li { margin-bottom: 3pt; }
  </style>
</head>
<body>
  <p style="font-size: 9pt; color: #64748B; text-transform: uppercase; letter-spacing: 1pt;">ManuView • AI Pre-Submission Peer-Review Diagnostic Suite</p>
  <h1>${title}</h1>
  <p style="font-size: 10pt; color: #64748B;">Target Journal: <strong>${targetJournal}</strong> | Evaluation Date: ${dateStr}</p>
  
  <div class="callout" style="background-color: #EFF6FF; border-left: 4pt solid #2563EB;">
    <p style="font-size: 16pt; font-weight: bold; margin: 0; color: #1E40AF;">${r.isEligibleForReview === false ? (r.ineligibilityReason === "already_published" ? "Status: Already Published Article" : "Status: Ineligible (Non-Article)") : `Overall Potential Score: ${overallScore} / 100`}</p>
    <p style="font-size: 10pt; margin-top: 4pt; margin-bottom: 0;">${escapeHtml(r.summary)}</p>
  </div>

  <h2>1. 6-Dimension Scholarly Scoring Rubric</h2>
  <table>
    <tr>
      <th style="width: 25%;">Dimension</th>
      <th style="width: 12%;">Score (1-5)</th>
      <th style="width: 28%;">Verdict</th>
      <th style="width: 35%;">Key Observations</th>
    </tr>
    ${Object.entries(r.dimensions || {}).map(([_, dim]) => `
      <tr>
        <td><strong>${escapeHtml(dim.label)}</strong></td>
        <td><strong>${dim.score} / 5</strong></td>
        <td>${escapeHtml(dim.verdict)}</td>
        <td>
          ${(dim.vulnerabilities && dim.vulnerabilities.length > 0) ? `<span style="color: #DC2626;"><strong>Risks:</strong> ${escapeHtml(dim.vulnerabilities.join("; "))}</span>` : `<span style="color: #16A34A;">Sound methodology</span>`}
        </td>
      </tr>
    `).join("")}
  </table>

  <h2>2. Simulated ${(r.reviewerPersonas || []).length || 5}-Persona Peer Review (Adversarial Panel)</h2>
  ${(r.reviewerPersonas || []).map(p => `
    <h3>${p.persona === "devils_advocate" ? "⚡ [Adversarial Stress-Test] " : ""}${escapeHtml(p.name)} — ${escapeHtml(p.roleDescription)}</h3>
    <p style="font-size: 9.5pt; color: #64748B; margin-bottom: 4pt;">${escapeHtml(p.title)} • ${escapeHtml(p.affiliation)}</p>
    <p><strong>Recommendation:</strong> ${escapeHtml(p.decisionRecommendation)} | <strong>Key Challenge:</strong> ${escapeHtml(p.keyChallenge)}</p>
    <p>${escapeHtml(p.assessment)}</p>
    ${(p.evidenceAnchors && p.evidenceAnchors.length > 0) ? `
      <p><strong>Manuscript Evidence Anchors (Grounding):</strong></p>
      <ul style="font-family: 'Courier New', monospace; font-size: 9pt; color: #334155;">
        ${p.evidenceAnchors.map(a => `<li>${escapeHtml(a)}</li>`).join("")}
      </ul>
    ` : ""}
    <p><strong>Major Critiques:</strong></p>
    <ul>
      ${(p.majorCritiques || []).map(c => `<li>${escapeHtml(c)}</li>`).join("")}
    </ul>
    <p><strong>Must-Address Items:</strong></p>
    <ul>
      ${(p.mustAddressItems || []).map(m => `<li>${escapeHtml(m)}</li>`).join("")}
    </ul>
    ${(p.counterArguments && p.counterArguments.length > 0) ? `
      <p style="color: #9F1239;"><strong>Adversarial Defenses & Pre-emptive Arguments:</strong></p>
      <ul style="color: #9F1239; font-size: 9.5pt;">
        ${p.counterArguments.map(ca => `<li>${escapeHtml(ca)}</li>`).join("")}
      </ul>
    ` : ""}
  `).join("")}

  <h2>3. Actionable Priority Issues & Rebuttal Strategies</h2>
  <table>
    <tr>
      <th style="width: 12%;">Priority</th>
      <th style="width: 22%;">Category & Anchor</th>
      <th style="width: 33%;">Issue Description</th>
      <th style="width: 33%;">Actionable Fix & Author Rebuttal Strategy</th>
    </tr>
    ${(r.priorityIssues || []).map(iss => `
      <tr>
        <td class="badge-${iss.priority.toLowerCase()}">Priority ${iss.priority}</td>
        <td>
          <strong>${escapeHtml(iss.title)}</strong><br>
          <span style="font-size: 9pt; color: #64748B;">${escapeHtml(iss.category)}</span>
          ${iss.evidenceAnchor ? `<br><code style="font-size: 8pt; color: #475569;">${escapeHtml(iss.evidenceAnchor)}</code>` : ""}
        </td>
        <td>${escapeHtml(iss.description)}</td>
        <td>
          <div><strong>Fix:</strong> ${escapeHtml(iss.actionableFix)}</div>
          ${iss.rebuttalStrategy ? `<div style="margin-top: 4pt; color: #5B21B6; font-size: 9pt;"><strong>Rebuttal Framing:</strong> ${escapeHtml(iss.rebuttalStrategy)}</div>` : ""}
        </td>
      </tr>
    `).join("")}
  </table>

  <h2>4. Target Journal Recommendations</h2>
  <table>
    <tr>
      <th>Tier</th>
      <th>Journal Name</th>
      <th>Impact Factor</th>
      <th>Scope Alignment & Desk-Reject Hazards</th>
    </tr>
    ${(r.journalRecommendations || []).map(j => `
      <tr>
        <td><strong>${escapeHtml(j.tier)}</strong></td>
        <td><strong>${escapeHtml(j.journalName)}</strong><br><span style="font-size: 9pt; color: #64748B;">${escapeHtml(j.publisher)}</span></td>
        <td>${j.impactFactor}</td>
        <td>
          <p>${escapeHtml(j.scopeRationale)}</p>
          ${(j.rejectionRisks && j.rejectionRisks.length > 0) ? `<p style="color: #DC2626; font-size: 9pt; margin-top: 4pt;"><strong>Hazards:</strong> ${escapeHtml(j.rejectionRisks.join("; "))}</p>` : ""}
        </td>
      </tr>
    `).join("")}
  </table>

  ${r.reportingGuideline ? `
  <h2>5. Reporting Guideline Compliance Audit (${escapeHtml(r.reportingGuideline.guidelineName)})</h2>
  <div class="callout" style="background-color: #F8FAFC; border-left: 4pt solid ${r.reportingGuideline.scorePercent >= 80 ? "#10B981" : r.reportingGuideline.scorePercent >= 60 ? "#D97706" : "#DC2626"};">
    <p style="font-weight: bold; margin: 0; font-size: 11pt;">Compliance Score: ${r.reportingGuideline.scorePercent}%</p>
    ${(r.reportingGuideline.compliantItems && r.reportingGuideline.compliantItems.length > 0) ? `
      <p style="color: #166534; font-size: 9.5pt; margin-top: 6pt; margin-bottom: 2pt;"><strong>Compliant Items:</strong></p>
      <ul style="color: #166534; font-size: 9.5pt;">
        ${r.reportingGuideline.compliantItems.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    ` : ""}
    ${(r.reportingGuideline.missingOrPartialItems && r.reportingGuideline.missingOrPartialItems.length > 0) ? `
      <p style="color: #DC2626; font-size: 9.5pt; margin-top: 6pt; margin-bottom: 2pt;"><strong>Missing / Partially Addressed Items:</strong></p>
      <ul style="color: #DC2626; font-size: 9.5pt;">
        ${r.reportingGuideline.missingOrPartialItems.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    ` : ""}
  </div>
  ` : ""}
</body>
</html>`;
}

// -----------------------------------------------------------------------------
// 4. BRIEF REPORT - MICROSOFT WORD (.DOC) EXPORT GENERATOR
// -----------------------------------------------------------------------------
function generateBriefReportWord(r: BriefJournalFitReport): string {
  const title = escapeHtml(r.title);
  const targetJournal = escapeHtml(r.targetJournal);
  const fitScore = r.fitScore || 75;
  const dateStr = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>ManuView Scope Fit Report: ${title}</title>
  <style>
    @page { size: 8.5in 11.0in; margin: 1.0in; }
    body { font-family: 'Calibri', Arial, sans-serif; font-size: 11pt; color: #1E293B; line-height: 1.4; }
    h1 { font-family: 'Georgia', serif; font-size: 18pt; color: #0F172A; }
    h2 { font-size: 13pt; color: #0F172A; border-bottom: 1.5pt solid #2563EB; padding-bottom: 2pt; margin-top: 14pt; }
    ul { padding-left: 18pt; margin-top: 4pt; margin-bottom: 8pt; }
    li { margin-bottom: 3pt; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>Target Journal: <strong>${targetJournal}</strong> | Date: ${dateStr}</p>
  <div style="background-color: #EFF6FF; border-left: 4pt solid #2563EB; padding: 10pt; margin: 10pt 0;">
    <p style="font-size: 14pt; font-weight: bold; margin: 0;">Scope Match: ${fitScore}% — ${escapeHtml(r.verdict)}</p>
    <p style="margin-top: 4pt; margin-bottom: 0;">${escapeHtml(r.summary)}</p>
  </div>
  <h2>Scope Strengths Supporting Submission</h2>
  <ul>
    ${(r.keyHighlights || []).map(h => `<li>${escapeHtml(h)}</li>`).join("")}
  </ul>
  <h2>Desk-Reject Hazards for ${targetJournal}</h2>
  <ul>
    ${(r.deskRejectHazards || []).map(h => `<li style="color: #DC2626;">${escapeHtml(h)}</li>`).join("")}
  </ul>
  <h2>Title & Abstract Framing Suggestions</h2>
  <ul>
    ${(r.framingSuggestions || []).map(s => `<li>${escapeHtml(s)}</li>`).join("")}
  </ul>
</body>
</html>`;
}
