import type { SkillsContent } from "@/portfolio/types";
import { Chip, ChipRow, Divider, Heading, Lead, Para, Quote, Stack } from "./primitives";

/*
 * Skills: languages with their snippet, then each group. Group lines are read
 * by shape — "Category: a, b & c" becomes a label with chips, "Term - meaning"
 * becomes a definition, anything else stays a sentence.
 */

type Line =
  | { kind: "chips"; label: string; items: string[] }
  | { kind: "definition"; term: string; text: string }
  | { kind: "text"; text: string };

function parseLine(line: string): Line {
  const chips = line.match(/^([^:]{1,40}):\s*(.+)$/);
  if (chips) return { kind: "chips", label: chips[1].trim(), items: chips[2].split(/,|\s&\s/) };
  const definition = line.match(/^(.+?)\s+-\s+(.+)$/);
  if (definition) return { kind: "definition", term: definition[1].trim(), text: definition[2].trim() };
  return { kind: "text", text: line };
}

const CodeBlock = ({ language, code }: { language: string; code: string }) => (
  <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1a19]">
    <div className="border-b border-white/[0.06] px-3.5 py-1.5 font-mono text-[0.6875rem] text-muted-foreground">
      {language || "code"}
    </div>
    <pre className="overflow-x-auto px-3.5 py-3 font-mono text-[0.8125rem] leading-relaxed text-[#d4d4d4]">
      <code>{code}</code>
    </pre>
  </div>
);

const SkillsAnswer = ({ data, animate }: { data: SkillsContent; animate: boolean }) => (
  <Stack animate={animate} gap="gap-7">
    <Lead text={data.opener} />
    <Quote text={data.quote} />

    {data.languages.length > 0 && (
      <section className="space-y-5">
        <Heading>{data.languagesHeading}</Heading>
        {data.languages.map((lang) => (
          <div key={lang.name} className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif text-[1rem] md:text-[1.0625rem] font-semibold text-foreground">{lang.name}</span>
              {lang.level && <Chip tone="accent">{lang.level}</Chip>}
            </div>
            {lang.snippet && <CodeBlock language={lang.codeLanguage} code={lang.snippet} />}
          </div>
        ))}
      </section>
    )}

    {data.groups.flatMap((group, i) => [
      ...(i > 0 || data.languages.length > 0 ? [<Divider key={`d${i}`} />] : []),
      <section key={group.heading + i} className="space-y-4">
        <Heading>{group.heading}</Heading>
        <Para text={group.intro} />
        <div className="space-y-3.5">
          {group.lines.map(parseLine).map((line, j) =>
            line.kind === "chips" ? (
              <div key={j} className="grid gap-1.5 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-4">
                <span className="pt-0.5 font-sans text-[0.8125rem] text-muted-foreground">{line.label}</span>
                <ChipRow items={line.items} />
              </div>
            ) : line.kind === "definition" ? (
              <p key={j} className="font-serif text-[1rem] md:text-[1.0625rem] leading-[1.7] text-foreground/90">
                <span className="font-semibold text-foreground">{line.term}</span> — {line.text}
              </p>
            ) : (
              <Para key={j} text={line.text} />
            ),
          )}
        </div>
      </section>,
    ])}
  </Stack>
);

export default SkillsAnswer;
