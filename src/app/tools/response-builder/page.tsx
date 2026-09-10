"use client";

import React, { useState } from "react";
import { Users, RefreshCw, AlertCircle, Copy, Check, Sparkles, ChevronRight, FileCheck } from "lucide-react";

const SAMPLE_DECISION_LETTER = `Dear Authors,

Thank you for submitting your manuscript to Nature Communications. The reviewers have evaluated your manuscript and their comments are appended below. We invite you to submit a revised version addressing all points.

Reviewer #1:
1. The causal claim that POU2F1 directly drives DLL3 transcription is premature. In Figure 2, the authors only present correlative RNA-seq data without a definitive chromatin immunoprecipitation (ChIP) assay or rescue experiment.
2. The cohort size of patient-derived organoids (n=8) is small. Was a power calculation performed? Please provide sample size justification in the Methods section.

Reviewer #2:
1. Figure 3B lacks total protein loading controls on the Western blot. The reduction in DLL3 phosphorylation cannot be validated without total DLL3 bands.
2. In the Abstract, the authors state this finding 'will cure all patients'. This is a severe clinical overstatement that must be toned down.`;

export default function ResponseBuilderPage() {
  const [letterText, setLetterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleSample = () => {
    setLetterText(SAMPLE_DECISION_LETTER);
  };

  const handleParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterText.trim()) {
      setError("Please paste a decision letter or peer-review comments.");
      return;
    }

    setLoading(true);
    setError(null);
    setItems([]);

    try {
      const savedConfig = localStorage.getItem("manuview_provider_config");
      const res = await fetch("/api/tools/response-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decisionLetterText: letterText,
          providerConfig: savedConfig ? JSON.parse(savedConfig) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(data.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to generate response matrix.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyItem = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-white py-12 aura-bg-gradient aura-grid-pattern">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] text-neutral-300 border border-white/10 shadow-sm mb-3">
            <Users className="w-3.5 h-3.5" />
            Rebuttal &amp; Revision Matrix
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Response to Reviewers Workspace
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Turn an unstructured decision letter into an itemized point-by-point rebuttal table, revision checklist, and polite draft responses.
          </p>
        </div>

        <div className="aura-paper-sheet rounded-2xl p-6 sm:p-8 shadow-2xl mb-10 text-[#111827]">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-4">
            <span className="text-xs font-semibold text-[#111827]">Paste Reviewer Comments</span>
            <button
              type="button"
              onClick={handleSample}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Load Sample Decision Letter
            </button>
          </div>

          <form onSubmit={handleParse} className="space-y-4">
            <textarea
              rows={6}
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              placeholder="Paste editor decision letter and reviewer comments..."
              className="w-full p-3 rounded-xl bg-white border border-[#D1D5DB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-rose-500 font-mono"
            />

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Parsing Reviewer Comments...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Point-by-Point Rebuttal Matrix</span>
                </>
              )}
            </button>
          </form>
        </div>

        {items.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Itemized Reviewer Matrix ({items.length} points extracted)
              </h3>
            </div>

            <div className="space-y-4">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.reviewer || `Point ${idx + 1}`}
                      </span>
                      <span className="text-xs font-semibold text-rose-400">
                        {item.category || "Critique"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyItem(item.draftResponse, idx)}
                      className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-white transition"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIdx === idx ? "Copied" : "Copy Rebuttal"}</span>
                    </button>
                  </div>

                  {/* Comment */}
                  <div className="p-3 rounded-xl bg-slate-950 text-xs italic text-slate-300 border border-slate-800">
                    &quot;{item.rawComment}&quot;
                  </div>

                  {/* Required Action */}
                  <div className="text-xs text-amber-300 bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/40">
                    <span className="font-semibold block mb-0.5 text-amber-400">Action Required:</span>
                    {item.actionRequired}
                  </div>

                  {/* Draft response */}
                  <div className="text-xs text-emerald-200 bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/40 font-serif leading-relaxed">
                    <span className="font-semibold block mb-1 text-emerald-400 font-sans text-[11px] uppercase tracking-wider">
                      Draft Academic Response:
                    </span>
                    {item.draftResponse}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
