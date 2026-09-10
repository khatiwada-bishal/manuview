"use client";

import React from "react";
import { Sidebar as SidebarIcon, Zap } from "lucide-react";
import { isDesktopApp } from "@/lib/desktop";

interface DesktopHeaderProps {
  workspaceName: string;
  paperTitle: string;
  activeModelName?: string;
  latencyMs?: number;
  onOpenSettings: () => void;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export function DesktopHeader({
  workspaceName,
  paperTitle,
  activeModelName = "GEMINI 2.5 FLASH",
  latencyMs = 142,
  onOpenSettings,
  onToggleSidebar,
  sidebarOpen = true,
}: DesktopHeaderProps) {
  const isDesktop = isDesktopApp();

  return (
    <header
      data-tauri-drag-region
      className="h-12 border-b border-[#E5E7EB] bg-white flex items-center justify-between px-4 select-none shrink-0 z-20"
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* macOS traffic light spacer if in desktop app */}
        {isDesktop && <div className="w-16 shrink-0" />}

        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition cursor-pointer"
          >
            <SidebarIcon className="w-4 h-4" />
          </button>
        )}

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-neutral-600 truncate">
          <span className="flex items-center gap-1.5 font-medium text-neutral-800 shrink-0">
            <span role="img" aria-label="microscope" className="text-sm">
              🔬
            </span>
            {workspaceName}
          </span>
          <span className="text-neutral-300">/</span>
          <span className="flex items-center gap-1.5 text-neutral-600 truncate font-normal">
            <span role="img" aria-label="document" className="text-xs">
              📄
            </span>
            <span className="truncate max-w-[280px] sm:max-w-md" title={paperTitle}>
              {paperTitle}
            </span>
          </span>
        </nav>
      </div>

      {/* Model & Latency Pill */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenSettings}
          title="Click to configure AI Engine & Models"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] hover:bg-[#D1FAE5] text-[#065F46] text-xs font-semibold tracking-wide transition cursor-pointer shadow-2xs"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{activeModelName}</span>
          <span className="text-emerald-700/80 font-mono text-[11px] flex items-center">
            ( <Zap className="w-3 h-3 text-amber-500 fill-amber-500 inline mr-0.5" />
            {latencyMs}ms )
          </span>
        </button>
      </div>
    </header>
  );
}
