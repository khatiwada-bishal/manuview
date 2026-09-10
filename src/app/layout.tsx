import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-[#111111] antialiased selection:bg-[#0075eb]/15 selection:text-[#0075eb]">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
