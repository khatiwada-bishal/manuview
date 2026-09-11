"use client";

import React, { useState } from "react";
import {
  Layers,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileSpreadsheet,
  RotateCcw,
} from "lucide-react";

export default function PrismaPage() {
  const [dbIdentified, setDbIdentified] = useState(1420);
  const [registersIdentified, setRegistersIdentified] = useState(65);
  const [duplicatesRemoved, setDuplicatesRemoved] = useState(310);
  const [screened, setScreened] = useState(1175);
  const [screenExcluded, setScreenExcluded] = useState(940);
  const [sought, setSought] = useState(235);
  const [notRetrieved, setNotRetrieved] = useState(18);
  const [assessed, setAssessed] = useState(217);
  const [excludedEligibility, setExcludedEligibility] = useState(175);
  const [included, setIncluded] = useState(42);

  // Arithmetic validation checks
  const totalIdentified = Number(dbIdentified) + Number(registersIdentified);
  const expectedScreened = totalIdentified - Number(duplicatesRemoved);
  const screeningDiff = Number(screened) - expectedScreened;

  const expectedSought = Number(screened) - Number(screenExcluded);
  const soughtDiff = Number(sought) - expectedSought;

  const expectedAssessed = Number(sought) - Number(notRetrieved);
  const assessedDiff = Number(assessed) - expectedAssessed;

  const expectedIncluded = Number(assessed) - Number(excludedEligibility);
  const includedDiff = Number(included) - expectedIncluded;

  const hasMathDiscrepancy =
    screeningDiff !== 0 || soughtDiff !== 0 || assessedDiff !== 0 || includedDiff !== 0;

  const handleAutoReconcile = () => {
    const expScr = totalIdentified - Number(duplicatesRemoved);
    setScreened(expScr);
    const expSou = expScr - Number(screenExcluded);
    setSought(expSou);
    const expAss = expSou - Number(notRetrieved);
    setAssessed(expAss);
    setIncluded(expAss - Number(excludedEligibility));
  };

  const handleResetDefaults = () => {
    setDbIdentified(1420);
    setRegistersIdentified(65);
    setDuplicatesRemoved(310);
    setScreened(1175);
    setScreenExcluded(940);
    setSought(235);
    setNotRetrieved(18);
    setAssessed(217);
    setExcludedEligibility(175);
    setIncluded(42);
  };

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById("prisma-svg");
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRISMA_2020_flow_diagram.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const rows = [
      ["PRISMA 2020 Phase", "Metric", "Count (n)"],
      ["Phase 1: Identification", "Databases Identified", dbIdentified],
      ["Phase 1: Identification", "Registers Identified", registersIdentified],
      ["Phase 1: Identification", "Total Identified", totalIdentified],
      ["Phase 1: Identification", "Duplicate Records Removed", duplicatesRemoved],
      ["Phase 2: Screening", "Records Screened", screened],
      ["Phase 2: Screening", "Records Excluded", screenExcluded],
      ["Phase 2: Screening", "Reports Sought for Retrieval", sought],
      ["Phase 2: Screening", "Reports Not Retrieved", notRetrieved],
      ["Phase 3: Eligibility", "Reports Assessed for Eligibility", assessed],
      ["Phase 3: Eligibility", "Reports Excluded (Criteria Unmet)", excludedEligibility],
      ["Phase 4: Inclusion", "Total Studies Included in Review", included],
    ];
    const csvContent = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRISMA_2020_counts.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen text-neutral-900 dark:text-white py-12 aura-bg-gradient aura-grid-pattern">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 shadow-xs">
              <Layers className="w-3.5 h-3.5" />
              <span>PRISMA 2020 Standard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
              Systematic Review Flow Diagram Generator
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Calibrate your study identification, screening, and eligibility numbers. Reconciles stage arithmetic automatically and exports publication-ready vector SVGs.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl liquid-glass-btn-secondary text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition cursor-pointer shadow-xs"
              title="Download CSV counts for supplementary data"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadSVG}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl liquid-glass-btn-primary text-white text-xs font-semibold tracking-wide transition cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export SVG Vector</span>
            </button>
          </div>
        </div>

        {/* Arithmetic Status Banner */}
        {hasMathDiscrepancy ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-800 dark:text-amber-300">Arithmetic Discrepancy Detected: </span>
                Your input counts do not reconcile mathematically across screening phases. Reviewers frequently desk-reject systematic reviews with count discrepancies.
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoReconcile}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto shrink-0"
            >
              Auto-Reconcile Math
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3.5 rounded-3xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>PRISMA counts perfectly reconciled across all 4 evaluation phases (0 conflicts).</span>
          </div>
        )}

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-4 liquid-glass-card rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Phase 1: Identification
              </span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                title="Reset sample values"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Databases Identified (n):
                </label>
                <input
                  type="number"
                  value={dbIdentified}
                  onChange={(e) => setDbIdentified(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Registers Identified (n):
                </label>
                <input
                  type="number"
                  value={registersIdentified}
                  onChange={(e) => setRegistersIdentified(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Duplicates Removed (n):
                </label>
                <input
                  type="number"
                  value={duplicatesRemoved}
                  onChange={(e) => setDuplicatesRemoved(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-black/5 dark:border-white/10 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-3">
                Phase 2: Screening &amp; Retrieval
              </span>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Records Screened (n):
                  </label>
                  <input
                    type="number"
                    value={screened}
                    onChange={(e) => setScreened(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Records Excluded (n):
                  </label>
                  <input
                    type="number"
                    value={screenExcluded}
                    onChange={(e) => setScreenExcluded(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Reports Sought (n):
                  </label>
                  <input
                    type="number"
                    value={sought}
                    onChange={(e) => setSought(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Reports Not Retrieved (n):
                  </label>
                  <input
                    type="number"
                    value={notRetrieved}
                    onChange={(e) => setNotRetrieved(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-black/5 dark:border-white/10 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-3">
                Phase 3: Eligibility &amp; Included
              </span>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Reports Assessed for Eligibility (n):
                  </label>
                  <input
                    type="number"
                    value={assessed}
                    onChange={(e) => setAssessed(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Reports Excluded with Reason (n):
                  </label>
                  <input
                    type="number"
                    value={excludedEligibility}
                    onChange={(e) => setExcludedEligibility(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-700 dark:text-purple-300 mb-1">
                    Total Studies Included in Review (n):
                  </label>
                  <input
                    type="number"
                    value={included}
                    onChange={(e) => setIncluded(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-purple-400 bg-purple-50 dark:bg-purple-950/40 text-xs font-bold text-purple-950 dark:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Diagram Preview Column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Live PRISMA 2020 Flow Diagram
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Vector SVG · Publication-Ready
              </span>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-white text-slate-900 border border-[#E5E7EB] shadow-2xl overflow-x-auto flex justify-center">
              <svg
                id="prisma-svg"
                viewBox="0 0 650 780"
                className="w-full max-w-[620px] h-auto font-sans select-none"
                style={{ minWidth: "480px" }}
              >
                <defs>
                  <marker
                    id="prisma-arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#64748B" />
                  </marker>
                </defs>

                {/* Canvas Background */}
                <rect width="650" height="780" fill="#FFFFFF" />

                {/* Diagram Title Banner */}
                <rect x="20" y="20" width="610" height="38" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
                <text x="325" y="44" textAnchor="middle" fill="#0F172A" fontSize="13" fontWeight="bold">
                  PRISMA 2020 Flow Diagram for Systematic Reviews
                </text>

                {/* Stage 1: Identification */}
                <rect x="40" y="75" width="250" height="58" rx="8" fill="#FAF5FF" stroke="#C084FC" strokeWidth="1.5" />
                <text x="165" y="98" textAnchor="middle" fill="#581C87" fontSize="11" fontWeight="bold">
                  Records identified from:
                </text>
                <text x="165" y="117" textAnchor="middle" fill="#6B21A8" fontSize="11">
                  Databases (n = {dbIdentified})
                </text>

                <rect x="360" y="75" width="250" height="58" rx="8" fill="#FAF5FF" stroke="#C084FC" strokeWidth="1.5" />
                <text x="485" y="98" textAnchor="middle" fill="#581C87" fontSize="11" fontWeight="bold">
                  Records identified from:
                </text>
                <text x="485" y="117" textAnchor="middle" fill="#6B21A8" fontSize="11">
                  Registers (n = {registersIdentified})
                </text>

                {/* Merging Lines to Screening */}
                <path d="M 165 133 L 165 155 L 325 155" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
                <path d="M 485 133 L 485 155 L 325 155" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
                <line x1="325" y1="155" x2="325" y2="235" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#prisma-arrow)" />

                {/* Duplicates Removed Box */}
                <rect x="380" y="165" width="230" height="48" rx="8" fill="#FFFBEB" stroke="#FCD34D" strokeWidth="1.5" />
                <text x="495" y="186" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="bold">
                  Records removed before screening:
                </text>
                <text x="495" y="202" textAnchor="middle" fill="#B45309" fontSize="10.5">
                  Duplicate records (n = {duplicatesRemoved})
                </text>
                <line x1="325" y1="189" x2="380" y2="189" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#prisma-arrow)" />

                {/* Stage 2: Screening */}
                <rect x="180" y="235" width="290" height="55" rx="8" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5" />
                <text x="325" y="258" textAnchor="middle" fill="#14532D" fontSize="11" fontWeight="bold">
                  Records screened
                </text>
                <text x="325" y="276" textAnchor="middle" fill="#166534" fontSize="11">
                  (n = {screened})
                </text>

                {/* Branch to Excluded */}
                <line x1="325" y1="290" x2="325" y2="375" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#prisma-arrow)" />
                <line x1="325" y1="335" x2="400" y2="335" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#prisma-arrow)" />

                <rect x="400" y="312" width="210" height="48" rx="8" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.5" />
                <text x="505" y="333" textAnchor="middle" fill="#991B1B" fontSize="10.5" fontWeight="bold">
                  Records excluded
                </text>
                <text x="505" y="349" textAnchor="middle" fill="#B91C1C" fontSize="10.5">
                  (n = {screenExcluded})
                </text>

                {/* Stage 3: Retrieval */}
                <rect x="180" y="375" width="290" height="55" rx="8" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5" />
                <text x="325" y="398" textAnchor="middle" fill="#14532D" fontSize="11" fontWeight="bold">
                  Reports sought for retrieval
                </text>
                <text x="325" y="416" textAnchor="middle" fill="#166534" fontSize="11">
                  (n = {sought})
                </text>

                {/* Branch to Not Retrieved */}
                <line x1="325" y1="430" x2="325" y2="515" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#prisma-arrow)" />
                <line x1="325" y1="472" x2="400" y2="472" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#prisma-arrow)" />

                <rect x="400" y="450" width="210" height="48" rx="8" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.5" />
                <text x="505" y="471" textAnchor="middle" fill="#991B1B" fontSize="10.5" fontWeight="bold">
                  Reports not retrieved
                </text>
                <text x="505" y="487" textAnchor="middle" fill="#B91C1C" fontSize="10.5">
                  (n = {notRetrieved})
                </text>

                {/* Stage 4: Eligibility */}
                <rect x="180" y="515" width="290" height="55" rx="8" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5" />
                <text x="325" y="538" textAnchor="middle" fill="#14532D" fontSize="11" fontWeight="bold">
                  Reports assessed for eligibility
                </text>
                <text x="325" y="556" textAnchor="middle" fill="#166534" fontSize="11">
                  (n = {assessed})
                </text>

                {/* Branch to Eligibility Excluded */}
                <line x1="325" y1="570" x2="325" y2="655" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#prisma-arrow)" />
                <line x1="325" y1="612" x2="400" y2="612" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#prisma-arrow)" />

                <rect x="400" y="590" width="210" height="48" rx="8" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.5" />
                <text x="505" y="611" textAnchor="middle" fill="#991B1B" fontSize="10.5" fontWeight="bold">
                  Reports excluded:
                </text>
                <text x="505" y="627" textAnchor="middle" fill="#B91C1C" fontSize="10.5">
                  Criteria unmet (n = {excludedEligibility})
                </text>

                {/* Stage 5: Included */}
                <rect x="150" y="655" width="350" height="68" rx="10" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="2" />
                <text x="325" y="683" textAnchor="middle" fill="#4C1D95" fontSize="12.5" fontWeight="bold">
                  Studies Included in Review
                </text>
                <text x="325" y="705" textAnchor="middle" fill="#5B21B6" fontSize="11.5" fontWeight="bold">
                  Total studies included in synthesis (n = {included})
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

