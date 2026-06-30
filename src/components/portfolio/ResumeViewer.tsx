import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const MIN_SCALE = .5;
const MAX_SCALE = 3.0;
const ZOOM_STEP = 0.15;

const ResumeViewer = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [baseWidth, setBaseWidth] = useState<number>(600);
  const [scale, setScale] = useState<number>(1);
  const [showZoomHint, setShowZoomHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scaleRef = useRef<number>(1);

  const clampScale = (s: number) => Math.min(Math.max(s, MIN_SCALE), MAX_SCALE);

  const flashHint = () => {
    setShowZoomHint(true);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setShowZoomHint(false), 1200);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setBaseWidth(Math.min(entry.contentRect.width - 32, 700));
      }
    });
    resizeObserver.observe(el);

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      scaleRef.current = clampScale(scaleRef.current + (-e.deltaY * 0.003));
      setScale(scaleRef.current);
      flashHint();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const zoomBy = (delta: number) => {
    const next = clampScale(scaleRef.current + delta);
    scaleRef.current = next;
    setScale(next);
  };

  const pageWidth = Math.round(baseWidth * scale);

  return (
    <div className="relative flex flex-col h-full">
      {/* Zoom controls */}
      <div className="flex items-center justify-center gap-2 py-2 bg-[#1F1F1E] border-b border-white/10 flex-shrink-0">
        <button
          onClick={() => zoomBy(-ZOOM_STEP)}
          className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs text-muted-foreground w-12 text-center tabular-nums">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => zoomBy(ZOOM_STEP)}
          className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => { scaleRef.current = 1; setScale(1); }}
          className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          title="Reset zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Zoom hint toast */}
      <div
        className={`absolute top-12 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs whitespace-nowrap transition-opacity duration-300 pointer-events-none ${
          showZoomHint ? "opacity-100" : "opacity-0"
        }`}
      >
        {Math.round(scale * 100)}%
      </div>

      {/* PDF scroll area */}
      <div
        ref={containerRef}
        className="overflow-auto flex-1 flex flex-col items-center py-4 gap-4 bg-[#1F1F1E]"
      >
        <Document
          file="/resume_abhay.pdf"
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="flex items-center justify-center mt-20 text-muted-foreground text-sm">
              Loading resume...
            </div>
          }
          error={
            <div className="flex items-center justify-center mt-20 text-muted-foreground text-sm">
              Failed to load resume.
            </div>
          }
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={`page_${i + 1}`}
              pageNumber={i + 1}
              width={pageWidth}
              className="shadow-lg mb-4"
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default ResumeViewer;
