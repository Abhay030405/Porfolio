import { useState, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;
const ZOOM_STEP = 0.15;

const ResumeViewer = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [baseWidth, setBaseWidth] = useState<number>(600);
  const [scale, setScale] = useState<number>(1);
  const [showZoomHint, setShowZoomHint] = useState(false);
  const [pageHeights, setPageHeights] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scaleRef = useRef<number>(1);

  const clampScale = (s: number) => Math.min(Math.max(s, MIN_SCALE), MAX_SCALE);

  const flashHint = useCallback(() => {
    setShowZoomHint(true);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setShowZoomHint(false), 1200);
  }, []);

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
  }, [flashHint]);

  const handleDocumentLoad = useCallback(
    async ({ numPages: n, ...pdf }: { numPages: number; [key: string]: unknown }) => {
      setNumPages(n);
      const heights: number[] = [];
      for (let i = 1; i <= n; i++) {
        // @ts-expect-error react-pdf passes the raw pdf.js doc
        const page = await (pdf as { getPage: (n: number) => Promise<{ getViewport: (o: { scale: number }) => { height: number; width: number } }> }).getPage(i);
        const vp = page.getViewport({ scale: 1 });
        heights.push((vp.height / vp.width) * baseWidth);
      }
      setPageHeights(heights);
    },
    [baseWidth]
  );

  const zoomBy = (delta: number) => {
    const next = clampScale(scaleRef.current + delta);
    scaleRef.current = next;
    setScale(next);
  };

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

      {/* Pinch hint */}
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
          onLoadSuccess={handleDocumentLoad}
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
          {Array.from({ length: numPages }, (_, i) => {
            const naturalHeight = pageHeights[i] ?? baseWidth * 1.414;
            return (
              <div
                key={`page_${i + 1}`}
                style={{
                  width: baseWidth * scale,
                  height: naturalHeight * scale,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
                className="shadow-lg"
              >
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    width: baseWidth,
                  }}
                >
                  <Page pageNumber={i + 1} width={baseWidth} />
                </div>
              </div>
            );
          })}
        </Document>
      </div>
    </div>
  );
};

export default ResumeViewer;
