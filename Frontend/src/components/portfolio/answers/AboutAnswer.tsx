import { ArrowUpRight } from "lucide-react";
import type { AboutContent } from "@/portfolio/types";
import { renderInline } from "@/portfolio/inline";
import { Bullets, Divider, Heading, Label, Para, Stack } from "./primitives";

/*
 * About, in the same family as every other answer: serif reading column,
 * the depth chart as plain HTML bars (legible at any width), evidence as
 * three cards, then how I work and what I haven't done.
 */

/** Bars below this level read as "honestly thin" and render muted. */
const LOW_LEVEL = 30;

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/** "Heading · SMALL CAPS TICK" — every About block opens with one. */
const BlockHeading = ({ title, tick }: { title: string; tick: string }) => (
  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
    <Heading>{title}</Heading>
    {tick && <span className="font-sans text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">{tick}</span>}
  </div>
);

const DepthChart = ({ depth }: { depth: AboutContent["depth"] }) => (
  <section className="space-y-4">
    <BlockHeading title={depth.title} tick={depth.tick} />

    <div className="space-y-3.5">
      {/* Scale markers, aligned with the bar track (which starts after the label column on wide screens) */}
      {depth.scale.length > 0 && (
        <div className="hidden sm:grid sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
          <span />
          <div className="relative h-4">
            {depth.scale.map(({ label, level }) => (
              <span
                key={label}
                className="absolute -translate-x-1/2 whitespace-nowrap font-sans text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground"
                style={{ left: `${clamp(level)}%` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {depth.rows.map((row) => {
        const low = row.level < LOW_LEVEL;
        return (
          <div key={row.label} className="grid gap-1.5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-4">
            <span className="font-sans text-[0.8125rem] text-foreground/90">{row.label}</span>
            <div className="space-y-1">
              <div className="relative h-1.5 rounded-full bg-white/[0.07]">
                {/* Scale marker ticks through the track */}
                {depth.scale.map(({ label, level }) => (
                  <span key={label} className="absolute top-[-0.1875rem] h-3 w-px bg-white/10" style={{ left: `${clamp(level)}%` }} />
                ))}
                <div
                  className={`absolute inset-y-0 left-0 rounded-full ${low ? "bg-white/25" : "bg-orange-400"}`}
                  style={{ width: `${clamp(row.level)}%` }}
                />
              </div>
              {row.note && <p className="font-sans text-[0.75rem] leading-snug text-muted-foreground">{row.note}</p>}
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

const AboutAnswer = ({ data, animate }: { data: AboutContent; animate: boolean }) => (
  <Stack animate={animate} gap="gap-8">
    {/* Hero */}
    <header className="space-y-4">
      {data.eyebrow && <Label>{data.eyebrow}</Label>}
      <h2 className="font-serif text-[1.5rem] md:text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground">
        {data.headline}
        {data.subheadline && <span className="block text-foreground/55">{data.subheadline}</span>}
      </h2>
      <div className="space-y-3">
        {data.lede.map((paragraph, i) => (
          <Para key={i} text={paragraph} />
        ))}
      </div>
      {data.links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {data.links.map(({ label, url }) => (
            <a
              key={url + label}
              href={url}
              {...(url.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-sans text-[0.8125rem] text-muted-foreground hover:border-white/25 hover:text-foreground transition-colors"
            >
              {label.replace(/\s*→\s*$/, "")}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      )}
    </header>

    {data.depth.rows.length > 0 && <DepthChart depth={data.depth} />}

    {/* Evidence */}
    {data.evidence.cards.length > 0 && (
      <section className="space-y-4">
        <BlockHeading title={data.evidence.title} tick={data.evidence.tick} />
        <div className="grid gap-3 md:grid-cols-3">
          {data.evidence.cards.map((card, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <Label>{card.kicker}</Label>
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-serif text-[1.625rem] font-semibold leading-none text-foreground">{card.figure}</span>
                {card.unit && <span className="font-sans text-[0.8125rem] text-muted-foreground">{card.unit}</span>}
              </div>
              <p className="font-serif text-[0.9375rem] leading-relaxed text-foreground/80">{renderInline(card.body)}</p>
              {card.source && (
                <p className="mt-auto border-t border-white/[0.06] pt-2 font-sans text-[0.75rem] text-muted-foreground">{card.source}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* How I work */}
    {data.approach.points.length > 0 && (
      <section className="space-y-4">
        <BlockHeading title={data.approach.title} tick={data.approach.tick} />
        <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
          {data.approach.points.map(({ lead, text }, i) => (
            <p key={i} className="font-serif text-[1rem] md:text-[1.0625rem] leading-[1.7] text-foreground/90">
              <span className="font-semibold text-foreground">{lead}</span> {renderInline(text)}
            </p>
          ))}
        </div>
      </section>
    )}

    {/* What I haven't done */}
    {data.limits.points.length > 0 && (
      <>
        <Divider />
        <section className="space-y-4">
          <BlockHeading title={data.limits.title} tick={data.limits.tick} />
          <Bullets items={data.limits.points.map(({ lead, text }) => `**${lead}** ${text}`)} />
        </section>
      </>
    )}
  </Stack>
);

export default AboutAnswer;
