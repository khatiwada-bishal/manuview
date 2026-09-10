/**
 * Desktop integration helpers for ManuView
 * Enables seamless capability detection between Web and Tauri Desktop app.
 */

export function isDesktopApp(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    // @ts-expect-error - Tauri injected globals
    window.__TAURI_INTERNALS__ || window.__TAURI__
  );
}

/**
 * Open a native OS file dialog for selecting a manuscript (.pdf, .docx).
 * Returns null if cancelled or in web browser mode.
 */
export async function pickManuscriptFileDesktop(): Promise<{
  name: string;
  bytes: Uint8Array;
} | null> {
  if (!isDesktopApp()) return null;

  try {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const { readFile } = await import("@tauri-apps/plugin-fs");

    const selected = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: "Manuscript Documents",
          extensions: ["pdf", "docx", "txt", "md"],
        },
      ],
    });

    if (!selected || typeof selected !== "string") return null;

    const bytes = await readFile(selected);
    const fileName = selected.split(/[\\/]/).pop() || "manuscript";

    return {
      name: fileName,
      bytes,
    };
  } catch (err) {
    console.warn("Native file picker failed, fallback to standard input:", err);
    return null;
  }
}

/**
 * Opens an external URL in the user's default browser (instead of navigating the desktop window).
 */
export async function openExternalLink(url: string): Promise<void> {
  if (isDesktopApp()) {
    try {
      const { open } = await import("@tauri-apps/plugin-shell");
      await open(url);
      return;
    } catch (err) {
      console.warn("Tauri shell open failed, falling back to window.open", err);
    }
  }

  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
