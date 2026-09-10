import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white mb-6 shadow-sm">
        <FileQuestion className="w-10 h-10" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
        Page Not Found
      </h2>
      <p className="text-neutral-400 text-xs max-w-sm mb-6">
        The research tool or page you requested could not be located.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs shadow-md transition active:scale-[0.98]"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
}
