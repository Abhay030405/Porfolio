import { useMemo, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjects } from "@/portfolio/usePortfolio";

const SORTS = ["Featured", "A–Z"] as const;
type Sort = (typeof SORTS)[number];

interface ProjectsPageProps {
  /** Opens the given project's page — the same page the sidebar opens. */
  onOpenProject: (name: string) => void;
}

const ProjectsPage = ({ onOpenProject }: ProjectsPageProps) => {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sort, setSort] = useState<Sort>("Featured");
  const { allProjects } = useProjects();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? allProjects.filter((p) =>
          [p.name, p.description ?? "", p.meta ?? "", ...p.artifacts.map((a) => a.title)]
            .join(" ")
            .toLowerCase()
            .includes(q),
        )
      : allProjects;
    return sort === "A–Z"
      ? [...matched].sort((a, b) => a.name.localeCompare(b.name))
      : matched;
  }, [allProjects, query, sort]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8 md:py-14">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1
            className="text-3xl md:text-4xl text-foreground"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            Projects
          </h1>

          <div className="flex items-center gap-2">
            {searchOpen ? (
              <div className="flex items-center gap-2 pl-3 pr-1 h-10 rounded-xl bg-white/[0.06] border border-white/10 focus-within:border-orange-700 transition-colors">
                <Search className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects"
                  className="w-36 sm:w-48 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSearchOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                title="Search projects"
                className="grid place-items-center w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-foreground transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] data-[state=open]:bg-white/[0.1] text-sm transition-colors outline-none">
                <span className="text-muted-foreground">Sort by</span>
                <span className="text-foreground">{sort}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[9rem] rounded-xl p-1.5">
                {SORTS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onSelect={() => setSort(option)}
                    className="px-2.5 py-2 rounded-lg text-sm cursor-pointer"
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              type="button"
              onClick={() =>
                window.open("https://github.com/Abhay030405", "_blank", "noopener,noreferrer")
              }
              className="h-10 px-4 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              View GitHub
            </button>
          </div>
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-stretch">
            {visible.map((project) => (
              <button
                key={project.name}
                type="button"
                onClick={() => onOpenProject(project.name)}
                className="group flex h-full flex-col text-left p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-orange-700/50 transition-all duration-200"
              >
                <div className="text-[0.9375rem] font-semibold text-foreground">
                  {project.name}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {project.description ?? project.artifacts.map((a) => a.title.split(" — ").pop()).join(" · ")}
                </p>
                <div className="mt-auto pt-6 text-sm text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                  {project.meta ??
                    `${project.artifacts.length} artifacts · ${project.items.length} ${project.items.length === 1 ? "chat" : "chats"}`}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            No projects match “{query}”.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
