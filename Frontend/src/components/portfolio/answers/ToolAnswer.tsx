import AboutLevel0 from "../AboutLevel0";
import type {
  AboutContent,
  AchievementsContent,
  ContactContent,
  ExperienceContent,
  PublishedProject,
  SkillsContent,
  ToolName,
} from "@/portfolio/types";
import ToolTrace, { type Trace } from "./ToolTrace";
import ExperienceAnswer from "./ExperienceAnswer";
import SkillsAnswer from "./SkillsAnswer";
import AchievementsAnswer from "./AchievementsAnswer";
import ContactAnswer from "./ContactAnswer";
import ProjectsAnswer from "./ProjectsAnswer";

/*
 * Renders one chat tool's result. The chat and the admin preview both use
 * this, so what the admin previews is exactly what visitors get.
 */

interface ToolAnswerProps {
  tool: ToolName;
  data: unknown;
  /** How the tool was chosen; omitted in the admin preview. */
  trace?: Trace;
  /** Fade the blocks in — for a fresh answer, not history or previews. */
  animate?: boolean;
  onOpenCaseStudy?: () => void;
  onOpenProject?: (name: string) => void;
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** The "read …" half of the trace line. */
function summarize(tool: ToolName, data: unknown): string {
  switch (tool) {
    case "about":
      return "read the About page";
    case "experience":
      return `read ${plural((data as ExperienceContent).entries.length, "entry", "entries")}`;
    case "skills": {
      const s = data as SkillsContent;
      return `read ${plural(s.languages.length + s.groups.length, "skill group")}`;
    }
    case "achievements":
      return `read ${plural((data as AchievementsContent).entries.length, "achievement")}`;
    case "projects":
      return `read ${plural((data as PublishedProject[]).length, "project")}`;
    case "contact":
      return "read contact details";
  }
}

const ToolAnswer = ({ tool, data, trace, animate = false, onOpenCaseStudy, onOpenProject }: ToolAnswerProps) => (
  <div className="w-full">
    {trace && <ToolTrace tool={tool} summary={summarize(tool, data)} {...trace} />}
    {tool === "about" ? (
      <div className={animate ? "animate-fade-in" : undefined}>
        <AboutLevel0 data={data as AboutContent} />
      </div>
    ) : tool === "experience" ? (
      <ExperienceAnswer data={data as ExperienceContent} animate={animate} />
    ) : tool === "skills" ? (
      <SkillsAnswer data={data as SkillsContent} animate={animate} />
    ) : tool === "achievements" ? (
      <AchievementsAnswer data={data as AchievementsContent} animate={animate} />
    ) : tool === "contact" ? (
      <ContactAnswer data={data as ContactContent} animate={animate} />
    ) : (
      <ProjectsAnswer
        projects={data as PublishedProject[]}
        animate={animate}
        onOpenCaseStudy={onOpenCaseStudy}
        onOpenProject={onOpenProject}
      />
    )}
  </div>
);

export default ToolAnswer;
