import { useState } from "react";
import { ChevronRight } from "lucide-react";

/*
 * The quiet line above an answer saying which tool ran — the portfolio's
 * version of "Searched the web, read a page ›". Clicking it shows how the
 * tool was chosen.
 */

export interface Trace {
  routedBy: "direct" | "jev" | "keywords";
  confidence: number | null;
}

interface ToolTraceProps extends Trace {
  tool: string;
  /** What the tool read, e.g. "read 3 entries". */
  summary: string;
}

const chosenBy = ({ routedBy, confidence }: Trace) => {
  if (routedBy === "jev") return confidence === null ? "Jev" : `Jev · ${Math.round(confidence * 100)}% confident`;
  if (routedBy === "direct") return "You, from the menu";
  return "Keyword match";
};

const ToolTrace = ({ tool, summary, routedBy, confidence }: ToolTraceProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-5 font-sans">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-[0.875rem] text-muted-foreground hover:text-foreground transition-colors"
      >
        Used the {tool} tool, {summary}
        <ChevronRight className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <dl className="mt-2 grid max-w-sm grid-cols-[6.5rem_1fr] gap-y-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-3 text-[0.8125rem] animate-fade-in">
          <dt className="text-muted-foreground">Tool</dt>
          <dd className="font-mono text-foreground">{tool}</dd>
          <dt className="text-muted-foreground">Chosen by</dt>
          <dd className="text-foreground">{chosenBy({ routedBy, confidence })}</dd>
          <dt className="text-muted-foreground">Source</dt>
          <dd className="text-foreground">Portfolio database</dd>
        </dl>
      )}
    </div>
  );
};

export default ToolTrace;
