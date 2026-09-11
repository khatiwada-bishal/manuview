"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Plus, Check, X, BookOpen, Trash2, ChevronDown } from "lucide-react";
import MASTER_JOURNAL_LIST from "@/lib/journal-names.json";
import { JOURNAL_CATALOG } from "@/lib/journals";

interface JournalComboboxProps {
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
  errorMessage?: string;
  placeholder?: string;
  className?: string;
}

const STORAGE_KEY = "manuview_custom_journals";

export default function JournalCombobox({
  value,
  onChange,
  hasError = false,
  errorMessage,
  placeholder = "Type at least 3 letters to search journals...",
  className = "",
}: JournalComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customJournals, setCustomJournals] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Set of curated catalog journal names for quick lookup
  const catalogSet = useMemo(() => {
    return new Set(JOURNAL_CATALOG.map((j) => j.name.toLowerCase()));
  }, []);

  // Load custom journals from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setCustomJournals(parsed);
          }
        }
      }
    } catch (e) {
      console.warn("Could not load custom journals from localStorage", e);
    }
  }, []);

  // Synchronize internal search query when external value changes
  useEffect(() => {
    setSearchQuery(value || "");
  }, [value]);

  // Combined master list + custom journals, deduplicated
  const allJournals = useMemo(() => {
    const combined = [...customJournals, ...MASTER_JOURNAL_LIST];
    const seen = new Set<string>();
    const result: string[] = [];

    for (const item of combined) {
      const lower = item.trim().toLowerCase();
      if (lower && !seen.has(lower)) {
        seen.add(lower);
        result.push(item.trim());
      }
    }
    return result;
  }, [customJournals]);

  // Filtered journals based on user search query (minimum 3 characters required)
  const trimmedQuery = searchQuery.trim();
  const queryLower = trimmedQuery.toLowerCase();

  const filteredJournals = useMemo(() => {
    if (queryLower.length < 3) {
      return [];
    }

    const exactMatches: string[] = [];
    const prefixMatches: string[] = [];
    const wordPrefixMatches: string[] = [];
    const containsMatches: string[] = [];

    for (const j of allJournals) {
      const lower = j.toLowerCase();
      if (lower === queryLower) {
        exactMatches.push(j);
      } else if (lower.startsWith(queryLower)) {
        prefixMatches.push(j);
      } else if (lower.includes(" " + queryLower) || lower.includes("-" + queryLower) || lower.includes(":" + queryLower)) {
        wordPrefixMatches.push(j);
      } else if (lower.includes(queryLower)) {
        containsMatches.push(j);
      }
    }

    return [...exactMatches, ...prefixMatches, ...wordPrefixMatches, ...containsMatches];
  }, [allJournals, queryLower]);

  // Determine if typed query is a brand new journal not in the list
  const isExactMatch = useMemo(() => {
    if (!trimmedQuery || trimmedQuery.length < 3) return true;
    return allJournals.some((j) => j.toLowerCase() === queryLower);
  }, [allJournals, trimmedQuery, queryLower]);

  const canAddNew = trimmedQuery.length >= 3 && !isExactMatch;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // If user left text without explicitly selecting, keep current value
        setSearchQuery(value || "");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  // Scroll active item into view during keyboard navigation
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  // Handle selecting an existing journal
  const handleSelectJournal = (journalName: string) => {
    onChange(journalName);
    setSearchQuery(journalName);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  // Handle creating & adding a new custom journal
  const handleAddCustomJournal = (nameToAdd?: string) => {
    const name = (nameToAdd || trimmedQuery).trim();
    if (!name) return;

    // Check if not already in custom list
    const lower = name.toLowerCase();
    const alreadyCustom = customJournals.some((j) => j.toLowerCase() === lower);

    if (!alreadyCustom) {
      const updated = [name, ...customJournals];
      setCustomJournals(updated);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
      } catch (e) {
        console.warn("Could not save custom journal to localStorage", e);
      }
    }

    onChange(name);
    setSearchQuery(name);
    setIsOpen(false);
    setActiveIndex(-1);

    // Show temporary confirmation toast
    setAddedToast(name);
    setTimeout(() => setAddedToast(null), 3000);
  };

  // Handle deleting a user-added custom journal
  const handleDeleteCustomJournal = (e: React.MouseEvent, journalName: string) => {
    e.stopPropagation();
    const updated = customJournals.filter(
      (j) => j.toLowerCase() !== journalName.toLowerCase()
    );
    setCustomJournals(updated);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (err) {
      console.warn("Could not update custom journals in localStorage", err);
    }
    if (value.toLowerCase() === journalName.toLowerCase()) {
      onChange("");
      setSearchQuery("");
    }
  };

  // Clear current selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
    setIsOpen(true);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (trimmedQuery.length < 3) {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery(value || "");
      }
      return;
    }

    const totalItems = filteredJournals.length + (canAddNew ? 1 : 0);
    if (totalItems === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % totalItems);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (canAddNew && activeIndex === 0) {
        handleAddCustomJournal();
      } else {
        const itemIdx = canAddNew ? activeIndex - 1 : activeIndex;
        if (itemIdx >= 0 && itemIdx < filteredJournals.length) {
          handleSelectJournal(filteredJournals[itemIdx]);
        } else if (canAddNew) {
          handleAddCustomJournal();
        } else if (filteredJournals.length > 0) {
          handleSelectJournal(filteredJournals[0]);
        }
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setSearchQuery(value || "");
    }
  };

  // Check if a journal is user-added custom
  const isCustom = (j: string) => {
    const l = j.toLowerCase();
    return customJournals.some((cj) => cj.toLowerCase() === l);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-expanded={isOpen}
          className={`w-full text-xs pl-8 pr-16 py-2 rounded-lg transition font-normal ${
            hasError
              ? "bg-[#FDF0EF] border border-[#F7CECC] text-[#7C2D2B] placeholder-[#A05E5C] focus:outline-none ring-1 ring-[#F7CECC]"
              : "bg-white border border-[#EBEBEA] text-[#2F3437] placeholder-[#888888] hover:border-[#CCCCCC] focus:border-[#0075eb] focus:outline-none focus:ring-2 focus:ring-[#0075eb]/20 shadow-sm"
          }`}
        />
        
        {/* Left Book/Search Icon */}
        <BookOpen className="w-3.5 h-3.5 absolute left-2.5 text-[#9B9A97] pointer-events-none" />

        {/* Right Action Buttons */}
        <div className="absolute right-2 flex items-center gap-1">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded hover:bg-[#F0F0EF] text-[#9B9A97] hover:text-[#2F3437] transition"
              title="Clear selection"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              if (!isOpen) inputRef.current?.focus();
            }}
            className="p-1 rounded hover:bg-[#F0F0EF] text-[#9B9A97] hover:text-[#2F3437] transition"
            title={isOpen ? "Close dropdown" : "Show journal list"}
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Success Notification for newly added journal */}
      {addedToast && (
        <div className="absolute top-full left-0 mt-1.5 z-40 bg-[#EBF8F2] border border-[#BDEBD6] text-[#0F6B43] text-[11px] px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5 animate-fadeIn">
          <Check className="w-3 h-3 text-[#0F6B43]" />
          <span>Added <strong>"{addedToast}"</strong> to your journal list!</span>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-[#EBEBEA] rounded-xl shadow-xl z-50 overflow-hidden text-xs divide-y divide-[#F7F7F5] animate-fadeIn">
          {/* Header Info Bar */}
          <div className="px-3 py-1.5 bg-[#FAF9F7] text-[10px] text-[#787774] flex items-center justify-between font-mono">
            <span className="flex items-center gap-1">
              <Search className="w-2.5 h-2.5 text-[#9B9A97]" />
              <span>{allJournals.length.toLocaleString()} catalogued journals</span>
            </span>
            <span>
              {trimmedQuery.length < 3 ? "Type 3+ letters" : `${filteredJournals.length} matches`}
            </span>
          </div>

          {/* "+ Add New Journal" Action Row if user typed a non-existing journal */}
          {canAddNew && (
            <div
              data-index={0}
              onClick={() => handleAddCustomJournal()}
              className={`px-3 py-2.5 bg-[#F4F9FF] border-b border-[#E1EFFF] cursor-pointer flex items-center justify-between transition ${
                activeIndex === 0 ? "bg-[#E5F2FF] text-[#0066CC]" : "hover:bg-[#EBF5FF] text-[#0075eb]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#0075eb] text-white flex items-center justify-center font-bold text-xs">
                  <Plus className="w-3.5 h-3.5" />
                </span>
                <div>
                  <div className="font-semibold text-xs text-[#0066CC]">
                    Add "{trimmedQuery}" to list
                  </div>
                  <div className="text-[10px] text-[#0075eb]/70">
                    Not found in catalog — click to save and evaluate rubric
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-[#D0E6FF] text-[#0055AA] px-1.5 py-0.5 rounded tracking-wide uppercase">
                New Journal
              </span>
            </div>
          )}

          {/* List of Matching Journals */}
          <div
            ref={listRef}
            className="max-h-64 overflow-y-auto divide-y divide-[#F7F7F5] overscroll-contain"
          >
            {trimmedQuery.length < 3 ? (
              <div className="px-4 py-8 text-center text-[#787774]">
                <BookOpen className="w-5 h-5 mx-auto mb-2 text-[#9B9A97]" />
                <p className="font-semibold text-xs text-[#2F3437]">Type at least 3 letters to search</p>
                <p className="text-[11px] text-[#9B9A97] mt-1 max-w-xs mx-auto">
                  Type 3 or more characters to display and scroll through all matching academic journals.
                </p>
              </div>
            ) : filteredJournals.length === 0 && !canAddNew ? (
              <div className="px-4 py-6 text-center text-[#787774]">
                <BookOpen className="w-6 h-6 mx-auto mb-2 text-[#CCCCCC]" />
                <p className="font-medium text-xs text-[#2F3437]">No matching journals found</p>
                <p className="text-[11px] text-[#9B9A97] mt-1">
                  Type at least 3 characters to create and add a new journal title.
                </p>
              </div>
            ) : (
              filteredJournals.map((journal, index) => {
                const itemDomIndex = canAddNew ? index + 1 : index;
                const isSelected = value.trim().toLowerCase() === journal.toLowerCase();
                const isItemActive = activeIndex === itemDomIndex;
                const isCurated = catalogSet.has(journal.toLowerCase());
                const isCustomAdded = isCustom(journal);

                return (
                  <div
                    key={journal}
                    data-index={itemDomIndex}
                    onClick={() => handleSelectJournal(journal)}
                    className={`px-3 py-2 cursor-pointer flex items-center justify-between transition ${
                      isSelected
                        ? "bg-[#F7F7F5] text-[#2F3437] font-semibold"
                        : isItemActive
                        ? "bg-[#FAFAFA] text-[#2F3437]"
                        : "hover:bg-[#F9F9F8] text-[#37352F]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          isSelected
                            ? "bg-[#0075eb]"
                            : isCurated
                            ? "bg-[#0F6B43]"
                            : isCustomAdded
                            ? "bg-[#9065B0]"
                            : "bg-[#D3D1CB]"
                        }`}
                      />
                      <span className="truncate font-medium text-xs text-[#2F3437]">
                        {journal}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isCurated && (
                        <span className="text-[9px] font-medium bg-[#EBF8F2] text-[#0F6B43] border border-[#BDEBD6] px-1.5 py-0.5 rounded">
                          Curated
                        </span>
                      )}
                      {isCustomAdded && (
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-medium bg-[#F6EEFB] text-[#783CB3] border border-[#E9D4F7] px-1.5 py-0.5 rounded">
                            Custom
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomJournal(e, journal)}
                            className="p-1 hover:bg-[#FDF0EF] text-[#9B9A97] hover:text-[#7C2D2B] rounded transition"
                            title="Remove from custom list"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#0075eb]" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Guide / Status */}
          <div className="px-3 py-1.5 bg-[#FAF9F7] text-[10px] text-[#787774] flex items-center justify-between border-t border-[#EBEBEA]">
            <span>
              Use <kbd className="bg-white border border-[#EBEBEA] rounded px-1 py-0.2 font-mono text-[9px]">↑</kbd> <kbd className="bg-white border border-[#EBEBEA] rounded px-1 py-0.2 font-mono text-[9px]">↓</kbd> to navigate, <kbd className="bg-white border border-[#EBEBEA] rounded px-1 py-0.2 font-mono text-[9px]">Enter</kbd> to pick
            </span>
            {value && (
              <span className="text-[#0F6B43] font-medium flex items-center gap-1">
                <Check className="w-2.5 h-2.5" /> Selected
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
