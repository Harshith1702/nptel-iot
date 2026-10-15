import React from 'react';
import { ExternalLink, Star } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] py-8 text-xs font-mono text-zinc-500 transition-colors mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Support & Follow Callout */}
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-zinc-900 dark:text-zinc-100 font-semibold text-xs flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Helpful for your exam prep?</span>
            </div>
            <p className="text-zinc-500 text-[11px] mt-0.5">
              Star this project on GitHub and check out more work.
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <a
              href="https://github.com/Harshith1702/nptel-iot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Star on GitHub</span>
            </a>
            <a
              href="https://x.com/harshith_irl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-900 dark:hover:border-zinc-100 font-medium transition-colors"
            >
              <span>Follow @harshith_irl</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <a
              href="https://harshith-padakanti.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-900 dark:hover:border-zinc-100 font-medium transition-colors"
            >
              <span>Portfolio</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>

        {/* Bottom Attribution Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <img
              src="/avatar.jpg"
              alt="Harshith"
              className="w-4 h-4 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
            />
            <span>Made by</span>
            <a
              href="https://harshith-padakanti.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 dark:text-zinc-200 font-semibold underline hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Harshith
            </a>
            <span>•</span>
            <span className="text-zinc-400">NPTEL IoT IIT Kharagpur Archive</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://harshith-padakanti.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <span>Portfolio</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href="https://x.com/harshith_irl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <span>X (@harshith_irl)</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href="https://github.com/Harshith1702"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href="https://github.com/Harshith1702/nptel-iot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <span>Source</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
