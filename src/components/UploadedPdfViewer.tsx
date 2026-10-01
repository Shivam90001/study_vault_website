import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Document as PdfDocument, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

interface UploadedPdfViewerProps {
  fileUrl: string;
  title: string;
}

const UploadedPdfViewer: React.FC<UploadedPdfViewerProps> = ({ fileUrl, title }) => {
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [pageWidth, setPageWidth] = useState(() => Math.min(960, Math.max(240, window.innerWidth - 56)));
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const updatePageWidth = () => setPageWidth(Math.min(960, Math.max(240, window.innerWidth - 56)));
    window.addEventListener('resize', updatePageWidth);
    return () => window.removeEventListener('resize', updatePageWidth);
  }, []);

  useEffect(() => {
    setPageCount(0);
    setPageNumber(1);
    setScale(1);
    setLoadError('');
  }, [fileUrl]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 p-2 sm:p-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPageNumber(page => Math.max(1, page - 1))}
            disabled={pageNumber <= 1}
            aria-label="Previous PDF page"
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-20 text-center text-xs text-slate-300" aria-live="polite">
            {pageCount ? `${pageNumber} / ${pageCount}` : 'Loading PDF'}
          </span>
          <button
            type="button"
            onClick={() => setPageNumber(page => Math.min(pageCount, page + 1))}
            disabled={!pageCount || pageNumber >= pageCount}
            aria-label="Next PDF page"
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale(value => Math.max(0.6, Math.round((value - 0.2) * 10) / 10))}
            aria-label="Zoom out"
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-white"
          >
            -
          </button>
          <span className="min-w-12 text-center text-xs text-slate-300">{Math.round(scale * 100)}%</span>
          <button
            type="button"
            onClick={() => setScale(value => Math.min(2, Math.round((value + 0.2) * 10) / 10))}
            aria-label="Zoom in"
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-white"
          >
            +
          </button>
        </div>
      </div>
      {loadError ? (
        <div className="p-6 text-center text-sm text-rose-300" role="alert">
          <p>{loadError}</p>
          <a href={fileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">
            Open or download PDF
          </a>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-auto bg-slate-700 p-2 sm:p-4">
          <PdfDocument
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setPageCount(numPages)}
            onLoadError={() => setLoadError('This PDF could not be displayed. Try opening or downloading it directly.')}
            loading={<p className="p-8 text-center text-sm text-white">Loading PDF...</p>}
            error={<p className="p-8 text-center text-sm text-rose-300">This PDF could not be displayed.</p>}
          >
            <Page
              pageNumber={pageNumber}
              width={Math.round(pageWidth * scale)}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="mx-auto w-fit shadow-xl"
            />
          </PdfDocument>
        </div>
      )}
      <div className="sr-only">{title}</div>
    </div>
  );
};

export default UploadedPdfViewer;