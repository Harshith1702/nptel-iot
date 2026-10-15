import React from 'react';
import { X, FileText, ExternalLink, Download, Folder } from 'lucide-react';

interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PDF_DOCUMENTS = [
  {
    category: "2026 Current Course Session (noc26_cs161)",
    files: [
      { name: "Week 1 Assignment & Solutions", file: "/assignments/NPTEL-Assignment_W1.pdf" },
      { name: "Week 2 Assignment & Solutions", file: "/assignments/NPTEL_Week_2.pdf" },
      { name: "Week 3 Assignment & Solutions", file: "/assignments/Assignment 3 Solution.pdf" },
      { name: "Week 4 Assignment & Solutions", file: "/assignments/Week_4.pdf" },
      { name: "Week 5 Assignment & Solutions", file: "/assignments/Week_5_Assignment.pdf" },
      { name: "Week 6 Assignment & Solutions", file: "/assignments/Assignment_6.pdf" },
      { name: "Week 7 Assignment & Solutions", file: "/assignments/Assignment_7.pdf" },
      { name: "Week 8 Assignment & Solutions", file: "/assignments/Assignment_8.pdf" },
      { name: "Week 9 Assignment & Solutions", file: "/assignments/Assignment_9.pdf" },
      { name: "Week 10 Assignment & Solutions", file: "/assignments/Assignment_10.pdf" },
      { name: "Week 11 Assignment & Solutions", file: "/assignments/Assignment_11.pdf" },
      { name: "Week 12 Assignment & Solutions", file: "/assignments/Assignment_12.pdf" },
    ]
  },
  {
    category: "Full Term Archive Compilations (Weeks 0 to 12)",
    files: [
      { name: "Jan-Apr 2024 Full Assignment Set (92 pages)", file: "/assignments/JAN-APR 2024 IOT ASSIGNMENTS.pdf" },
      { name: "July-Dec 2023 Full Assignment Set (92 pages)", file: "/assignments/JULY-DEC 2023 IOT ASSIGNMENTS.pdf" },
      { name: "Jan-Apr 2023 Full Assignment Set (82 pages)", file: "/assignments/JAN-APR 2023 IOT ASSIGNMENTS.pdf" },
      { name: "July-Dec 2022 Full Assignment Set (77 pages)", file: "/assignments/JULY-DEC 2022 IOT ASSIGNMENTS.pdf" },
    ]
  }
];

export const SourceModal: React.FC<SourceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-2xl font-sans max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
              Official Course Documents & PDFs
            </h3>
            <p className="text-[11px] font-mono text-zinc-500">
              IIT Kharagpur NPTEL Course Archive
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Official Links */}
        <div className="py-3 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-2 text-xs font-mono">
          <a
            href="https://drive.google.com/drive/folders/13X6YMeMYzIBQEfmhO9cAE_iBM75SXa3Z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Folder className="w-3.5 h-3.5 text-amber-500" />
            <span>Course Lecture Slides Archive</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <a
            href="https://onlinecourses.nptel.ac.in/noc26_cs161/preview"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <span>NPTEL Official Course Page</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>

        {/* PDF List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {PDF_DOCUMENTS.map((section, sIdx) => (
            <div key={sIdx}>
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                {section.category}
              </div>
              <div className="space-y-1.5">
                {section.files.map((item, fIdx) => (
                  <div
                    key={fIdx}
                    className="flex items-center justify-between p-2 rounded border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 truncate mr-2">
                      <FileText className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="text-zinc-800 dark:text-zinc-200 truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={item.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={item.file}
                        download
                        className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 text-center font-mono">
          All assignment documents are preserved verbatim as published on the NPTEL portal.
        </div>
      </div>
    </div>
  );
};
