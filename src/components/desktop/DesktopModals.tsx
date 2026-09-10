"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  UploadCloud,
  FileText,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import JournalCombobox from "@/components/JournalCombobox";
import { pickManuscriptFileDesktop, isDesktopApp } from "@/lib/desktop";

interface DesktopSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (id: string) => void;
}

export function DesktopSearchModal({
  isOpen,
  onClose,
  onSelectItem,
}: DesktopSearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { id: "paper-1", title: "DLL3 SCLC Nature Pre-Submission", cat: "Manuscript" },
    { id: "vuln-1", title: "Causal Overclaim (POU2F1 expression)", cat: "Vulnerability" },
    { id: "vuln-2", title: "Sample Size Power (Cohort n=8)", cat: "Vulnerability" },
    { id: "rev-1", title: "Dr. Vance (Methods critique)", cat: "Reviewer Persona" },
    { id: "rev-2", title: "Dr. Sorkin (Statistical critique)", cat: "Reviewer Persona" },
    { id: "tool-fit", title: "Journal Fit Predictor", cat: "Tool" },
    { id: "tool-cover", title: "Cover Letter Generator", cat: "Tool" },
  ].filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E7EB]">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers, vulnerabilities, reviewer comments..."
            className="flex-1 bg-transparent text-sm text-[#111827] placeholder-neutral-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {items.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              No matching items found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectItem(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F3F4F6] text-left transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 transition" />
                    <span className="text-xs font-medium text-[#111827]">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                    {item.cat}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DesktopNewReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, journal: string, file: File | null) => void;
}

export function DesktopNewReviewModal({
  isOpen,
  onClose,
  onSubmit,
}: DesktopNewReviewModalProps) {
  const [journal, setJournal] = useState("Nature Communications");
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNativePick = async () => {
    if (isDesktopApp()) {
      const res = await pickManuscriptFileDesktop();
      if (res) {
        setFileName(res.name);
        // Create synthetic File object
        const blob = new Blob([res.bytes as unknown as BlobPart]);
        const file = new File([blob], res.name);
        setSelectedFile(file);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] p-6 space-y-5 animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪄</span>
            <div>
              <h2 className="text-sm font-bold text-[#111827]">
                New Pre-Submission Review
              </h2>
              <p className="text-xs text-neutral-500">
                Run 4-persona simulations &amp; cross-ref audits on your manuscript.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Target Journal
            </label>
            <JournalCombobox
              value={journal}
              onChange={setJournal}
              placeholder="Select target journal..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Manuscript Working Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Single-cell transcriptional profiling of DLL3 activation..."
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D1D5DB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Manuscript Document (.pdf or .docx)
            </label>
            <div
              onClick={() => {
                if (isDesktopApp()) {
                  handleNativePick();
                }
              }}
              className="border-2 border-dashed border-[#D1D5DB] hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer transition bg-[#F9FAFB] hover:bg-blue-50/20"
            >
              <UploadCloud className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              {fileName ? (
                <p className="text-xs font-semibold text-blue-600">{fileName}</p>
              ) : (
                <>
                  <p className="text-xs font-semibold text-[#111827]">
                    Click to select manuscript file
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    PDF, DOCX, or Markdown supported
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSubmit(title || "Untitled Manuscript", journal, selectedFile);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Review</span>
          </button>
        </div>
      </div>
    </div>
  );
}
