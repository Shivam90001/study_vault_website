import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Share2, 
  Maximize2, 
  Minimize2, 
  FileText, 
  CheckCircle, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon,
  ShieldCheck,
  Lock,
  FileCheck
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const DocumentViewer: React.FC = () => {
  const { 
    selectedDocument, 
    closeDocument, 
    isBookmarked, 
    toggleBookmark, 
    documents,
    openDocument
  } = useVault();

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [readingTheme, setReadingTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [fontSize, setFontSize] = useState<number>(15);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!selectedDocument) return null;

  const doc = selectedDocument;
  const isSaved = isBookmarked(doc.id);
  const uploadedFileUrl = doc.fileUrl || doc.fileDataUrl;
  const isUploadedImage = Boolean(uploadedFileUrl && (doc.fileMimeType?.startsWith('image/')
    ? doc.fileMimeType !== 'image/svg+xml'
    : doc.fileFormat === 'jpg' || doc.fileFormat === 'jpeg' || doc.fileFormat === 'png'));
  const isUploadedPdf = Boolean(doc.fileUrl && (doc.fileMimeType === 'application/pdf' || doc.fileFormat === 'pdf'));
  const pages = doc.previewPages && doc.previewPages.length > 0 ? doc.previewPages : [
    {
      pageNumber: 1,
      title: `${doc.title} - Academic Resource Overview`,
      content: [
        doc.summary,
        ...(doc.keyTopics ? doc.keyTopics.map(t => `Key Topic: ${t}`) : [])
      ],
      diagramNote: 'Protected academic notes formatted for in-browser student revision.'
    }
  ];

  const currentPage = pages[activePageIndex] || pages[0];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const relatedDocs = documents
    .filter(d => d.subjectId === doc.subjectId && d.id !== doc.id)
    .slice(0, 3);

  const themeStyles = {
    dark: 'bg-slate-900 text-slate-100 border-slate-800',
    sepia: 'bg-[#fbf0d9] text-[#2c2416] border-[#e4d4b3]',
    light: 'bg-white text-slate-900 border-slate-200'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-5xl rounded-3xl border border-slate-800 bg-slate-950 flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'h-full max-w-full rounded-none' : 'max-h-[92vh]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              {doc.type === 'photo' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </span>
            <div className="truncate">
              <h2 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                {doc.title}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="uppercase text-indigo-400 font-semibold">{doc.type}</span>
                <span>•</span>
                <span className="uppercase font-mono text-[10px] text-emerald-400 font-bold">{doc.fileFormat}</span>
                <span>•</span>
                <span>{doc.pagesCount} Pages</span>
                <span>•</span>
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" /> View Only (Protected)
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {doc.type !== 'photo' && (
              <>
                <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
                  <button
                    onClick={() => setReadingTheme('dark')}
                    className={`px-2 py-1 rounded cursor-pointer ${readingTheme === 'dark' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setReadingTheme('sepia')}
                    className={`px-2 py-1 rounded cursor-pointer ${readingTheme === 'sepia' ? 'bg-[#e4d4b3] text-[#2c2416] font-semibold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Sepia
                  </button>
                  <button
                    onClick={() => setReadingTheme('light')}
                    className={`px-2 py-1 rounded cursor-pointer ${readingTheme === 'light' ? 'bg-white text-slate-900 font-semibold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Light
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
                  <button 
                    onClick={() => setFontSize(prev => Math.max(12, prev - 1))}
                    className="hover:text-white cursor-pointer px-1"
                  >
                    A-
                  </button>
                  <span className="text-[10px] text-slate-400">{fontSize}px</span>
                  <button 
                    onClick={() => setFontSize(prev => Math.min(22, prev + 1))}
                    className="hover:text-white cursor-pointer px-1"
                  >
                    A+
                  </button>
                </div>
              </>
            )}

            <button
              onClick={() => toggleBookmark(doc.id)}
              className={`p-2 rounded-lg cursor-pointer transition-colors border ${
                isSaved 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={isSaved ? "Remove bookmark" : "Save resource"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer hidden md:block"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={closeDocument}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 cursor-pointer transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copySuccess && (
          <div className="bg-indigo-950/80 border-b border-indigo-500/30 text-indigo-300 px-4 py-1.5 text-xs text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Link copied to clipboard!</span>
          </div>
        )}

        {/* Content Body - Read Only Protection */}
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Metadata details strip */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-sm">
                {doc.author.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white">{doc.author}</span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded-full">
                    <CheckCircle className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">{doc.authorCollege || 'University Contributor'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-semibold text-white">Owner-Published File</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{doc.uploadDate}</span>
              </div>
            </div>
          </div>

          {/* If Custom Uploaded File / Image */}
          {doc.fileUrl && isUploadedImage ? (
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-4 text-center">
              <img 
                src={doc.fileUrl}
                alt={doc.title} 
                className="max-h-[65vh] w-auto mx-auto rounded-xl object-contain shadow-2xl pointer-events-none"
              />
              <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-2xl mx-auto">
                {doc.summary}
              </p>
            </div>
          ) : doc.fileUrl && isUploadedPdf ? (
            <iframe
              src={doc.fileUrl}
              title={doc.title}
              className="h-[70vh] min-h-96 w-full rounded-2xl border border-slate-800 bg-white"
            />
          ) : doc.fileUrl ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center">
              <FileText className="mx-auto mb-3 h-8 w-8 text-indigo-400" />
              <p className="mb-4 text-sm font-semibold text-white">{doc.fileName || doc.title}</p>
              <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                Open file
              </a>
              <p className="mt-4 text-xs text-slate-400">This file type may open or download depending on your device.</p>
            </div>
          ) : (doc.type === 'photo' || doc.fileFormat === 'jpg' || doc.fileFormat === 'png') && (doc.imageUrl || doc.fileDataUrl) ? (
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-4 text-center">
              <img
                src={doc.fileDataUrl || doc.imageUrl}
                alt={doc.title}
                className="max-h-[65vh] w-auto mx-auto rounded-xl object-contain shadow-2xl pointer-events-none"
              />
              <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-2xl mx-auto">{doc.summary}</p>
            </div>
          ) : (
            /* Document Preview Canvas */
            <div className={`rounded-2xl border p-6 sm:p-8 transition-colors ${themeStyles[readingTheme]}`}>
              <div className="flex items-center justify-between border-b pb-4 mb-6 opacity-80">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Page {activePageIndex + 1} of {pages.length}</span>
                </div>
                <span className="text-[11px] bg-indigo-500/20 px-2 py-0.5 rounded font-bold uppercase text-indigo-400">
                  {doc.fileFormat.toUpperCase()} Format
                </span>
              </div>

              <h3 className="text-xl font-bold mb-4 tracking-tight" style={{ fontSize: `${fontSize + 5}px` }}>
                {currentPage.title}
              </h3>

              <div className="space-y-4 leading-relaxed font-sans" style={{ fontSize: `${fontSize}px` }}>
                {currentPage.content.map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {currentPage.formula && (
                <div className="my-6 p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 font-mono text-sm text-indigo-300">
                  <span className="text-xs text-indigo-400 font-bold block mb-1 uppercase tracking-wide">
                    Exam Formula / Key Result:
                  </span>
                  <span className="text-white font-semibold">{currentPage.formula}</span>
                </div>
              )}

              {currentPage.diagramNote && (
                <div className="mt-6 p-3 rounded-lg border border-dashed border-slate-700 bg-slate-900/30 text-xs text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{currentPage.diagramNote}</span>
                </div>
              )}

              {pages.length > 1 && (
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <button
                    disabled={activePageIndex === 0}
                    onClick={() => setActivePageIndex(prev => prev - 1)}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-800"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous Page
                  </button>
                  <span className="text-xs text-slate-400">
                    Page {activePageIndex + 1} of {pages.length}
                  </span>
                  <button
                    disabled={activePageIndex === pages.length - 1}
                    onClick={() => setActivePageIndex(prev => prev + 1)}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-800"
                  >
                    Next Page <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* File access note */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-amber-400">
              <Lock className="w-4 h-4 shrink-0" />
              <span>
                <strong>Shared file:</strong> PDF and image files display here; other formats open according to your browser.
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 uppercase shrink-0">
              Verified Study Material
            </span>
          </div>

          {/* Related documents */}
          {relatedDocs.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                More Materials in this Subject
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedDocs.map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => {
                      openDocument(rel);
                      setActivePageIndex(0);
                    }}
                    className="text-left p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group"
                  >
                    <div className="text-[10px] font-semibold text-indigo-400 uppercase mb-1">
                      {rel.type} • {rel.fileFormat.toUpperCase()}
                    </div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300 line-clamp-2">
                      {rel.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-2">
                      {rel.pagesCount} pages • Read Only
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
