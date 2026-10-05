import type { ExperienceContent } from "@/portfolio/types";
import { Bullets, ChipRow, Gallery, Heading, Lead, Meta, Para, Quote, Stack } from "./primitives";

/* Experience as a timeline: one node per role, newest first (the template's order). */

const ExperienceAnswer = ({ data, animate }: { data: ExperienceContent; animate: boolean }) => (
  <Stack animate={animate} gap="gap-6">
    <Lead text={data.opener} />

    {(data.heading || data.intro || data.quote) && (
      <div className="space-y-3">
        {data.heading && <Heading>{data.heading}</Heading>}
        <Para text={data.intro} />
        <Quote text={data.quote} />
      </div>
    )}

    {data.entries.length > 0 && (
      <ol className="relative ml-1.5 space-y-9 border-l border-white/10">
        {data.entries.map((entry, i) => {
          const meta = [entry.period, entry.location].filter(Boolean).join(" · ");
          return (
            <li key={i} className="relative pl-6">
              {/* Timeline node */}
              <span className="absolute -left-[0.3125rem] top-[0.4375rem] h-2.5 w-2.5 rounded-full bg-orange-400 ring-4 ring-background" />
              <div className="space-y-3">
                <div>
                  <Heading>{entry.title}</Heading>
                  {(entry.organization || meta) && (
                    <Meta>
                      {entry.organization && <span className="text-foreground/80">{entry.organization}</span>}
                      {entry.organization && meta && " · "}
                      {meta}
                    </Meta>
                  )}
                  {entry.tagline && <Meta>{entry.tagline}</Meta>}
                </div>
                <Gallery images={entry.images} alt={[entry.title, entry.organization].filter(Boolean).join(" at ")} />
                <Para text={entry.summary} />
                <Bullets items={entry.bullets} />
                {entry.techStack && <ChipRow items={entry.techStack.split(",")} />}
                <Quote text={entry.quote} />
              </div>
            </li>
          );
        })}
      </ol>
    )}
  </Stack>
);

export default ExperienceAnswer;
