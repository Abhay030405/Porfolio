import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Search,
  Archive,
  Shapes,
  Clock,
  Briefcase,
  MessagesSquare,
  Code,
  PanelLeft,
  PanelLeftOpen,
  PanelRight,
  ChevronDown,
  Download,
  Github,
  Linkedin,
  Code2,
  Trophy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjects } from "@/portfolio/usePortfolio";

/* Desktop sidebar width, in rem — drag the right edge to move between these. */
const SIDEBAR_MIN_REM = 16;
const SIDEBAR_MAX_REM = 26;
const SIDEBAR_DEFAULT_REM = 18;

/*
 * Recents titles are clipped rather than ellipsised, so they fade out at the
 * sidebar's edge instead of ending on a hard cut. Applied to a flex-1 span so
 * the fade sits at the row edge no matter how short the title is.
 */
const FADE_MASK = {
  maskImage: "linear-gradient(to right, #000 calc(100% - 1.75rem), transparent)",
  WebkitMaskImage: "linear-gradient(to right, #000 calc(100% - 1.75rem), transparent)",
} as const;

/* Chats shown under each sidebar project; the rest sit behind "View all" (the project page). */
const PROJECT_CHATS_PREVIEW = 2;

const NAV_ITEM_CLASS =
  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[0.9375rem] text-sidebar-foreground hover:bg-sidebar-accent transition-colors";
const NAV_ICON_CLASS = "w-5 h-5";

const pxToRem = (px: number) =>
  px / parseFloat(getComputedStyle(document.documentElement).fontSize || "16");

const openExternal = (url: string) => () => window.open(url, "_blank", "noopener,noreferrer");

const downloadResume = () => {
  const a = document.createElement("a");
  a.href = "/resume_abhay.pdf";
  a.download = "Abhay_Agarwal_Resume.pdf";
  a.click();
};

const PROFILE_LINKS = [
  { label: "Download Resume", icon: Download, onSelect: downloadResume },
  { label: "GitHub", icon: Github, onSelect: openExternal("https://github.com/Abhay030405") },
  { label: "LeetCode", icon: Code2, onSelect: openExternal("https://leetcode.com/u/absolutabhay") },
  { label: "Codeforces", icon: Trophy, onSelect: openExternal("https://codeforces.com/profile/absolutabhay") },
  {
    label: "LinkedIn",
    icon: Linkedin,
    onSelect: openExternal("https://linkedin.com/in/abhay-agarwal-8563352b1"),
  },
];

interface SidebarProps {
  onNewChat: () => void;
  chatHistory: string[];
  onSelectChat: (chatId: string) => void;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onViewResume: () => void;
  onOpenProjects: () => void;
  onOpenProject: (name: string) => void;
  /** Name of the project whose page is open, if any — highlighted in the list. */
  activeProject?: string | null;
}

const Sidebar = ({ onNewChat, chatHistory, onSelectChat, isCollapsed, onCollapsedChange, onViewResume, onOpenProjects, onOpenProject, activeProject = null }: SidebarProps) => {
  const setIsCollapsed = onCollapsedChange;
  const [selectedRecent, setSelectedRecent] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [width, setWidth] = useState(SIDEBAR_DEFAULT_REM);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { sidebarProjects } = useProjects();

  // Keep each chat's original index so selection survives filtering
  const filteredHistory = chatHistory
    .map((chat, index) => ({ chat, index }))
    .filter(({ chat }) => chat.toLowerCase().includes(searchQuery.trim().toLowerCase()));

  /*
   * Collapse below the `md` breakpoint. Expressed in rem so it tracks the
   * Tailwind breakpoint (and the user's base font size) rather than a raw
   * pixel count, and kept live so rotating a device re-evaluates it.
   */
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(max-width: 47.9375rem)");
    const apply = (matches: boolean) => {
      onCollapsedChange(matches);
      setIsDesktop(!matches);
    };
    apply(query.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeStartRef.current = { startX: e.clientX, startWidth: width };
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return;
      const { startX, startWidth } = resizeStartRef.current;
      const deltaRem = pxToRem(e.clientX - startX);
      setWidth(Math.min(SIDEBAR_MAX_REM, Math.max(SIDEBAR_MIN_REM, startWidth + deltaRem)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeStartRef.current = null;
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <>
      {/* Floating toggle — the only sidebar affordance while collapsed */}
      <button
        className={`fixed top-3 left-3 z-50 p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-all duration-300 ease-in-out ${
          isCollapsed ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCollapsed(false)}
      >
        <PanelLeftOpen className="w-5 h-5" />
      </button>

      {/* Mobile: backdrop — fades in when sidebar is open */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out ${
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={() => setIsCollapsed(true)}
      />

      {/*
        Main sidebar panel.
        Mobile  → fixed overlay; slides in/out via translateX
        Desktop → static; width animates between 0 and w-64, so collapsing
                  hands the full width to the chat and leaves only the
                  floating toggle above.
      */}
      <div
        style={isDesktop && !isCollapsed ? { width: `${width}rem` } : undefined}
        className={`
          fixed md:static left-0 top-0 z-50 md:z-auto
          h-[100dvh] md:h-full bg-sidebar flex flex-col
          overflow-hidden flex-shrink-0
          ${isResizing ? "" : "transition-all duration-300 ease-in-out"}
          ${isCollapsed
            ? "-translate-x-full md:translate-x-0 w-[min(18rem,85vw)] md:w-0 md:border-r-0"
            : "translate-x-0 w-[min(18rem,85vw)] border-r border-white/10"
          }
        `}
      >
        {/* Header */}
        <div className="relative flex items-center p-3 h-[3.25rem] flex-shrink-0">
          {/* Close + new-chat — cross-fades in when expanded */}
          <div
            className={`flex items-center justify-between w-full transition-all duration-200 ${
              isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="flex min-w-0 items-center gap-1.5">
              <button
                onClick={() => setIsCollapsed(true)}
                title="Close sidebar"
                className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground flex-shrink-0"
              >
                <PanelLeft className="w-[1.125rem] h-[1.125rem]" />
              </button>
              <span className="font-serif text-[1.25rem] font-semibold tracking-tight text-sidebar-primary whitespace-nowrap truncate">
                Abhay Agarwal
              </span>
            </div>

            {/* Chat / code mode switch — visual only, chat is the only mode */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button
                type="button"
                title="Chat"
                className="flex items-center justify-center w-8 h-7 rounded-lg bg-sidebar-accent border border-white/10 text-sidebar-primary"
              >
                <MessagesSquare className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Code"
                className="flex items-center justify-center w-8 h-7 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar body — fades out when collapsing so text doesn't peek out */}
        <div
          className={`flex flex-col flex-1 min-h-0 transition-opacity duration-150 ease-in-out ${
            isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Everything below the header scrolls together — only the name bar stays put */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* Search — filters the chat history below */}
            <div className="px-3 mb-2">
              <label className="flex items-center gap-3 h-10 px-3 rounded-xl border border-white/10 bg-white/[0.03] text-sidebar-foreground focus-within:border-white/20 transition-colors cursor-text">
                <Search className="w-[1.125rem] h-[1.125rem] flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 min-w-0 bg-transparent text-[0.9375rem] text-sidebar-primary placeholder:text-sidebar-foreground outline-none"
                />
              </label>
            </div>

            {/* Primary nav */}
            <div className="px-3 mb-3">
              <button
                onClick={onNewChat}
                className={NAV_ITEM_CLASS}
              >
                <span className="flex items-center justify-center w-6 h-6 -mx-0.5 rounded-full bg-sidebar-accent text-sidebar-primary">
                  <Plus className="w-4 h-4" />
                </span>
                <span>New</span>
              </button>

              <button type="button" onClick={onOpenProjects} className={NAV_ITEM_CLASS}>
                <Archive className={NAV_ICON_CLASS} />
                <span>Projects</span>
              </button>

              {/* Visual only for now — no destinations wired up yet */}
              <button type="button" className={NAV_ITEM_CLASS}>
                <Shapes className={NAV_ICON_CLASS} />
                <span>Artifacts</span>
              </button>

              <button type="button" className={NAV_ITEM_CLASS}>
                <Clock className={NAV_ICON_CLASS} />
                <span>Scheduled</span>
              </button>

              <button type="button" className={NAV_ITEM_CLASS}>
                <Briefcase className={NAV_ICON_CLASS} />
                <span>Customize</span>
              </button>
            </div>

            <div className="px-3">
              {/* Projects — click a project to expand or collapse its items */}
              <div className="mb-3">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-[0.875rem] text-sidebar-muted font-medium">Projects</span>
                  <button
                    type="button"
                    title="New project"
                    className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {sidebarProjects.map(({ name, items }) => {
                  const isActive = activeProject === name;
                  return (
                    <div key={name}>
                      <button
                        type="button"
                        onClick={() => onOpenProject(name)}
                        className={`${NAV_ITEM_CLASS} ${isActive ? "bg-sidebar-accent text-sidebar-primary" : ""}`}
                      >
                        <Archive className={`${NAV_ICON_CLASS} flex-shrink-0`} />
                        <span className="truncate">{name}</span>
                      </button>

                      {items.length > 0 && (
                        // Guide line sits under the centre of the project icon
                        <div className="ml-[1.375rem] pl-[0.625rem] border-l border-white/10">
                          {items.slice(0, PROJECT_CHATS_PREVIEW).map((item) => (
                            <button
                              key={item}
                              type="button"
                              title={item}
                              className="w-full flex px-3 py-1.5 rounded-lg text-left text-[0.9375rem] text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                            >
                              <span className="flex-1 min-w-0 whitespace-nowrap overflow-hidden" style={FADE_MASK}>
                                {item}
                              </span>
                            </button>
                          ))}
                          {items.length > PROJECT_CHATS_PREVIEW && (
                            <button
                              type="button"
                              onClick={() => onOpenProject(name)}
                              className="w-full flex px-3 py-1.5 rounded-lg text-left text-[0.9375rem] text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                            >
                              View all
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Recent chats */}
              {filteredHistory.length > 0 && (
                <>
                  <div className="px-3 py-2">
                    <span className="text-[0.875rem] text-sidebar-muted font-medium">Recents</span>
                  </div>
                  <div className="flex flex-col gap-px">
                    {filteredHistory.map(({ chat, index }) => {
                      const isSelected = selectedRecent === index;
                      return (
                        <button
                          key={index}
                          title={chat}
                          onClick={() => {
                            setSelectedRecent(index);
                            onSelectChat(chat);
                          }}
                          className={`w-full flex px-3 py-1.5 rounded-lg text-left text-[0.9375rem] transition-colors ${
                            isSelected
                              ? "bg-sidebar-accent text-sidebar-primary"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                          }`}
                        >
                          <span
                            className="flex-1 min-w-0 whitespace-nowrap overflow-hidden"
                            style={FADE_MASK}
                          >
                            {chat}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Account bar */}
          <div className="flex items-center gap-1 px-2 py-3.5 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex min-w-0 items-center gap-2.5 pl-1 pr-1.5 py-1 rounded-lg text-left hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent transition-colors outline-none">
                <div className="w-5 h-5 rounded-full bg-sidebar-foreground/70 text-sidebar flex items-center justify-center text-[0.5rem] font-semibold tracking-tight flex-shrink-0">
                  AA
                </div>
                <span className="min-w-0 flex items-baseline gap-1">
                  <span className="truncate text-sm font-semibold text-sidebar-foreground">Abhay</span>
                  <span className="flex-shrink-0 text-[0.6875rem] text-sidebar-muted">· Pro</span>
                </span>
                <ChevronDown className="w-4 h-4 flex-shrink-0 text-sidebar-muted" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                sideOffset={8}
                className="w-[min(15rem,80vw)] rounded-xl border-sidebar-border bg-popover p-1.5"
              >
                <div className="px-2.5 py-2 text-xs text-sidebar-muted truncate">
                  officialabhay030405@gmail.com
                </div>
                <DropdownMenuSeparator className="bg-sidebar-border" />
                {PROFILE_LINKS.map(({ label, icon: Icon, onSelect }) => (
                  <DropdownMenuItem
                    key={label}
                    onSelect={onSelect}
                    className="gap-3 px-2.5 py-2 rounded-lg text-sm cursor-pointer focus:bg-sidebar-accent focus:text-sidebar-accent-foreground"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="ml-auto flex items-center">
              <button
                type="button"
                onClick={onViewResume}
                title="View resume"
                className="p-1.5 rounded-lg text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              >
                <Download className="w-[0.875rem] h-[0.875rem]" />
              </button>
              <button
                type="button"
                onClick={() => searchInputRef.current?.focus()}
                title="Search chats"
                className="p-1.5 rounded-lg text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              >
                <Search className="w-[0.875rem] h-[0.875rem]" />
              </button>
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                title="Collapse sidebar"
                className="p-1.5 rounded-lg text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              >
                <PanelRight className="w-[0.875rem] h-[0.875rem]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resize handle — desktop only, and only while the sidebar is open */}
      {!isCollapsed && (
        <div
          onMouseDown={handleResizeStart}
          onDoubleClick={() => setWidth(SIDEBAR_DEFAULT_REM)}
          title="Drag to resize · double-click to reset"
          className="hidden md:flex items-center justify-center w-2 flex-shrink-0 cursor-col-resize group relative z-10"
        >
          <div
            className={`w-px h-full transition-colors ${
              isResizing ? "bg-orange-600" : "bg-transparent group-hover:bg-orange-600/60"
            }`}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;
