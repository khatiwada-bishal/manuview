import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "ManuView | Free & Open-Source AI Pre-Submission Manuscript Review",
  description: "Reviewer-calibrated pre-submission scientific manuscript diagnostics. Spot desk-rejection hazards, causal overclaims, missing controls, and retracted citations before journal submission.",
  keywords: ["pre-submission peer review", "manuscript diagnostic", "academic publishing", "journal fit", "open source manuscript review"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col liquid-glass-canvas text-[#111827] dark:text-[#F8FAFC] antialiased selection:bg-indigo-500/30 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
