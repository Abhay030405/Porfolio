import { ArrowRight, ArrowUpRight, FileText, FolderKanban, Trophy } from "lucide-react";
import type { PublishedProject } from "@/portfolio/types";
import { Chip, Divider, Heading, Label, Lead, Para, Stack } from "./primitives";

/*
 * Projects as an editorial list, like the rest of the answers: the CampaignX
 * case study up top, then each published project with its award, what it is,
 * and its write-ups — every one a way into the project page.
 */

interface ProjectsAnswerProps {
  projects: PublishedProject[];
  animate: boolean;
  /** Opens the CampaignX case study panel. */
  onOpenCaseStudy?: () => void;
  onOpenProject?: (name: string) => void;
}

const EXCERPT_CHARS = 220;

/** Meta is an award line ("1st Runner-Up · HACKATRON") or, without one, the stack. */
const isAward = (meta: string) => /winner|runner|place|prize|award|mention|finalist|rank/i.test(meta);

/** The project's description, or failing that the opening of its first write-up. */
function summary(project: PublishedProject): string {
  if (project.description.trim()) return project.description;
  const first = project.artifacts[0]?.content.split("\n\n")[0]?.trim() ?? "";
  return first.length > EXCERPT_CHARS ? `${first.slice(0, EXCERPT_CHARS).replace(/\s+\S*$/, "")}…` : first;
}

/** "DeskAway — Build notes" → "Build notes": the project name is already the heading. */
const artifactLabel = (projectName: string, title: string) => {
  const short = projectName.split(" — ")[0].split(" - ")[0].trim();
  return title.replace(new RegExp(`^${short.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[—-]\\s*`, "i"), "");
};

const ProjectsAnswer = ({ projects, animate, onOpenCaseStudy, onOpenProject }: ProjectsAnswerProps) => (
  <Stack animate={animate} gap="gap-7">
    <Lead text="Here's what I've been building — open any of them for the full write-up." />

    {onOpenCaseStudy && (
      <div>
        <Label>Featured case study</Label>
        <button
          type="button"
          onClick={onOpenCaseStudy}
          className="group mt-2 flex w-full items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left hover:border-orange-400/40 hover:bg-white/[0.05] transition-all"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-400/10">
            <FolderKanban className="h-5 w-5 text-orange-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-serif text-[1.0625rem] font-semibold text-foreground">CampaignX — Level 0</div>
            <div className="font-sans text-[0.8125rem] text-muted-foreground">Multi-agent system · 8 agents, one back edge</div>
          </div>
          <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>
    )}

    {projects.length > 0 && (
      <section className="space-y-6">
        <Label>All projects · {projects.length}</Label>
        {projects.flatMap((project, i) => [
          ...(i > 0 ? [<Divider key={`d${project.id}`} />] : []),
          <article key={project.id} className="space-y-3">
            <button type="button" onClick={() => onOpenProject?.(project.name)} className="group block text-left">
              <Heading>
                <span className="underline-offset-4 decoration-white/30 group-hover:underline">{project.name}</span>
              </Heading>
            </button>
            {project.meta &&
              (isAward(project.meta) ? (
                <Chip tone="accent">
                  <Trophy className="h-3 w-3 flex-shrink-0" />
                  <span className="whitespace-normal leading-snug">{project.meta}</span>
                </Chip>
              ) : (
                <Chip>{project.meta}</Chip>
              ))}
            <Para text={summary(project)} />
            <div className="flex flex-wrap items-center gap-1.5">
              {project.artifacts.map((artifact) => (
                <Chip key={artifact.title}>
                  <FileText className="h-3 w-3 flex-shrink-0" />
                  {artifactLabel(project.name, artifact.title)}
                </Chip>
              ))}
              <button
                type="button"
                onClick={() => onOpenProject?.(project.name)}
                className="ml-1 inline-flex items-center gap-1 font-sans text-[0.8125rem] text-foreground/80 hover:text-foreground transition-colors"
              >
                Open project <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>,
        ])}
      </section>
    )}
  </Stack>
);

export default ProjectsAnswer;
