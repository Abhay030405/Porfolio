import { useState } from "react";
import {
  AudioLines,
  ChevronDown,
  FileText,
  Maximize2,
  Mic,
  Minimize2,
  Pin,
  Plus,
  Search,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ProjectArtifact, type SidebarProject } from "./sidebarProjects";
import { useProjects } from "@/portfolio/usePortfolio";
import { renderInline } from "@/portfolio/inline";

/* Header + body of an opened artifact, shared by the side panel and the mobile overlay. */
const ArtifactView = ({
  artifact,
  expanded,
  onToggleExpand,
  onClose,
  showExpand = true,
}: {
  artifact: ProjectArtifact;
  expanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
  showExpand?: boolean;
}) => (
  <>
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-3.5 h-3.5 text-white/70" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-foreground truncate">{artifact.title}</div>
          <div className="text-[0.6875rem] text-muted-foreground">{artifact.kind}</div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {showExpand && (
          <button
            type="button"
            onClick={onToggleExpand}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground mb-5">
          {artifact.title}
        </h2>
        {artifact.content.split("\n\n").map((paragraph, i) => (
          <p key={i} className="mb-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
            {renderInline(paragraph)}
          </p>
        ))}
      </div>
    </div>
  </>
);

interface ProjectDetailPageProps {
  project: SidebarProject;
  /** Breadcrumb "Projects" — back to the projects grid. */
  onOpenProjects: () => void;
  /** Breadcrumb dropdown — switch to another project. */
  onOpenProject: (name: string) => void;
  /** Starts a new chat with the typed question. */
  onStartChat: (text: string) => void;
  /** When true, the floating sidebar toggle sits over the top-left corner. */
  sidebarCollapsed?: boolean;
}

const ProjectDetailPage = ({
  project,
  onOpenProjects,
  onOpenProject,
  onStartChat,
  sidebarCollapsed = false,
}: ProjectDetailPageProps) => {
  const [draft, setDraft] = useState("");
  const [openArtifact, setOpenArtifact] = useState<ProjectArtifact | null>(null);
  const [artifactExpanded, setArtifactExpanded] = useState(false);
  const { allProjects } = useProjects();

  const closeArtifact = () => {
    setOpenArtifact(null);
    setArtifactExpanded(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.trim()) onStartChat(draft.trim());
  };

  return (
    <div className="h-full flex">
    {/* ── Project page column ── (hidden while an artifact is expanded) */}
    <div className={`h-full flex-col flex-1 min-w-0 ${artifactExpanded ? "hidden" : "flex"}`}>
      {/* Top bar — breadcrumb on the left, page actions on the right */}
      <div
        className={`flex items-center justify-between h-[3.25rem] flex-shrink-0 pr-4 transition-[padding] duration-300 ${
          sidebarCollapsed ? "pl-14" : "pl-6"
        }`}
      >
        <div className="flex min-w-0 items-center gap-1 text-[0.9375rem]">
          <button
            type="button"
            onClick={onOpenProjects}
            className="px-1.5 py-1 -ml-1.5 rounded-lg text-foreground hover:bg-secondary transition-colors"
          >
            Projects
          </button>
          <span className="text-muted-foreground">/</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex min-w-0 items-center gap-1.5 px-1.5 py-1 rounded-lg text-foreground hover:bg-secondary data-[state=open]:bg-secondary transition-colors outline-none">
              <span className="truncate">{project.name}</span>
              <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[12rem] rounded-xl p-1.5">
              {allProjects.map(({ name }) => (
                <DropdownMenuItem
                  key={name}
                  onSelect={() => onOpenProject(name)}
                  className={`px-2.5 py-2 rounded-lg text-sm cursor-pointer ${
                    name === project.name ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button type="button" title="Search" className="p-2 rounded-lg text-foreground hover:bg-secondary transition-colors">
            <Search className="w-[1.125rem] h-[1.125rem]" />
          </button>
          <button type="button" title="Pin project" className="p-2 rounded-lg text-foreground hover:bg-secondary transition-colors">
            <Pin className="w-[1.125rem] h-[1.125rem] fill-current" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto w-full max-w-[74rem] px-5 md:px-8 pt-8 pb-12">
          {/* Two columns on wide screens — stacked while an artifact panel takes half the width */}
          <div
            className={`grid grid-cols-1 gap-x-16 gap-y-10 ${
              openArtifact ? "" : "lg:grid-cols-[minmax(0,1fr)_20rem]"
            }`}
          >
            {/* Main column */}
            <div className="min-w-0">
              <h1 className="font-serif text-[1.75rem] font-semibold tracking-tight text-foreground px-3.5 mb-8">
                {project.name}
              </h1>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col justify-between min-h-[6rem] rounded-2xl border border-white/15 bg-white/[0.03] focus-within:border-white/25 transition-colors">
                  <input
                    autoFocus
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`New session in ${project.name}`}
                    className="w-full bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground px-3.5 pt-4"
                  />
                  <div className="flex items-center justify-between px-2 pb-2">
                    <button type="button" className="p-1.5 rounded-lg text-foreground hover:bg-accent transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1">
                      <button type="button" className="p-1.5 rounded-lg text-foreground hover:bg-accent transition-colors">
                        <Mic className="w-[1.125rem] h-[1.125rem]" />
                      </button>
                      <button
                        type="submit"
                        title="Start chat"
                        className="flex items-center gap-0.5 p-1.5 rounded-lg text-foreground hover:bg-accent transition-colors"
                      >
                        <AudioLines className="w-[1.125rem] h-[1.125rem]" />
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Dummy controls — clickable for the look, not wired to anything */}
              <div className="flex items-center justify-between mt-2 px-2 text-[0.875rem]">
                <button
                  type="button"
                  className="flex items-center gap-1 px-1.5 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  Output
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="text-foreground">Opus 5.5</span>
                    <span className="text-muted-foreground">Medium</span>
                  </button>
                  <button
                    type="button"
                    className="px-1.5 py-1 rounded-lg text-foreground hover:bg-accent transition-colors"
                  >
                    Auto
                  </button>
                </div>
              </div>

              {/* Recents — the items nested under this project in the sidebar */}
              {project.items.length > 0 && (
                <div className="mt-12">
                  <div className="px-3.5 mb-1 text-[0.9375rem] text-muted-foreground">Recents</div>
                  {/* Title left, time right, thin rule between rows */}
                  <div className="mx-3.5">
                    {project.items.map((item, i) => (
                      <button
                        key={item}
                        type="button"
                        className="group w-full flex items-center justify-between gap-6 py-4 border-b border-white/[0.06] last:border-b-0 text-left text-[0.9375rem]"
                      >
                        <span className="truncate text-foreground group-hover:underline underline-offset-4 decoration-white/30">
                          {item}
                        </span>
                        <span className="flex-shrink-0 text-muted-foreground">{project.itemTimes[i]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description card, then the artifacts — each artifact opens in the side panel */}
            <div className={openArtifact ? "" : "lg:pt-[4.75rem]"}>
              <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5">
                <div className="mb-1.5 text-[0.8125rem] font-medium text-muted-foreground">Project description</div>
                <p className="text-[0.9375rem] leading-relaxed text-foreground">
                  {project.description ?? "A short description of this project is coming soon."}
                </p>
              </div>

              <div className="mb-3 text-[0.9375rem] text-muted-foreground">Artifacts</div>
              {/* Side by side as fixed-size squares while an artifact is open; spare width stays empty */}
              <div className={`grid gap-4 ${openArtifact ? "grid-cols-[repeat(2,minmax(0,13rem))]" : "grid-cols-1"}`}>
                {project.artifacts.map((artifact) => {
                  const isOpen = openArtifact?.title === artifact.title;
                  return (
                    <button
                      key={artifact.title}
                      type="button"
                      onClick={() => setOpenArtifact(artifact)}
                      className={`group w-full flex flex-col text-left rounded-xl border overflow-hidden transition-colors ${
                        openArtifact ? "aspect-square" : ""
                      } ${
                        isOpen
                          ? "border-white/25 bg-white/[0.05]"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      {/* Preview — faint text lines standing in for the document */}
                      <div className={`px-4 pt-4 bg-[#1C1C1B] border-b border-white/[0.06] space-y-2.5 overflow-hidden ${
                        openArtifact ? "flex-1 min-h-0" : "h-28"
                      }`}>
                        <div className="h-2.5 w-2/3 rounded-full bg-white/[0.14]" />
                        <div className="h-2 w-full rounded-full bg-white/[0.07]" />
                        <div className="h-2 w-5/6 rounded-full bg-white/[0.07]" />
                        <div className="h-2 w-11/12 rounded-full bg-white/[0.07]" />
                        <div className="h-2 w-3/5 rounded-full bg-white/[0.07]" />
                      </div>
                      {/* Fixed-height footer on square cards so both previews end at the same line */}
                      <div className={`flex gap-3 px-3.5 py-3 flex-shrink-0 ${openArtifact ? "h-[5rem] items-end" : "items-center"}`}>
                        {/* Square cards are too narrow for the icon, so it only shows in the wide layout */}
                        {!openArtifact && (
                          <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-[0.9375rem] leading-snug text-foreground line-clamp-2">{artifact.title}</div>
                          <div className="text-[0.8125rem] text-muted-foreground truncate">
                            {openArtifact ? artifact.kind : `${artifact.kind} · Click to open`}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ── Artifact side panel (desktop) ── */}
    <div
      className={`hidden md:flex flex-col h-full min-h-0 bg-[#1C1C1B] overflow-hidden flex-shrink-0 transition-all duration-300 ease-in-out ${
        openArtifact ? "border-l border-white/[0.06]" : ""
      }`}
      style={{ width: openArtifact ? (artifactExpanded ? "100%" : "min(32.5rem, 50%)") : "0" }}
    >
      {openArtifact && (
        <ArtifactView
          artifact={openArtifact}
          expanded={artifactExpanded}
          onToggleExpand={() => setArtifactExpanded((e) => !e)}
          onClose={closeArtifact}
        />
      )}
    </div>

    {/* ── Artifact overlay (mobile) ── */}
    {openArtifact && (
      <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-[#1C1C1B]">
        <ArtifactView
          artifact={openArtifact}
          expanded={false}
          onToggleExpand={() => {}}
          onClose={closeArtifact}
          showExpand={false}
        />
      </div>
    )}
    </div>
  );
};

export default ProjectDetailPage;
