import { useState, useEffect } from "react";
import Sidebar from "@/components/portfolio/Sidebar";
import ChatArea from "@/components/portfolio/ChatArea";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [chatKey, setChatKey] = useState(0);
  const [containerHeight, setContainerHeight] = useState<string>("100dvh");

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
    if (chatId === "search") {
      return;
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
      />
      <ChatArea
        key={chatKey}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onAddToHistory={handleAddToHistory}
      />
    </div>
  );
};

export default Index;
