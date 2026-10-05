import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/portfolio/Sidebar";
import ChatArea from "@/components/portfolio/ChatArea";
import ProjectsPage from "@/components/portfolio/ProjectsPage";
import ProjectDetailPage from "@/components/portfolio/ProjectDetailPage";
import { projectSlug } from "@/components/portfolio/sidebarProjects";
import { useProjects, useWelcome } from "@/portfolio/usePortfolio";

const DEFAULT_RECENTS = [
  "Tell me about Abhay Agarwal and his background",
  "Give me a full skills overview of his tech stack",
  "Walk me through his professional experience and journey",
  "How can I get in touch or contact him directly",
  "Take me on a deep dive into his personal projects",
  "What are some of his biggest achievements and awards",
];

const Index = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<string[]>(DEFAULT_RECENTS);
  const [chatKey, setChatKey] = useState(0);
  const [containerHeight, setContainerHeight] = useState<string>("100dvh");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [resumeSignal, setResumeSignal] = useState(0);
  const [externalQuery, setExternalQuery] = useState<{ id: number; text: string } | null>(null);
  const instantSectionRef = useRef(false);

  /*
   * The URL decides what covers the chat: /projects shows the grid,
   * /project/<slug> shows that project's page, / shows the chat. The same
   * Index element renders for all three routes, so the chat stays mounted.
   */
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const showProjects = location.pathname === "/projects";
  const { allProjects } = useProjects();
  const { welcome, isLoading: welcomeLoading } = useWelcome();
  const projectPage = slug ? allProjects.find((p) => projectSlug(p.name) === slug) : undefined;

  const showChat = () => {
    if (location.pathname !== "/") navigate("/");
  };

  // Visual Viewport API — keeps layout above keyboard on iOS Safari
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      setContainerHeight(`${viewport.height + viewport.offsetTop}px`);
    };

    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    update();

    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  const handleNewChat = () => {
    showChat();
    setExternalQuery(null);
    setActiveSection(null);
    setChatKey((prev) => prev + 1);
  };

  const handleOpenProjects = () => navigate("/projects");

  const handleOpenProject = (name: string) => navigate(`/project/${projectSlug(name)}`);

  // "New session in <project>" — a fresh chat that starts with the typed question
  const handleStartProjectChat = (text: string) => {
    showChat();
    setActiveSection(null);
    setExternalQuery({ id: Date.now(), text });
    setChatKey((prev) => prev + 1);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleAddToHistory = (query: string) => {
    if (query && !chatHistory.includes(query)) {
      setChatHistory((prev) => [query, ...prev].slice(0, 10));
    }
  };

  const handleSelectChat = (chatId: string) => {
    if (chatId === "search") return;
    const knownSections = ["about", "experience", "skills", "achievements", "projects", "contact"];
    const matched = knownSections.find((key) => chatId.toLowerCase().includes(key));
    if (matched) {
      showChat();
      // Reset to null first so useEffect in ChatArea always fires, even for the same section
      instantSectionRef.current = true;
      setActiveSection(null);
      setTimeout(() => setActiveSection(matched), 10);
    }
  };

  return (
    <div className="flex overflow-hidden bg-background" style={{ height: containerHeight }}>
      <Sidebar
        onNewChat={handleNewChat}
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        onViewResume={() => setResumeSignal((prev) => prev + 1)}
        onOpenProjects={handleOpenProjects}
        onOpenProject={handleOpenProject}
        activeProject={projectPage?.name ?? null}
      />
      {/*
        The projects page covers the chat rather than replacing it, so the
        conversation is still there when the visitor comes back.
      */}
      <div className="relative flex flex-1 min-w-0">
        <ChatArea
          key={chatKey}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onAddToHistory={handleAddToHistory}
          onCollapseSidebar={() => setSidebarCollapsed(true)}
          instantSectionRef={instantSectionRef}
          resumeSignal={resumeSignal}
          sidebarCollapsed={sidebarCollapsed}
          externalQuery={externalQuery}
          welcome={welcome}
          welcomeLoading={welcomeLoading}
        />
        {showProjects && (
          <div className="absolute inset-0 z-30 bg-background">
            <ProjectsPage onOpenProject={handleOpenProject} />
          </div>
        )}
        {projectPage && (
          <div className="absolute inset-0 z-30 bg-background">
            <ProjectDetailPage
              key={projectPage.name}
              project={projectPage}
              onOpenProjects={handleOpenProjects}
              onOpenProject={handleOpenProject}
              onStartChat={handleStartProjectChat}
              sidebarCollapsed={sidebarCollapsed}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
