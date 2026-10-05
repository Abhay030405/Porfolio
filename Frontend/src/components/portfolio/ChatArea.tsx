import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, Plus, Mic, ChevronDown, X, Download, ExternalLink, User, Code, Briefcase, Trophy, FolderKanban, Mail, Maximize2, Minimize2, CornerDownLeft } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ResumeViewer from "./ResumeViewer";
import CampaignXProject from "./CampaignXProject";
import { askPortfolio } from "@/lib/chat";
import { projectSlug } from "./sidebarProjects";
import type { ChatResult, ToolName } from "@/portfolio/types";
import type { Trace } from "./answers/ToolTrace";

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
}

const welcomeMessage = `Welcome to my portfolio! I'm here to help you learn more about me.

**Type any of these commands:**
• \`about\` - Learn about me
• \`experience\` - View my experience
• \`skills\` - See my technical skills
• \`achievements\` - View my achievements
• \`projects\` - Browse my projects
• \`contact\` - Get in touch

Or simply click on any section in the sidebar to explore!`;

const helpMessage = `I'm not sure what you're looking for. Try these commands:

• \`about\` - Learn about me
• \`experience\` - View my experience
• \`skills\` - See my technical skills
• \`achievements\` - View my achievements
• \`projects\` - Browse my projects
• \`contact\` - Get in touch`;

const offlineMessage = "I can't reach my portfolio right now — please try again in a moment.";

const TOOLS: ToolName[] = ["about", "experience", "skills", "achievements", "projects", "contact"];
const isTool = (name: string): name is ToolName => (TOOLS as string[]).includes(name);

/*
 * Every answer is a tool result from the backend: Jev picks the tool for a
 * typed question, the tool reads its content from the database, and this
 * turns the result into a chat message.
 */
const toAnswer = (result: ChatResult | null): Pick<Message, "content" | "section" | "data" | "trace"> => {
  if (!result) return { content: offlineMessage };
  if (!result.tool) return { content: helpMessage };
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

const ChatArea = ({ activeSection, onSectionChange, onAddToHistory, onCollapseSidebar, instantSectionRef, resumeSignal = 0, sidebarCollapsed = false, externalQuery = null }: ChatAreaProps) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", type: "assistant", content: welcomeMessage },
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

  // Typewriter for welcome screen
  const twItems = ["About Me", "Experience", "Skills", "Projects", "Achievements", "Contact Me"];
  const [twText, setTwText]         = useState("");
  const [twIndex, setTwIndex]       = useState(0);
  const [twDeleting, setTwDeleting] = useState(false);

  useEffect(() => {
    const current = twItems[twIndex];
    if (!twDeleting && twText === current) {
      const t = setTimeout(() => setTwDeleting(true), 1400);
      return () => clearTimeout(t);
    }
    const delay = twDeleting ? 45 : 95;
    const t = setTimeout(() => {
      if (twDeleting) {
        setTwText(prev => prev.slice(0, -1));
        if (twText.length <= 1) { setTwDeleting(false); setTwIndex(p => (p + 1) % twItems.length); }
      } else {
        setTwText(current.slice(0, twText.length + 1));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [twText, twDeleting, twIndex]);

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
          ...toAnswer(result),
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
        ...toAnswer(result),
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
      <div ref={chatContainerRef} className={`overflow-y-auto overflow-x-hidden min-h-0 flex-1 ${messages.length === 1 ? "md:hidden" : ""}`}>

        {/* Mobile welcome — tech enthusiast edition */}
        {messages.length === 1 && (
          <div className="md:hidden flex flex-col items-center justify-center min-h-full px-5 pt-8 pb-8 gap-7 relative overflow-hidden">

            {/* Subtle dot-grid background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle, white 0.0625rem, transparent 0.0625rem)",
                backgroundSize: "1.75rem 1.75rem",
              }}
            />

            {/* ── AVATAR ── */}
            <div className="relative flex items-center justify-center animate-float z-10">
              {/* Avatar photo */}
              <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10">
                <img
                  src="/206020807.jpg"
                  alt="Abhay Agarwal"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* ── TEXT BLOCK ── */}
            <div className="flex flex-col items-center gap-3 text-center z-10">

              {/* Status badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[0.625rem] font-semibold text-white/60 tracking-[0.15em] uppercase">Open to Opportunities</span>
              </div>

              {/* Name */}
              <h1 className="text-[clamp(1.5rem,7vw,2.25rem)] font-black tracking-tight leading-none text-white">
                ABHAY AGARWAL
              </h1>

              {/* Monospace role line */}
              <p className="font-mono text-[clamp(0.625rem,2.6vw,0.75rem)] text-white/40 tracking-widest">
                {"< AI Engineer · Competitive Coder />"}
              </p>

              {/* Typewriter terminal prompt */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-[clamp(0.75rem,3vw,0.875rem)] text-white/40 mt-1">
                <span className="text-white/70">▶</span>
                <span className="text-white/40">explore:</span>
                <span className="text-white/80">{twText}</span>
                <span className="text-white/70 animate-blink-cursor">█</span>
              </div>
            </div>


            {/* ── SUGGESTION CHIPS ── */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-2 w-full max-w-xs xs:max-w-md z-10">
              {[
                { label: "About Me",     icon: User,         section: "about"        },
                { label: "Skills",       icon: Code,         section: "skills"       },
                { label: "Experience",   icon: Briefcase,    section: "experience"   },
                { label: "Projects",     icon: FolderKanban, section: "projects"     },
                { label: "Achievements", icon: Trophy,       section: "achievements" },
                { label: "Contact",      icon: Mail,         section: "contact"      },
              ].map((item) => (
                <button
                  key={item.section}
                  onClick={() => onSectionChange(item.section)}
                  className="group flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/25 active:scale-95 transition-all duration-200 text-sm text-left"
                >
                  <item.icon className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors flex-shrink-0" />
                  <span className="font-medium text-white/50 group-hover:text-white/90 transition-colors">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop layout + mobile conversation view */}
        <div className={`max-w-[50rem] mx-auto px-3 md:px-4 py-4 md:py-8 ${messages.length === 1 ? "hidden" : "block"}`}>
          <div className="space-y-6">
            {messages.map((message, index) => {
              const isLast = index === messages.length - 1;
              return (
                <div key={message.id} ref={isLast ? latestMessageRef : undefined} className={message.id === "welcome" ? "hidden" : ""}>
                  <ChatMessage
                    message={message}
                    isLatest={isLast}
                    onSectionChange={isLast && message.type === "assistant" && messages.length > 1 ? onSectionChange : undefined}
                    onOpenProject={() => { setShowProjectPanel(true); onCollapseSidebar(); }}
                    onOpenProjectPage={(name) => navigate(`/project/${projectSlug(name)}`)}
                  />
                </div>
              );
            })}

            {isTyping && (
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

      {/* Spacer — pushes input toward center on welcome screen, shrinks away smoothly after first message */}
      <div
        className="flex-shrink-0 hidden md:block overflow-hidden"
        style={{
          height: messages.length === 1 ? "34vh" : "0",
          transition: "height 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Input Area */}
      <div className="px-3 md:px-4 pb-5 md:pb-6 flex-shrink-0">
        <div
          className="w-full mx-auto"
          style={{
            maxWidth: messages.length === 1 ? "42rem" : "50.375rem",
            transition: "max-width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {messages.length === 1 && (
            <h2 className="hidden md:block text-fluid-xl font-normal text-foreground mb-5 text-center" style={{ fontFamily: "'EB Garamond', serif" }}>
              Golden Hour Thinking
            </h2>
          )}
          {messages.length > 1 ? (
            /* Conversation started — compact reply bar with a meta row underneath */
            <>
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 h-12 pl-4 pr-2 rounded-xl border border-white/15 bg-background focus-within:border-white/25 transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Reply"
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
            </>
          ) : (
          <form onSubmit={handleSubmit}>
            <div className={`chat-input-container ${inputValue.trim() ? "chat-input-active border border-orange-700" : "border border-transparent"}`}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={messages.length === 1 ? "What you want to Know about me?" : ""}
                className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base px-4 pt-4"
              />
              {/* Bottom bar */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-3">
                {/* Left: + button */}
                <button
                  type="button"
                  className="p-1.5 rounded-full hover:bg-accent transition-colors text-white"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* Right: model selector + mic + wave send */}
                <div className="flex items-center gap-2">
                  {/* Model dropdown */}
                  <button
                    type="button"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-accent transition-colors text-muted-foreground text-sm"
                  >
                    <span>Claude sonnet 4.5</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {/* Mic */}
                  <button
                    type="button"
                    className="p-1.5 rounded-full hover:bg-accent transition-colors text-white"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  {/* Wave / Send */}
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-end gap-[0.125rem] h-8 w-8 justify-center ${inputValue.trim() ? "bg-orange-500 hover:bg-orange-600" : "bg-transparent"}`}
                  >
                    {inputValue.trim() ? (
                      <ArrowUp className="w-5 h-5 text-white" />
                    ) : (
                      /* Waveform bars — sized in em so they track the button's font size */
                      <>
                        {["0.5em", "0.875em", "0.625em", "1em", "0.5em"].map((height, i) => (
                          <span key={i} className="w-[0.125rem] rounded-full bg-white" style={{ height }} />
                        ))}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
          )}

          {/* Social chips — welcome screen only */}
          {messages.length === 1 && (
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            {[
              {
                label: "LinkedIn",
                url: "https://www.linkedin.com/in/abhay-agarwal-8563352b1/",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#0A66C2">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                ),
              },
              {
                label: "GitHub",
                url: "https://github.com/Abhay030405",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#ffffff">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                ),
              },
              {
                label: "CodeForces",
                url: "https://codeforces.com/profile/absolutabhay",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path d="M4.5 7.5A1.5 1.5 0 016 9v10.5a1.5 1.5 0 01-3 0V9a1.5 1.5 0 011.5-1.5z" fill="#EE3A3A"/>
                    <path d="M10.5 3A1.5 1.5 0 0112 4.5v15a1.5 1.5 0 01-3 0v-15A1.5 1.5 0 0110.5 3z" fill="#1F8ACB"/>
                    <path d="M16.5 10.5A1.5 1.5 0 0118 12v7.5a1.5 1.5 0 01-3 0V12a1.5 1.5 0 011.5-1.5z" fill="#EE3A3A"/>
                  </svg>
                ),
              },
              {
                label: "LeetCode",
                url: "https://leetcode.com/u/absolutabhay/",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#FFA116">
                    <path d="M13.483 0a1.374 1.374 0 00-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 00-1.209 2.104 5.35 5.35 0 00-.125.513 5.527 5.527 0 00.062 2.362 5.83 5.83 0 00.349 1.017 5.938 5.938 0 001.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 00-1.951-.003l-2.396 2.392a3.021 3.021 0 01-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 01.066-.523 2.545 2.545 0 01.619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 00-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0013.483 0zm-2.866 12.815a1.38 1.38 0 00-1.38 1.382 1.38 1.38 0 001.38 1.382H20.79a1.38 1.38 0 001.38-1.382 1.38 1.38 0 00-1.38-1.382z"/>
                  </svg>
                ),
              },
              {
                label: "Kaggle",
                url: "https://www.kaggle.com/abhayondata",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#20BEFF">
                    <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.28.18.022.098-.02.18-.14.26l-6.851 6.827 7.157 8.488c.094.14.12.227.095.319z"/>
                  </svg>
                ),
              },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => window.open(chip.url, "_blank", "noopener,noreferrer")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2C2C2A] hover:bg-accent border border-white/10 hover:border-orange-700 text-muted-foreground hover:text-foreground text-sm transition-all duration-200"
              >
                {chip.icon}
                <span className="hidden md:inline">{chip.label}</span>
              </button>
            ))}
          </div>
          )}
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