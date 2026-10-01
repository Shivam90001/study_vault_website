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

interface PdfRenderBoundaryProps {
  children: React.ReactNode;
  onRetry: () => void;
}

class PdfRenderBoundary extends React.Component<PdfRenderBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center text-sm text-rose-300" role="alert">
          <p>This PDF could not be displayed in the viewer. Retry loading it.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={this.props.onRetry} className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">
              Retry PDF
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const UploadedPdfViewer: React.FC<UploadedPdfViewerProps> = ({ fileUrl, title }) => {
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [pageWidth, setPageWidth] = useState(() => Math.min(960, Math.max(240, window.innerWidth - 56)));
  const [loadError, setLoadError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [hasDocumentLoaded, setHasDocumentLoaded] = useState(false);
  const [hasPageRendered, setHasPageRendered] = useState(false);

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
    setHasDocumentLoaded(false);
    setHasPageRendered(false);
  }, [fileUrl, loadAttempt]);

  useEffect(() => {
    if (hasPageRendered) return;

    const timeout = window.setTimeout(() => {
      setLoadError('PDF is taking too long to display. Retry it in the viewer.');
    }, 60000);
    return () => window.clearTimeout(timeout);
  }, [fileUrl, loadAttempt, hasPageRendered]);

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
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setLoadAttempt(attempt => attempt + 1)}
              className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white"
            >
              Retry PDF
            </button>
          </div>
        </div>
      ) : (
        <div
          className="max-h-[70vh] overflow-auto bg-slate-700 p-2 sm:p-4"
          onContextMenu={event => event.preventDefault()}
          onDragStart={event => event.preventDefault()}
        >
          <PdfRenderBoundary
            key={`${fileUrl}:${loadAttempt}`}
            onRetry={() => setLoadAttempt(attempt => attempt + 1)}
          >
            <PdfDocument
              file={fileUrl}
              onSourceError={() => setLoadError('The PDF file could not be reached. Check the connection and retry.')}
              onLoadSuccess={({ numPages }) => {
                setPageCount(numPages);
                setHasDocumentLoaded(true);
              }}
              onLoadError={() => setLoadError('The PDF file could not be read. Retry it in the viewer.')}
              loading={<p className="p-8 text-center text-sm text-white">{hasDocumentLoaded ? 'Rendering PDF page...' : 'Loading PDF...'}</p>}
              error={<p className="p-8 text-center text-sm text-rose-300">The PDF file could not be read.</p>}
            >
              <Page
                pageNumber={pageNumber}
                width={Math.round(pageWidth * scale)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="mx-auto w-fit shadow-xl"
                onRenderError={() => setLoadError('This PDF page could not be rendered. Retry it in the viewer.')}
                onRenderSuccess={() => {
                  setHasPageRendered(true);
                  setLoadError('');
                }}
              />
            </PdfDocument>
          </PdfRenderBoundary>
        </div>
      )}
      <div className="sr-only">{title}</div>
    </div>
  );
};

export default UploadedPdfViewer;