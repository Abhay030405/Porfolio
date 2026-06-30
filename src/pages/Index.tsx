import { useState, useEffect } from "react";
import Sidebar from "@/components/portfolio/Sidebar";
import ChatArea from "@/components/portfolio/ChatArea";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [chatKey, setChatKey] = useState(0);
  const [containerHeight, setContainerHeight] = useState<string>("100dvh");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    setActiveSection(null);
    setChatKey((prev) => prev + 1);
  };

  const handleSelectSection = (section: string) => {
    setActiveSection(section);
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
      // Reset to null first so useEffect in ChatArea always fires, even for the same section
      setActiveSection(null);
      setTimeout(() => setActiveSection(matched), 10);
    }
  };

  return (
    <div className="flex overflow-hidden bg-background" style={{ height: containerHeight }}>
      <Sidebar
        onNewChat={handleNewChat}
        onSelectSection={handleSelectSection}
        activeSection={activeSection}
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <ChatArea
        key={chatKey}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onAddToHistory={handleAddToHistory}
        onCollapseSidebar={() => setSidebarCollapsed(true)}
      />
    </div>
  );
};

export default Index;
