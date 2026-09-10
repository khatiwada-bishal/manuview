"use client";

import React, { useState } from "react";
import { Layers, Download, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

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

  const hasMathDiscrepancy = screeningDiff !== 0 || soughtDiff !== 0 || assessedDiff !== 0 || includedDiff !== 0;

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

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-3">
            <Layers className="w-3.5 h-3.5" />
            Systematic Review Standard
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            PRISMA 2020 Flow Diagram Generator
          </h1>
          <p className="text-slate-400 text-xs">
            Enter screening and eligibility numbers. The generator reconciles arithmetic across stages and generates an editable, publication-ready SVG.
          </p>
        </div>

        {/* Arithmetic Alert */}
        {hasMathDiscrepancy ? (
          <div className="p-4 mb-8 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="font-semibold block">Arithmetic Discrepancy Detected:</span>
                Your input counts do not reconcile mathematically across stages. Peer reviewers frequently desk-reject systematic reviews with screening count contradictions.
              </div>
            </div>
            <button
              onClick={() => {
                const expScr = totalIdentified - Number(duplicatesRemoved);
                setScreened(expScr);
                const expSou = expScr - Number(screenExcluded);
                setSought(expSou);
                const expAss = expSou - Number(notRetrieved);
                setAssessed(expAss);
                setIncluded(expAss - Number(excludedEligibility));
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[11px] transition whitespace-nowrap"
            >
              Auto-Reconcile Math
            </button>
          </div>
        ) : (
          <div className="p-3 mb-8 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>All PRISMA screening arithmetic reconciles perfectly (0 conflicts).</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs Column */}
          <div className="space-y-6 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl h-fit">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">
              1. Identification &amp; Duplicates
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Databases identified (n):</label>
                <input
                  type="number"
                  value={dbIdentified}
                  onChange={(e) => setDbIdentified(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Registers identified (n):</label>
                <input
                  type="number"
                  value={registersIdentified}
                  onChange={(e) => setRegistersIdentified(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Duplicates removed (n):</label>
                <input
                  type="number"
                  value={duplicatesRemoved}
                  onChange={(e) => setDuplicatesRemoved(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 pt-2">
              2. Screening &amp; Retrieval
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Records screened (n):</label>
                <input
                  type="number"
                  value={screened}
                  onChange={(e) => setScreened(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Records excluded (n):</label>
                <input
                  type="number"
                  value={screenExcluded}
                  onChange={(e) => setScreenExcluded(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Reports sought (n):</label>
                <input
                  type="number"
                  value={sought}
                  onChange={(e) => setSought(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Reports not retrieved (n):</label>
                <input
                  type="number"
                  value={notRetrieved}
                  onChange={(e) => setNotRetrieved(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 pt-2">
              3. Eligibility &amp; Included
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Reports assessed (n):</label>
                <input
                  type="number"
                  value={assessed}
                  onChange={(e) => setAssessed(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Reports excluded with reason (n):</label>
                <input
                  type="number"
                  value={excludedEligibility}
                  onChange={(e) => setExcludedEligibility(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Studies included in review (n):</label>
                <input
                  type="number"
                  value={included}
                  onChange={(e) => setIncluded(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>
          </div>

          {/* Diagram Preview Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Live PRISMA 2020 SVG Diagram</span>
              <button
                onClick={handleDownloadSVG}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export SVG</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-white text-slate-900 border border-slate-800 shadow-2xl overflow-x-auto flex justify-center">
              <svg id="prisma-svg" width="600" height="740" viewBox="0 0 600 740" className="font-sans">
                {/* Background */}
                <rect width="600" height="740" fill="#ffffff" />

                {/* Section labels */}
                <text x="30" y="40" fill="#1e293b" fontWeight="bold" fontSize="15">PRISMA 2020 Flow Diagram</text>

                {/* Stage 1: Identification */}
                <rect x="30" y="70" width="250" height="60" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="45" y="95" fill="#0f172a" fontSize="11" fontWeight="600">Records identified from:</text>
                <text x="45" y="115" fill="#334155" fontSize="11">Databases (n = {dbIdentified})</text>

                <rect x="320" y="70" width="250" height="60" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="335" y="95" fill="#0f172a" fontSize="11" fontWeight="600">Records removed before screening:</text>
                <text x="335" y="115" fill="#334155" fontSize="11">Duplicate records removed (n = {duplicatesRemoved})</text>

                {/* Arrow */}
                <line x1="155" y1="130" x2="155" y2="180" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" />

                {/* Stage 2: Screening */}
                <rect x="30" y="180" width="250" height="60" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="45" y="205" fill="#0f172a" fontSize="11" fontWeight="600">Records screened</text>
                <text x="45" y="225" fill="#334155" fontSize="11">(n = {screened})</text>

                <rect x="320" y="180" width="250" height="60" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="335" y="205" fill="#0f172a" fontSize="11" fontWeight="600">Records excluded</text>
                <text x="335" y="225" fill="#334155" fontSize="11">(n = {screenExcluded})</text>

                {/* Arrow */}
                <line x1="155" y1="240" x2="155" y2="290" stroke="#64748b" strokeWidth="1.5" />
                <line x1="280" y1="210" x2="320" y2="210" stroke="#64748b" strokeWidth="1.5" />

                {/* Stage 3: Retrieval */}
                <rect x="30" y="290" width="250" height="60" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="45" y="315" fill="#0f172a" fontSize="11" fontWeight="600">Reports sought for retrieval</text>
                <text x="45" y="335" fill="#334155" fontSize="11">(n = {sought})</text>

                <rect x="320" y="290" width="250" height="60" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="335" y="315" fill="#0f172a" fontSize="11" fontWeight="600">Reports not retrieved</text>
                <text x="335" y="335" fill="#334155" fontSize="11">(n = {notRetrieved})</text>

                {/* Arrow */}
                <line x1="155" y1="350" x2="155" y2="400" stroke="#64748b" strokeWidth="1.5" />
                <line x1="280" y1="320" x2="320" y2="320" stroke="#64748b" strokeWidth="1.5" />

                {/* Stage 4: Eligibility */}
                <rect x="30" y="400" width="250" height="60" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="45" y="425" fill="#0f172a" fontSize="11" fontWeight="600">Reports assessed for eligibility</text>
                <text x="45" y="445" fill="#334155" fontSize="11">(n = {assessed})</text>

                <rect x="320" y="400" width="250" height="60" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="335" y="425" fill="#0f172a" fontSize="11" fontWeight="600">Reports excluded:</text>
                <text x="335" y="445" fill="#334155" fontSize="11">Reason specifications (n = {excludedEligibility})</text>

                {/* Arrow */}
                <line x1="155" y1="460" x2="155" y2="520" stroke="#64748b" strokeWidth="1.5" />
                <line x1="280" y1="430" x2="320" y2="430" stroke="#64748b" strokeWidth="1.5" />

                {/* Stage 5: Included */}
                <rect x="30" y="520" width="250" height="70" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
                <text x="45" y="550" fill="#065f46" fontSize="12" fontWeight="bold">New studies included in review</text>
                <text x="45" y="570" fill="#047857" fontSize="12" fontWeight="600">(n = {included})</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
