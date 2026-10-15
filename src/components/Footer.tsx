import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] py-8 text-xs font-mono text-zinc-500 transition-colors mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Creator Info */}
        <div className="flex flex-wrap items-center gap-1.5 text-center sm:text-left">
          <span>Made by</span>
          <a
            href="https://x.com/harshith_irl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-900 dark:text-zinc-200 font-semibold underline hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            Harshith
          </a>
          <span>•</span>
          <span className="text-zinc-400">NPTEL IoT IIT Kharagpur</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
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
    </footer>
  );
};
