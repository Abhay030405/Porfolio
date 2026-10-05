import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Mic, ChevronDown, X, Download, ExternalLink, Code, Maximize2, Minimize2, CornerDownLeft } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ResumeViewer from "./ResumeViewer";
import CampaignXProject from "./CampaignXProject";
import { askPortfolio } from "@/lib/chat";
import { projectSlug } from "./sidebarProjects";
import type { ChatResult, ToolName, WelcomeContent } from "@/portfolio/types";
import type { Trace } from "./answers/ToolTrace";
import { FALLBACK_WELCOME, helpWelcome } from "./answers/welcomeDefaults";

/*
 * Pointer events only ever arrive in px, so anything driven by a drag has to
 * cross back into rem. Reading the live root font size (rather than assuming
 * 16) keeps the panel honest under the fluid `html` size set in index.css and
 * under a user-raised browser font size.
 */
const rootFontSize = () => {
  if (typeof window === "undefined") return 16;
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
};
const pxToRem = (px: number) => px / rootFontSize();

const DEFAULT_PANEL_REM = 32.5;
const MIN_PANEL_REM = 21.25;
const MIN_CHAT_REM = 22.5;

const ProjectPanelHeader = ({
  expanded,
  onToggleExpand,
  onClose,
  showExpand = true,
}: {
  expanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
  showExpand?: boolean;
}) => (
  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
        <Code className="w-3.5 h-3.5 text-white/70" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground truncate">CampaignX — Level 0</div>
        <div className="text-[0.6875rem] text-muted-foreground">Case study</div>
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
);

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  section?: string;
  /** The tool's structured result, rendered by ToolAnswer. */
  data?: unknown;
  /** How the tool was chosen, shown in the trace line above the answer. */
  trace?: Trace;
  instant?: boolean;
}

interface ChatAreaProps {
  activeSection: string | null;
  onSectionChange: (section: string) => void;
  onAddToHistory: (query: string) => void;
  onCollapseSidebar: () => void;
  instantSectionRef?: React.MutableRefObject<boolean>;
  /** Bumped by the sidebar to open the resume overlay; ignored at 0. */
  resumeSignal?: number;
  /** When true, the floating sidebar toggle sits over the top-left corner. */
  sidebarCollapsed?: boolean;
  /** A question to send as if typed; a new `id` sends it again. */
  externalQuery?: { id: number; text: string } | null;
  /** The published welcome message; null when it isn't published or the API is down. */
  welcome?: WelcomeContent | null;
  welcomeLoading?: boolean;
}

const offlineMessage = "I can't reach my portfolio right now — please try again in a moment.";

const TOOLS: ToolName[] = ["about", "experience", "skills", "achievements", "projects", "contact"];
const isTool = (name: string): name is ToolName => (TOOLS as string[]).includes(name);

/*
 * Every answer is a tool result from the backend: Jev picks the tool for a
 * typed question, the tool reads its content from the database, and this
 * turns the result into a chat message.
 */
const toAnswer = (
  result: ChatResult | null,
  topics: WelcomeContent["topics"],
): Pick<Message, "content" | "section" | "data" | "trace"> => {
  if (!result) return { content: offlineMessage };
  if (!result.tool) return { content: "", section: "welcome", data: helpWelcome(topics) };
  if (!result.data) return { content: `My ${result.tool} section isn't published yet — check back soon.` };
  return {
    content: "",
    section: result.tool,
    data: result.data,
    trace: { routedBy: result.routedBy, confidence: result.confidence },
  };
};

/** null when the backend can't be reached — async so even a synchronous throw becomes null. */
const ask = async (request: { query: string } | { tool: string }) => {
  try {
    return await askPortfolio(request);
  } catch {
    return null;
  }
};

const ChatArea = ({ activeSection, onSectionChange, onAddToHistory, onCollapseSidebar, instantSectionRef, resumeSignal = 0, sidebarCollapsed = false, externalQuery = null, welcome = null, welcomeLoading = false }: ChatAreaProps) => {
  const navigate = useNavigate();
  const topics = (welcome ?? FALLBACK_WELCOME).topics;
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", type: "assistant", content: "", section: "welcome" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showResumePanel, setShowResumePanel] = useState(false);
  const [showProjectPanel, setShowProjectPanel] = useState(false);
  const [projectPanelExpanded, setProjectPanelExpanded] = useState(false);
  // Panel width is tracked in rem so it scales with the root font size.
  const [projectPanelWidth, setProjectPanelWidth] = useState(DEFAULT_PANEL_REM);
  const [isResizingPanel, setIsResizingPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef<{ startX: number; startWidth: number } | null>(null);

  // Widest the panel may be without squeezing the chat column below its minimum.
  const maxPanelRem = () => {
    const containerRem = pxToRem(rootRef.current?.clientWidth ?? window.innerWidth);
    return Math.max(MIN_PANEL_REM, containerRem - MIN_CHAT_REM);
  };

  const handlePanelResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeStartRef.current = { startX: e.clientX, startWidth: projectPanelWidth };
    setIsResizingPanel(true);
  };

  useEffect(() => {
    if (!isResizingPanel) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return;
      const { startX, startWidth } = resizeStartRef.current;
      const deltaRem = pxToRem(startX - e.clientX);
      const next = Math.min(maxPanelRem(), Math.max(MIN_PANEL_REM, startWidth + deltaRem));
      setProjectPanelWidth(next);
    };

    const handleMouseUp = () => {
      setIsResizingPanel(false);
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
  }, [isResizingPanel]);

  /*
   * Keep the panel inside the available space when the window (or the root
   * font size) changes, and when it first opens on a narrow laptop — otherwise
   * the default width would push the chat column below its minimum.
   */
  useEffect(() => {
    if (!showProjectPanel || projectPanelExpanded) return;
    const clamp = () =>
      setProjectPanelWidth((w) => Math.min(maxPanelRem(), Math.max(MIN_PANEL_REM, w)));
    clamp();
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, [showProjectPanel, projectPanelExpanded]);

  // Sidebar asks for the resume overlay by bumping the signal
  useEffect(() => {
    if (resumeSignal > 0) setShowResumePanel(true);
  }, [resumeSignal]);

  const chatTitle = messages.find((m) => m.type === "user")?.content.trim() ?? "";

  // Scroll to the start of the latest message
  const scrollToMessage = () => {
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Track the last processed section to prevent duplicates
  const lastProcessedSection = useRef<string | null>(null);

  useEffect(() => {
    // Only process if it's a new section (from sidebar click) and not already processed
    if (activeSection && isTool(activeSection) && lastProcessedSection.current !== activeSection) {
      lastProcessedSection.current = activeSection;
      
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: activeSection.charAt(0).toUpperCase() + activeSection.slice(1),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      // Scroll to the new user message
      setTimeout(() => scrollToMessage(), 100);

      // Keep the typing indicator up for at least 500ms so fast answers still feel natural
      Promise.all([ask({ tool: activeSection }), new Promise((resolve) => setTimeout(resolve, 500))]).then(([result]) => {
        const instant = instantSectionRef?.current ?? false;
        if (instantSectionRef) instantSectionRef.current = false;
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          ...toAnswer(result, topics),
          instant,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
        // Scroll to the new assistant message
        setTimeout(() => scrollToMessage(), 100);
      });
    }
  }, [activeSection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(inputValue);
  };

  // A question typed somewhere else (e.g. a project page) arrives through this prop
  useEffect(() => {
    if (externalQuery?.text.trim()) sendQuery(externalQuery.text);
  }, [externalQuery?.id]);

  const sendQuery = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    onAddToHistory(text);

    // Scroll to the new user message
    setTimeout(() => scrollToMessage(), 100);

    setIsTyping(true);

    // Keep the typing indicator up for at least 600ms so fast answers still feel natural
    Promise.all([ask({ query: text.trim() }), new Promise((resolve) => setTimeout(resolve, 600))]).then(([result]) => {
      // Mark the section as shown so the activeSection effect doesn't answer it twice
      if (result?.tool) lastProcessedSection.current = result.tool;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        ...toAnswer(result, topics),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
      // Scroll to the new assistant message
      setTimeout(() => scrollToMessage(), 100);
    });
  };


  return (
    <div ref={rootRef} className="flex-1 flex h-full min-h-0 min-w-0 overflow-hidden bg-background">

      {/* ── Chat column ── */}
      <div className="flex flex-col h-full min-h-0 overflow-x-hidden relative flex-1 min-w-0">

      {/* Chat title — named after the conversation's first question */}
      {chatTitle && (
        <div
          className={`flex items-center h-[3.25rem] flex-shrink-0 pr-4 transition-[padding] duration-300 ${
            sidebarCollapsed ? "pl-14" : "pl-6"
          }`}
        >
          <button
            type="button"
            title={chatTitle}
            className="flex min-w-0 max-w-full items-center gap-1.5 px-2 py-1 -ml-2 rounded-lg text-[0.9375rem] text-foreground hover:bg-secondary transition-colors"
          >
            <span className="truncate">{chatTitle}</span>
            <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div ref={chatContainerRef} className="overflow-y-auto overflow-x-hidden min-h-0 flex-1">

        <div className="max-w-[50rem] mx-auto px-3 md:px-4 py-4 md:py-8">
          <div className="space-y-6">
            {messages.map((message, index) => {
              const isLast = index === messages.length - 1;
              if (message.id === "welcome" && welcomeLoading) return null;
              return (
                <div key={message.id} ref={isLast ? latestMessageRef : undefined}>
                  <ChatMessage
                    message={message.id === "welcome" ? { ...message, data: welcome ?? FALLBACK_WELCOME } : message}
                    isLatest={isLast}
                    onSectionChange={isLast && message.type === "assistant" && messages.length > 1 ? onSectionChange : undefined}
                    onOpenProject={() => { setShowProjectPanel(true); onCollapseSidebar(); }}
                    onOpenProjectPage={(name) => navigate(`/project/${projectSlug(name)}`)}
                    onOpenTopic={onSectionChange}
                    onOpenResume={() => setShowResumePanel(true)}
                    topics={topics}
                  />
                </div>
              );
            })}

            {(isTyping || (welcomeLoading && messages.length === 1)) && (
              <div className="flex items-start">
                <div className="flex items-center gap-1 pt-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0s" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-3 md:px-4 pb-5 md:pb-6 flex-shrink-0">
        <div className="w-full mx-auto max-w-[50.375rem]">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 h-12 pl-4 pr-2 rounded-xl border border-white/15 bg-background focus-within:border-white/25 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={messages.length === 1 ? "Ask me anything" : "Reply"}
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                title="Send"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
              >
                <CornerDownLeft className="w-[1.125rem] h-[1.125rem]" />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between gap-3 mt-2 px-1 text-[0.8125rem]">
            <div className="flex items-center gap-1 flex-shrink-0">
              <button type="button" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Plus className="w-4 h-4" />
              </button>
              <button type="button" className="flex items-center gap-0.5 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Mic className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            <span className="hidden sm:block truncate text-muted-foreground">
              Claude is AI and can make mistakes.
            </span>

            <div className="flex items-center gap-4 flex-shrink-0">
              <button type="button" className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg hover:bg-accent transition-colors">
                <span className="text-foreground">Opus 5</span>
                <span className="text-muted-foreground">High</span>
              </button>
              <button type="button" className="px-1.5 py-1 rounded-lg text-foreground hover:bg-accent transition-colors">
                Manual
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── close chat column ── */}
      </div>

      {/* ── Project panel resize handle (desktop) ── */}
      {showProjectPanel && !projectPanelExpanded && (
        <div
          onMouseDown={handlePanelResizeStart}
          className="hidden md:flex items-center justify-center w-2.5 flex-shrink-0 cursor-col-resize group relative z-10"
          title="Drag to resize"
        >
          <div className={`w-px h-full transition-colors ${isResizingPanel ? "bg-orange-600" : "bg-white/10 group-hover:bg-orange-600/60"}`} />
        </div>
      )}

      {/* ── Project detail side panel (desktop) ── */}
      <div
        className={`hidden md:flex flex-col h-full min-h-0 bg-[#1C1C1B] overflow-hidden flex-shrink-0 ${
          showProjectPanel && !projectPanelExpanded ? "" : "border-l border-white/[0.06]"
        } ${isResizingPanel ? "" : "transition-all duration-300 ease-in-out"}`}
        style={{
          width: showProjectPanel ? (projectPanelExpanded ? "100%" : `${projectPanelWidth}rem`) : "0",
        }}
      >
        {showProjectPanel && (
          <>
            <ProjectPanelHeader
              expanded={projectPanelExpanded}
              onToggleExpand={() => setProjectPanelExpanded((e) => !e)}
              onClose={() => { setShowProjectPanel(false); setProjectPanelExpanded(false); }}
            />
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="p-4">
                <CampaignXProject />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Project detail overlay (mobile) ── */}
      {showProjectPanel && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-[#1C1C1B]">
          <ProjectPanelHeader
            expanded={false}
            onToggleExpand={() => {}}
            onClose={() => setShowProjectPanel(false)}
            showExpand={false}
          />
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="p-4">
              <CampaignXProject />
            </div>
          </div>
        </div>
      )}

      {/* ── Resume full-screen overlay ── */}
      {showResumePanel && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#1C1C1B]">
          {/* Overlay header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowResumePanel(false)}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-sm font-medium text-foreground truncate mx-3">Abhay Agarwal — Resume</span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => window.open("/resume_abhay.pdf", "_blank", "noopener,noreferrer")}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => { const a = document.createElement("a"); a.href = "/resume_abhay.pdf"; a.download = "Abhay_Agarwal_Resume.pdf"; a.click(); }}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Overlay body */}
          <div className="flex-1 overflow-hidden">
            <ResumeViewer />
          </div>
        </div>
      )}

    </div>
  );
};

export default ChatArea;