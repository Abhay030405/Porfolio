import { Fragment, type ReactNode } from "react";

/*
 * Inline formatting for template text fields: **bold** and *emphasis*.
 * Renders React nodes, never HTML, so content can't inject markup.
 */
export function renderInline(text: string, tags: { bold?: "b" | "strong"; em?: "em" | "i" } = {}): ReactNode[] {
  const Bold = tags.bold ?? "strong";
  const Em = tags.em ?? "em";
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <Bold key={i}>{part.slice(2, -2)}</Bold>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <Em key={i}>{part.slice(1, -1)}</Em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}
