import { Trophy } from "lucide-react";
import type { AchievementsContent } from "@/portfolio/types";
import { Chip, Divider, Gallery, Heading, Label, Lead, Para, Stack } from "./primitives";

/* Achievements as numbered entries: title, the recognition, screenshots, then problem → solution. */

const AchievementsAnswer = ({ data, animate }: { data: AchievementsContent; animate: boolean }) => (
  <Stack animate={animate} gap="gap-7">
    <Lead text={data.opener} />

    {data.entries.flatMap((entry, i) => [
      ...(i > 0 ? [<Divider key={`d${i}`} />] : []),
      <article key={i} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2 md:grid-cols-[2.5rem_minmax(0,1fr)]">
        <span className="pt-[0.1875rem] font-mono text-[0.8125rem] text-muted-foreground">
          {String(i + 1).padStart(2, "0")}
        </span>
        <div className="space-y-3">
          <Heading>{entry.title}</Heading>
          {entry.recognition && (
            <Chip tone="accent">
              <Trophy className="h-3 w-3 flex-shrink-0" />
              <span className="whitespace-normal leading-snug">{entry.recognition}</span>
            </Chip>
          )}
          <Gallery images={entry.images} alt={entry.title} />
          {entry.problem && (
            <div>
              <Label>Problem</Label>
              <Para text={entry.problem} />
            </div>
          )}
          {entry.solution && (
            <div>
              <Label>What we built</Label>
              <Para text={entry.solution} />
            </div>
          )}
        </div>
      </article>,
    ])}
  </Stack>
);

export default AchievementsAnswer;
