"use client";

import React, { useState, useEffect } from "react";
import { DesktopHeader } from "@/components/desktop/DesktopHeader";
import {
  DesktopSidebar,
  DesktopActiveView,
  PaperItem,
} from "@/components/desktop/DesktopSidebar";
import {
  DesktopDashboard,
  DesktopDashboardData,
} from "@/components/desktop/DesktopDashboard";
import {
  DesktopSearchModal,
  DesktopNewReviewModal,
} from "@/components/desktop/DesktopModals";
import { ProviderSettingsModal } from "@/components/ProviderSettingsModal";

// Default reference paper from the screenshot
const INITIAL_PAPERS: PaperItem[] = [
  {
    id: "dll3-sclc",
    title: "DLL3 SCLC Nature Pre-Submission",
    shortName: "DLL3 Activation Paper",
    journal: "Nature Communications",
    score: 78,
  },
  {
    id: "crispr-screen",
    title: "CRISPR-Cas9 Screens in Organoid Models",
    shortName: "CRISPR Screen Paper",
    journal: "Cancer Discovery",
    score: 84,
  },
];

const SAMPLE_DASHBOARD_DATA: Record<string, DesktopDashboardData> = {
  "dll3-sclc": {
    paperTitle: "DLL3 SCLC Nature Pre-Submission",
    headlineTitle: "Nature Communications Pre-Submission",
    targetJournal: "Nature Communications",
    aiEngine: "GEMINI 2.5 FLASH",
    latencyMs: 142,
    score: 78,
    statusText: "Revision Prioritized",
    vulnerabilities: [
      {
        type: "overclaim",
        title: "Causal Overclaim",
        description:
          "Abstract claims POU2F1 proves DLL3 expression without rescue control.",
        severity: "critical",
      },
      {
        type: "sample_size",
        title: "Sample Size Power",
        description:
          "Cohort n=8 lacks a priori statistical power calculation.",
        severity: "warning",
      },
    ],
    reviewers: [
      {
        name: "Dr. Vance",
        role: "Methods",
        tag: "Major",
        quote: "sgRNA library coverage depth must be confirmed in organoids.",
        detail:
          "Perform deep NGS re-sequencing of the sgRNA plasmid library representation across all 8 replicates.",
      },
      {
        name: "Dr. Sorkin",
        role: "Stats",
        tag: "Major",
        quote:
          "Parametric t-test used on small sample size without normality test.",
        detail:
          "Switch to non-parametric Wilcoxon rank-sum or Mann-Whitney U test given n=8.",
      },
      {
        name: "Dr. Alistair",
        role: "Big-Picture Skeptic",
        tag: "Minor",
        quote:
          "Translational relevance to clinical small-cell lung cancer requires more emphasis.",
        detail:
          "Add correlation plots showing POU2F1 expression in TCGA or primary SCLC cohorts.",
      },
      {
        name: "Dr. Thorne",
        role: "Desk Rejector",
        tag: "Critical",
        quote:
          "Novelty over recent Cell Reports 2024 paper needs clear demarcation in Introduction.",
        detail:
          "Explicitly distinguish your enhancer binding assay from the published promoter study.",
      },
    ],
    citationAudit: {
      verifiedCount: 15,
      totalCount: 15,
      retractedCount: 0,
      notes: "All 15 DOIs resolved via CrossRef Open API.",
    },
  },
};

export default function DesktopAppPage() {
  const [papers, setPapers] = useState<PaperItem[]>(INITIAL_PAPERS);
  const [activePaperId, setActivePaperId] = useState<string>("dll3-sclc");
  const [activeView, setActiveView] = useState<DesktopActiveView>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewReviewOpen, setIsNewReviewOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active paper data
  const currentPaper =
    papers.find((p) => p.id === activePaperId) || papers[0];
  const dashboardData =
    SAMPLE_DASHBOARD_DATA[activePaperId] ||
    SAMPLE_DASHBOARD_DATA["dll3-sclc"];

  // Global keyboard shortcut for Search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCreateReview = (
    title: string,
    journal: string,
    _file: File | null
  ) => {
    const newId = `paper-${Date.now()}`;
    const newPaper: PaperItem = {
      id: newId,
      title: `${title} Pre-Submission`,
      shortName: title.length > 24 ? title.substring(0, 24) + "..." : title,
      journal,
      score: 82,
    };

    SAMPLE_DASHBOARD_DATA[newId] = {
      paperTitle: newPaper.title,
      headlineTitle: `${journal} Pre-Submission`,
      targetJournal: journal,
      aiEngine: "GEMINI 2.5 FLASH",
      latencyMs: 148,
      score: 82,
      statusText: "Ready for Polish",
      vulnerabilities: [
        {
          type: "generic",
          title: "Preliminary Findings Limitation",
          description:
            "Discussion should explicitly acknowledge prospective validation limitations.",
          severity: "warning",
        },
      ],
      reviewers: [
        {
          name: "Dr. Vance",
          role: "Methods",
          tag: "Minor",
          quote: "Methodology is rigorous; provide protocol details in supplement.",
        },
      ],
      citationAudit: {
        verifiedCount: 12,
        totalCount: 12,
        retractedCount: 0,
      },
    };

    setPapers((prev) => [newPaper, ...prev]);
    setActivePaperId(newId);
    setActiveView("overview");
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden select-none font-sans">
      {/* Top Window Header */}
      <DesktopHeader
        workspaceName="Oncology Institute"
        paperTitle={currentPaper?.title || "Manuscript Pre-Submission"}
        activeModelName={dashboardData.aiEngine}
        latencyMs={dashboardData.latencyMs}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />

      {/* Main App Layout: Sidebar + Dashboard */}
      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <DesktopSidebar
            currentWorkspace="Cancer Genomics"
            papers={papers}
            activePaperId={activePaperId}
            activeView={activeView}
            onSelectPaper={(id) => setActivePaperId(id)}
            onSelectView={(view) => setActiveView(view)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onNewReview={() => setIsNewReviewOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        <DesktopDashboard
          data={dashboardData}
          activeView={activeView}
          onSelectView={(view) => setActiveView(view)}
          onNewScan={() => setIsNewReviewOpen(true)}
        />
      </div>

      {/* Modals */}
      <DesktopSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={(_id) => {
          // Handle item selection
        }}
      />

      <DesktopNewReviewModal
        isOpen={isNewReviewOpen}
        onClose={() => setIsNewReviewOpen(false)}
        onSubmit={handleCreateReview}
      />

      <ProviderSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
