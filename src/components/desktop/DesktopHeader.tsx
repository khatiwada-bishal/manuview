"use client";

import React from "react";
import {
  Sidebar as SidebarIcon,
  ArrowLeft,
  ArrowRight,
  MoreVertical,
  Zap,
  RefreshCw,
} from "lucide-react";

interface DesktopHeaderProps {
  workspaceName: string;
  paperTitle: string;
  isConnected: boolean;
  isLoading?: boolean;
  activeModelName?: string | null;
  latencyMs?: number | null;
  onOpenSettings: () => void;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export function DesktopHeader({
  workspaceName,
  paperTitle,
  isConnected,
  isLoading = false,
  activeModelName,
  latencyMs,
  onOpenSettings,
  onToggleSidebar,
  sidebarOpen = true,
}: DesktopHeaderProps) {
  return (
    <header
      data-tauri-drag-region
      className="h-11 border-b border-[#E5E7EB] flex items-center select-none shrink-0 z-20"
    >
      {/* LEFT SECTION (Matches Sidebar width & background) */}
      <div
        className={`h-full flex items-center border-r border-[#E5E7EB] bg-[#F9FAFB] transition-all duration-150 shrink-0 ${
          sidebarOpen ? "w-64 px-3" : "w-auto px-3"
        }`}
      >
        {/* macOS traffic light spacer */}
        <div className="w-[68px] shrink-0" />

        {/* Sidebar Toggle Button */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="p-1.5 rounded-md hover:bg-[#E5E7EB] text-neutral-500 hover:text-neutral-800 transition cursor-pointer"
          >
            <SidebarIcon className="w-4 h-4" />
          </button>
        )}

        {/* Navigation History Arrows */}
        <div className="flex items-center gap-1 ml-2 text-neutral-400">
          <button
            type="button"
            title="Go back"
            className="p-1 rounded hover:bg-[#E5E7EB] hover:text-neutral-700 transition cursor-pointer disabled:opacity-40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Go forward"
            className="p-1 rounded hover:bg-[#E5E7EB] hover:text-neutral-700 transition cursor-pointer disabled:opacity-40"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* RIGHT SECTION (Matches Dashboard background & breadcrumbs) */}
      <div className="flex-1 h-full bg-white flex items-center justify-between px-5 min-w-0">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-600 truncate min-w-0">
          <span className="font-normal text-neutral-800 shrink-0">
            {workspaceName}
          </span>
          <span className="text-neutral-300">/</span>
          <span
            className="text-neutral-600 truncate font-normal"
            title={paperTitle}
          >
            {paperTitle}
          </span>
        </nav>

        {/* Right Controls: More Options & Live AI Model Badge */}
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <button
            type="button"
            onClick={onOpenSettings}
            title="Workspace actions"
            className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {isLoading ? (
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-500 text-xs font-semibold tracking-wide transition cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3 h-3 animate-spin text-neutral-400" />
              <span>Checking...</span>
            </button>
          ) : !isConnected ? (
            <button
              type="button"
              onClick={onOpenSettings}
              title="No AI API connection. Click to configure API keys."
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold tracking-wide transition cursor-pointer shadow-2xs"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#EF4444]" />
              <span>Not Connected</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenSettings}
              title="Click to configure AI Engine & Models"
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] hover:bg-[#D1FAE5] text-[#065F46] text-xs font-semibold tracking-wide transition cursor-pointer shadow-2xs"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>{activeModelName || "AI MODEL"}</span>
              {latencyMs !== undefined && latencyMs !== null && (
                <span className="text-emerald-700/80 font-mono text-[11px] flex items-center">
                  ( <Zap className="w-3 h-3 text-amber-500 fill-amber-500 inline mr-0.5" />
                  {latencyMs}ms )
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
