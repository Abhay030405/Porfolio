import { Children, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { renderInline } from "@/portfolio/inline";

/*
 * The typographic building blocks every tool answer is made of: a serif
 * reading column, quiet sans-serif metadata, small rounded chips. Keeping them
 * here keeps all six answers visually one family.
 */

/* ── Text ── */

/** Body copy. Newlines inside a field read as one flowing paragraph. */
export const Para = ({ text, className = "" }: { text: string; className?: string }) =>
  text.trim() ? (
    <p className={`font-serif text-[1rem] md:text-[1.0625rem] leading-[1.75] text-foreground/90 ${className}`}>
      {renderInline(text.replace(/\s*\n\s*/g, " "))}
    </p>
  ) : null;

/** The opening line of an answer — slightly brighter than the body. */
export const Lead = ({ text }: { text: string }) => <Para text={text} className="!text-foreground" />;

export const Heading = ({ children }: { children: ReactNode }) => (
  <h3 className="font-serif text-[1.0625rem] md:text-[1.125rem] font-semibold leading-snug text-foreground">{children}</h3>
);

/** Small uppercase label above a block, e.g. "Problem". */
export const Label = ({ children }: { children: ReactNode }) => (
  <div className="mb-1 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
    {children}
  </div>
);

/** Muted sans-serif line: dates, places, organisations. */
export const Meta = ({ children }: { children: ReactNode }) => (
  <p className="font-sans text-[0.8125rem] leading-relaxed text-muted-foreground">{children}</p>
);

export const Quote = ({ text }: { text: string }) =>
  text.trim() ? (
    <blockquote className="border-l-2 border-orange-400/50 pl-4 font-serif text-[1rem] md:text-[1.0625rem] italic leading-[1.7] text-foreground/75">
      {renderInline(text)}
    </blockquote>
  ) : null;

export const Bullets = ({ items }: { items: string[] }) =>
  items.length ? (
    <ul className="space-y-2 pl-5">
      {items.map((item, i) => (
        <li
          key={i}
          className="list-disc pl-1 font-serif text-[1rem] md:text-[1.0625rem] leading-[1.7] text-foreground/90 marker:text-muted-foreground"
        >
          {renderInline(item)}
        </li>
      ))}
    </ul>
  ) : null;

/* ── Chips ── */

export const Chip = ({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "accent" }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[0.1875rem] font-sans text-[0.75rem] leading-none ${
      tone === "accent"
        ? "border-orange-400/25 bg-orange-400/10 text-orange-200"
        : "border-white/10 bg-white/[0.04] text-muted-foreground"
    }`}
  >
    {children}
  </span>
);

export const ChipRow = ({ items }: { items: string[] }) => {
  const clean = items.map((i) => i.trim()).filter(Boolean);
  return clean.length ? (
    <div className="flex flex-wrap gap-1.5">
      {clean.map((item) => (
        <Chip key={item}>{item}</Chip>
      ))}
    </div>
  ) : null;
};

/* ── Images ── */

/** Screenshots, two to a row; click one to see it full size. */
export const Gallery = ({ images, alt }: { images: string[]; alt: string }) => {
  const [open, setOpen] = useState<string | null>(null);
  if (!images.length) return null;
  return (
    <>
      <div className={`grid gap-2 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
        {images.map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(src)}
            className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-[min(64rem,94vw)] border-white/10 bg-background p-2">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          {open && <img src={open} alt={alt} className="max-h-[82vh] w-full rounded-lg object-contain" />}
        </DialogContent>
      </Dialog>
    </>
  );
};

/* ── Layout ── */

/**
 * Stacks an answer's blocks with even spacing. When `animate` is set (a fresh
 * answer), the blocks fade in one after another — the component-era stand-in
 * for streaming text.
 */
export const Stack = ({ animate, gap = "gap-5", children }: { animate: boolean; gap?: string; children: ReactNode }) => (
  <div className={`flex flex-col ${gap}`}>
    {Children.toArray(children)
      .filter(Boolean)
      .map((child, i) => (
        <div
          key={i}
          className={animate ? "animate-fade-in [animation-fill-mode:both] motion-reduce:animate-none" : undefined}
          style={animate ? { animationDelay: `${Math.min(i, 12) * 70}ms` } : undefined}
        >
          {child}
        </div>
      ))}
  </div>
);

/** A hairline between major parts of an answer. */
export const Divider = () => <hr className="border-white/[0.07]" />;
