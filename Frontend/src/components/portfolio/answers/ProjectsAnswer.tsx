import { ArrowUpRight, FolderKanban } from "lucide-react";
import type { PublishedProject } from "@/portfolio/types";
import { Chip, Label, Lead, Stack } from "./primitives";

/* Projects: the CampaignX case study up top, then every published project as a card. */

interface ProjectsAnswerProps {
  projects: PublishedProject[];
  animate: boolean;
  /** Opens the CampaignX case study panel. */
  onOpenCaseStudy?: () => void;
  onOpenProject?: (name: string) => void;
}

const ProjectsAnswer = ({ projects, animate, onOpenCaseStudy, onOpenProject }: ProjectsAnswerProps) => (
  <Stack animate={animate} gap="gap-6">
    <Lead text="Here's what I've been building — open any of them for the full write-up." />

    {onOpenCaseStudy && (
      <div>
        <Label>Featured case study</Label>
        <button
          type="button"
          onClick={onOpenCaseStudy}
          className="group mt-1.5 flex w-full items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left hover:border-orange-400/40 hover:bg-white/[0.05] transition-all"
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
      <div>
        <Label>All projects</Label>
        <div className="mt-1.5 grid gap-2.5 sm:grid-cols-2">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onOpenProject?.(project.name)}
              className="group flex flex-col items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left hover:border-white/20 hover:bg-white/[0.04] transition-all"
            >
              <div className="flex w-full items-start justify-between gap-2">
                <span className="font-serif text-[1rem] font-semibold leading-snug text-foreground line-clamp-2">{project.name}</span>
                <ArrowUpRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {project.description ? (
                <p className="font-serif text-[0.9375rem] leading-relaxed text-foreground/75 line-clamp-3">{project.description}</p>
              ) : (
                <p className="font-sans text-[0.8125rem] text-muted-foreground">
                  {project.artifacts.length} write-up{project.artifacts.length === 1 ? "" : "s"} · {project.chats.length} chats
                </p>
              )}
              {project.meta && <Chip>{project.meta}</Chip>}
            </button>
          ))}
        </div>
      </div>
    )}
  </Stack>
);

export default ProjectsAnswer;
