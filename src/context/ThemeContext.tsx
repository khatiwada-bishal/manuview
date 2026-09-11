"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export type ThemeMode = "light" | "dark";

export type ThemeClickEvent =
  | React.MouseEvent<HTMLElement>
  | MouseEvent
  | { clientX?: number; clientY?: number };

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: (event?: ThemeClickEvent) => void;
  setTheme: (mode: ThemeMode, event?: ThemeClickEvent) => void;
}

const THEME_STORAGE_KEY = "manuview_theme_mode";

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    try {
      // Clear legacy localStorage so fresh launches always default to light mode
      localStorage.removeItem(THEME_STORAGE_KEY);

      // Check current session storage if user toggled during this run
      const sessionSaved = sessionStorage.getItem(THEME_STORAGE_KEY);
      if (sessionSaved === "light" || sessionSaved === "dark") {
        return sessionSaved;
      }
    } catch {}
    // Default loading is ALWAYS light mode every time the application opens
    return "light";
  });

  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
    try {
      sessionStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const runWaveTransition = (nextTheme: ThemeMode, event?: ThemeClickEvent) => {
    if (typeof document === "undefined") return;

    if (isTransitioningRef.current) return;

    // Check accessibility preference for reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setThemeState(nextTheme);
      return;
    }

    // Determine the wave's origin point (defaulting to the top-right button coordinates)
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;

    const x =
      event && typeof event.clientX === "number" && event.clientX > 0
        ? event.clientX
        : windowWidth - 32;
    const y =
      event && typeof event.clientY === "number" && event.clientY > 0
        ? event.clientY
        : 20;

    // Radius to reach the furthest corner (which from top-right is the bottom-left corner at (0, windowHeight))
    const endRadius = Math.hypot(
      Math.max(x, windowWidth - x),
      Math.max(y, windowHeight - y)
    );

    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };

    // 1. Native View Transitions API (Supported on modern Safari / WebKit & Chromium)
    if (typeof doc.startViewTransition === "function") {
      isTransitioningRef.current = true;

      const transition = doc.startViewTransition(() => {
        flushSync(() => {
          // Immediately apply next theme class to root and commit state
          const root = document.documentElement;
          if (nextTheme === "dark") {
            root.classList.add("dark");
            root.style.colorScheme = "dark";
          } else {
            root.classList.remove("dark");
            root.style.colorScheme = "light";
          }
          setThemeState(nextTheme);
        });
      });

      transition.ready
        .then(() => {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ];

          document.documentElement.animate(
            {
              clipPath: clipPath,
            },
            {
              duration: 1200,
              easing: "cubic-bezier(0.4, 0, 0.15, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {})
        .finally(() => {
          transition.finished.finally(() => {
            isTransitioningRef.current = false;
          });
        });
      return;
    }

    // 2. High-Fidelity Wave Overlay Fallback (spreading steadily like bushfire)
    isTransitioningRef.current = true;
    const overlay = document.createElement("div");
    overlay.className = "theme-water-wave-fallback";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.zIndex = "999999";
    overlay.style.pointerEvents = "none";
    overlay.style.backgroundColor = nextTheme === "dark" ? "#080B11" : "#FFFFFF";
    overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    overlay.style.transition = "clip-path 1200ms cubic-bezier(0.4, 0, 0.15, 1)";
    document.body.appendChild(overlay);

    // Force layout reflow
    void overlay.offsetHeight;

    overlay.style.clipPath = `circle(${endRadius}px at ${x}px ${y}px)`;

    setTimeout(() => {
      setThemeState(nextTheme);
      setTimeout(() => {
        overlay.remove();
        isTransitioningRef.current = false;
      }, 50);
    }, 1180);
  };

  const toggleTheme = (event?: ThemeClickEvent) => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    runWaveTransition(nextTheme, event);
  };

  const setTheme = (mode: ThemeMode, event?: ThemeClickEvent) => {
    if (mode !== theme) {
      runWaveTransition(mode, event);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
