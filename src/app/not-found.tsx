import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 mb-6">
        <FileQuestion className="w-10 h-10" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
        Page Not Found
      </h2>
      <p className="text-slate-400 text-xs max-w-sm mb-6">
        The research tool or page you requested could not be located.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
}
