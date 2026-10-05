import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ChevronRight, Plus, Trash2 } from "lucide-react";
import { emptyValue, type Field } from "./templates";

/* Renders the form for a template (see templates.ts) and edits its value immutably. */

type Value = Record<string, unknown>;

const INPUT_CLASS =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.9375rem] text-foreground placeholder:text-muted-foreground outline-none focus:border-white/25 transition-colors";

interface TemplateFormProps {
  fields: Field[];
  value: Value;
  onChange: (value: Value) => void;
}

const TemplateForm = ({ fields, value, onChange }: TemplateFormProps) => (
  <div className="space-y-4">
    {fields.map((field) => (
      <FieldEditor
        key={field.key}
        field={field}
        value={value[field.key]}
        onChange={(v) => onChange({ ...value, [field.key]: v })}
      />
    ))}
  </div>
);

const Label = ({ field }: { field: Field }) => (
  <div className="mb-1.5 flex items-baseline justify-between gap-3">
    <span className="text-[0.8125rem] font-medium text-foreground">{field.label}</span>
    {"hint" in field && field.hint && <span className="truncate text-xs text-muted-foreground">{field.hint}</span>}
  </div>
);

const FieldEditor = ({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) => {
  switch (field.type) {
    case "text":
      return (
        <label className="block">
          <Label field={field} />
          <input
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={`${INPUT_CLASS} ${field.mono ? "font-mono text-sm" : ""}`}
          />
        </label>
      );
    case "textarea":
      return (
        <label className="block">
          <Label field={field} />
          <textarea
            value={(value as string) ?? ""}
            rows={field.rows ?? 3}
            onChange={(e) => onChange(e.target.value)}
            className={`${INPUT_CLASS} resize-y leading-relaxed ${field.mono ? "font-mono text-sm" : ""}`}
          />
        </label>
      );
    case "lines":
      return <LinesEditor field={field} value={(value as string[]) ?? []} onChange={onChange} />;
    case "number":
      return (
        <label className="block">
          <Label field={field} />
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={field.min}
              max={field.max}
              step={0.1}
              value={Number(value ?? 0)}
              onChange={(e) => onChange(Number(e.target.value))}
              className="flex-1 accent-orange-600"
            />
            <input
              type="number"
              min={field.min}
              max={field.max}
              value={Number(value ?? 0)}
              onChange={(e) => onChange(Math.min(field.max, Math.max(field.min, Number(e.target.value))))}
              className={`${INPUT_CLASS} w-20`}
            />
          </div>
        </label>
      );
    case "object":
      return (
        <fieldset className="rounded-xl border border-white/10 p-4">
          <legend className="px-1.5 text-[0.875rem] font-semibold text-foreground">{field.label}</legend>
          <TemplateForm fields={field.fields} value={(value as Value) ?? {}} onChange={onChange} />
        </fieldset>
      );
    case "list":
      return <ListEditor field={field} value={(value as Value[]) ?? []} onChange={onChange} />;
  }
};

/*
 * One item per line. The textarea keeps its own text so blank lines survive
 * while typing; only non-blank lines are reported upward.
 */
const LinesEditor = ({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { type: "lines" }>;
  value: string[];
  onChange: (v: string[]) => void;
}) => {
  const [text, setText] = useState(value.join("\n"));
  const clean = (t: string) => t.split("\n").map((l) => l.trim()).filter(Boolean);

  // Follow outside changes (a new AI draft, a reset) without fighting the user's typing
  useEffect(() => {
    if (clean(text).join("\n") !== value.join("\n")) setText(value.join("\n"));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to the value from outside
  }, [value]);

  return (
    <label className="block">
      <Label field={field} />
      <textarea
        value={text}
        rows={field.rows ?? 4}
        onChange={(e) => {
          setText(e.target.value);
          onChange(clean(e.target.value));
        }}
        className={`${INPUT_CLASS} resize-y leading-relaxed ${field.mono ? "font-mono text-sm" : ""}`}
      />
    </label>
  );
};

const ListEditor = ({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { type: "list" }>;
  value: Value[];
  onChange: (v: Value[]) => void;
}) => {
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const move = (i: number, delta: number) => {
    const j = i + delta;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(new Set());
  };

  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[0.875rem] font-semibold text-foreground">
          {field.label} <span className="font-normal text-muted-foreground">· {value.length}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            onChange([...value, emptyValue(field.fields)]);
            setOpen((prev) => new Set(prev).add(value.length));
          }}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Plus className="h-4 w-4" /> Add {field.itemLabel.toLowerCase()}
        </button>
      </div>

      <div className="space-y-2">
        {value.map((item, i) => {
          const isOpen = open.has(i);
          const title =
            [field.titleKey]
              .flat()
              .map((key) => String(item[key] ?? "").trim())
              .filter(Boolean)
              .join(" · ") || `${field.itemLabel} ${i + 1}`;
          return (
            <div key={i} className="rounded-lg border border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-1 pl-2 pr-1">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex min-w-0 flex-1 items-center gap-2 py-2 text-left text-sm text-foreground"
                >
                  <ChevronRight className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  <span className="truncate">{title}</span>
                </button>
                <button type="button" title="Move up" onClick={() => move(i, -1)} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button type="button" title="Move down" onClick={() => move(i, 1)} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Remove"
                  onClick={() => {
                    onChange(value.filter((_, j) => j !== i));
                    setOpen(new Set());
                  }}
                  className="rounded p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {isOpen && (
                <div className="border-t border-white/[0.06] p-3">
                  <TemplateForm
                    fields={field.fields}
                    value={item}
                    onChange={(v) => onChange(value.map((old, j) => (j === i ? v : old)))}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateForm;
