"use client";

import React from "react";
import {
  Search,
  Sparkles,
  Settings,
  ChevronDown,
  FileText,
  Users,
  CheckCircle2,
  BookOpen,
  Plus,
} from "lucide-react";

export type DesktopActiveView =
  | "overview"
  | "personas"
  | "citations"
  | "recommendations";

export interface PaperItem {
  id: string;
  title: string;
  shortName: string;
  journal: string;
  score: number;
}

interface DesktopSidebarProps {
  currentWorkspace: string;
  papers: PaperItem[];
  activePaperId: string;
  activeView: DesktopActiveView;
  isConnected?: boolean;
  provider?: string | null;
  onSelectPaper: (id: string) => void;
  onSelectView: (view: DesktopActiveView) => void;
  onOpenSearch: () => void;
  onNewReview: () => void;
  onOpenSettings: () => void;
}

export function DesktopSidebar({
  currentWorkspace = "Cancer Genomics",
  papers,
  activePaperId,
  activeView,
  isConnected = false,
  provider,
  onSelectPaper,
  onSelectView,
  onOpenSearch,
  onNewReview,
  onOpenSettings,
}: DesktopSidebarProps) {
  const activePaper = papers.find((p) => p.id === activePaperId) || papers[0];

  return (
    <aside className="w-64 bg-[#F9FAFB] border-r border-[#E5E7EB] flex flex-col h-full select-none shrink-0 text-[#1F2937]">
      {/* Workspace Header Switcher */}
      <div className="p-3 border-b border-[#E5E7EB]/60">
        <button
          type="button"
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#E5E7EB]/60 transition text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              M
            </div>
            <span className="font-semibold text-xs text-[#111827] truncate">
              {currentWorkspace}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition shrink-0" />
        </button>
      </div>

      {/* Quick Action Navigation */}
      <div className="px-3 py-2 space-y-0.5">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#4B5563] hover:bg-[#E5E7EB]/50 hover:text-[#111827] transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#6B7280]" />
            <span>Search</span>
          </div>
          <kbd className="text-[10px] font-mono text-neutral-400 bg-white border border-neutral-200 rounded px-1.5 py-0.5 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onNewReview}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#2563EB] hover:bg-blue-50 font-medium transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          <span>Notion AI Review</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#4B5563] hover:bg-[#E5E7EB]/50 hover:text-[#111827] transition cursor-pointer"
        >
          <Settings className="w-4 h-4 text-[#6B7280]" />
          <span>AI Settings</span>
        </button>
      </div>

      {/* WORKSPACES Section */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        <div>
          <div className="flex items-center justify-between px-2.5 mb-1.5">
            <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              WORKSPACES
            </span>
            <button
              type="button"
              onClick={onNewReview}
              title="Add new paper"
              className="p-1 rounded hover:bg-[#E5E7EB] text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {papers.map((paper) => {
              const isSelected = paper.id === activePaperId;
              return (
                <div key={paper.id} className="space-y-0.5">
                  {/* Paper item */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPaper(paper.id);
                      onSelectView("overview");
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition text-left cursor-pointer ${
                      isSelected && activeView === "overview"
                        ? "bg-[#E5E7EB] font-semibold text-[#111827] shadow-2xs"
                        : isSelected
                        ? "bg-[#F3F4F6] font-medium text-[#1F2937]"
                        : "text-[#4B5563] hover:bg-[#E5E7EB]/40 hover:text-[#111827]"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span className="truncate">{paper.shortName}</span>
                  </button>

                  {/* Sub-views for active paper */}
                  {isSelected && (
                    <div className="pl-4 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => onSelectView("personas")}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition text-left cursor-pointer ${
                          activeView === "personas"
                            ? "bg-[#E5E7EB] font-semibold text-[#111827]"
                            : "text-[#4B5563] hover:bg-[#E5E7EB]/40 hover:text-[#111827]"
                        }`}
                      >
                        <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">4-Persona Reviews</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectView("citations")}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition text-left cursor-pointer ${
                          activeView === "citations"
                            ? "bg-[#E5E7EB] font-semibold text-[#111827]"
                            : "text-[#4B5563] hover:bg-[#E5E7EB]/40 hover:text-[#111827]"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">CrossRef Audit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectView("recommendations")}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition text-left cursor-pointer ${
                          activeView === "recommendations"
                            ? "bg-[#E5E7EB] font-semibold text-[#111827]"
                            : "text-[#4B5563] hover:bg-[#E5E7EB]/40 hover:text-[#111827]"
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span className="truncate">
                          {paper.journal.split(" ")[0]} Recommendations
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#E5E7EB] bg-white/50 text-[11px] text-neutral-500 flex items-center justify-between">
        <span className="font-medium text-neutral-600">ManuView Desktop</span>
        {isConnected ? (
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Connected
          </span>
        ) : (
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Not Connected
          </button>
        )}
      </div>
    </aside>
  );
}
