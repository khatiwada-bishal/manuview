"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  Bookmark, 
  Info, 
  Sparkles 
} from "lucide-react";
import { ReferenceVerification } from "@/lib/types";
import { exportBibTeX } from "@/lib/export-generator";

const SAMPLE_BIBLIOGRAPHY = `1. Saunders D, et al. A DLL3-targeted antibody-drug conjugate for small cell lung cancer. Sci Transl Med. 2015. DOI: 10.1126/scitranslmed.aac9459
2. Wakefield AJ, et al. Ileal-lymphoid-nodular hyperplasia and pervasive developmental disorder in children. Lancet. 1998. DOI: 10.1016/S0140-6736(97)11096-0
3. NonExistent A, Hallucination B. Synthetic AI generated citation. J Bio. 2024. DOI: 10.1038/s41586-999-hallucinated01
4. Rudin CM, et al. Molecular subtypes of small cell lung cancer. Nat Rev Cancer. 2019. DOI: 10.1038/s41568-019-0133-9`;

export default function ReferenceCheckerPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    total: number;
    verifiedCount?: number;
    uncheckedCount?: number;
    retractedCount: number;
    unresolvableCount: number;
    verified: ReferenceVerification[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSample = () => {
    setInput(SAMPLE_BIBLIOGRAPHY);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please paste a bibliography or reference list.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/verify-references", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bibliography: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Failed to verify bibliography.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-neutral-900 dark:text-white py-12 aura-bg-gradient aura-grid-pattern">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Crossref Open API &amp; Retraction Watch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
            Reference Integrity &amp; Retraction Hazard Audit
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Audit manuscript bibliographies against live scholarly registers. Identify unresolvable citations, phantom DOIs, and retracted studies before peer review.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Manuscript Bibliography / Citations
            </span>
            <button
              type="button"
              onClick={handleSample}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Citations</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your manuscript reference list, bibliography, or DOIs..."
              className="w-full p-3.5 rounded-xl liquid-glass-input text-xs sm:text-sm focus:outline-none font-mono resize-none"
            />

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-rose-300 border border-red-500/20 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={loading}
                className="liquid-glass-btn-primary px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Resolving DOIs with Crossref...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Audit References</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Audit Results */}
        {results && (
          <div className="space-y-6 animate-fade-in">
            {/* Retraction Alert Banner */}
            {results.retractedCount > 0 && (
              <div className="p-5 rounded-3xl bg-red-500/10 dark:bg-rose-950/40 border-2 border-red-500/30 dark:border-rose-600/80 flex items-start gap-3.5 text-red-900 dark:text-rose-200 shadow-md">
                <AlertTriangle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-red-900 dark:text-rose-100">
                    {results.retractedCount} Retracted Publication(s) Detected!
                  </h3>
                  <p className="text-xs text-red-700 dark:text-rose-300 leading-relaxed">
                    Citing retracted studies is one of the most critical desk-rejection triggers in scholarly publishing. Immediately replace or remove these citations prior to submitting.
                  </p>
                </div>
              </div>
            )}

            {/* Metrics Grid (5 Stat Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-4 rounded-2xl liquid-glass-card text-center">
                <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Total Audited</div>
                <div className="text-2xl font-bold font-serif text-neutral-900 dark:text-white mt-1">{results.total}</div>
              </div>
              <div className="p-4 rounded-2xl liquid-glass-card border border-emerald-500/20 bg-emerald-500/5 text-center">
                <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Crossref Verified</div>
                <div className="text-2xl font-bold font-serif text-emerald-800 dark:text-emerald-300 mt-1">
                  {results.verified.filter((r) => r.status === "valid").length}
                </div>
              </div>
              <div className="p-4 rounded-2xl liquid-glass-card border border-neutral-500/20 bg-neutral-500/5 text-center">
                <div className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Not Checked</div>
                <div className="text-2xl font-bold font-serif text-neutral-700 dark:text-neutral-300 mt-1">
                  {results.verified.filter((r) => r.status === "unchecked").length}
                </div>
              </div>
              <div className="p-4 rounded-2xl liquid-glass-card border border-amber-500/20 bg-amber-500/5 text-center">
                <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Unresolvable (404)</div>
                <div className="text-2xl font-bold font-serif text-amber-800 dark:text-amber-300 mt-1">{results.unresolvableCount}</div>
              </div>
              <div className="p-4 rounded-2xl liquid-glass-card border border-rose-500/20 bg-rose-500/5 text-center">
                <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Retracted</div>
                <div className="text-2xl font-bold font-serif text-rose-800 dark:text-rose-300 mt-1">{results.retractedCount}</div>
              </div>
            </div>

            {/* Audited Reference Registry Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Audited Reference Registry
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    exportBibTeX({
                      title: "Audited_Bibliography",
                      citationIntegrity: { references: results.verified }
                    } as any);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold liquid-glass-btn-secondary transition cursor-pointer shadow-xs"
                  title="Export verified references as BibTeX (.bib) file"
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                  <span>Export BibTeX (.bib)</span>
                </button>
              </div>

              <div className="rounded-2xl liquid-glass-card overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-black/[0.03] dark:bg-white/[0.04] border-b border-black/5 dark:border-white/10 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Reference / Article Title</th>
                      <th className="px-4 py-3">Journal &amp; Year</th>
                      <th className="px-4 py-3 text-right">Identifier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/10">
                    {results.verified.map((ref, idx) => (
                      <tr
                        key={idx}
                        className={
                          ref.isRetracted
                            ? "bg-rose-500/10"
                            : ref.status === "unresolvable"
                            ? "bg-amber-500/5"
                            : ref.status === "expression_of_concern"
                            ? "bg-amber-500/10"
                            : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                        }
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          {ref.isRetracted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              RETRACTED
                            </span>
                          ) : ref.status === "expression_of_concern" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              EXPRESSION OF CONCERN
                            </span>
                          ) : ref.status === "valid" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              VERIFIED
                            </span>
                          ) : ref.status === "unresolvable" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                              <Info className="w-2.5 h-2.5" />
                              UNRESOLVABLE (404)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-500/15 text-neutral-600 dark:text-neutral-400 border border-neutral-500/30">
                              <Info className="w-2.5 h-2.5" />
                              NOT CHECKED (NO DOI)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2">
                            {ref.title || ref.raw}
                          </div>
                          {ref.authors && ref.authors.length > 0 && (
                            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                              {ref.authors.join(", ")}
                            </div>
                          )}
                          {ref.retractionDetails && (
                            <div className="text-rose-600 dark:text-rose-400 text-[11px] font-semibold mt-1">
                              {ref.retractionDetails}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                          {ref.journal && <div className="font-medium text-neutral-900 dark:text-neutral-100">{ref.journal}</div>}
                          {ref.year && <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{ref.year}</div>}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {ref.doi ? (
                            <a
                              href={`https://doi.org/${ref.doi}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-mono text-[11px]"
                            >
                              <span>{ref.doi}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-neutral-400 font-mono text-[11px]">No DOI</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
