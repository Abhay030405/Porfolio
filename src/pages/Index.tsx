import { useState } from "react";
import Sidebar from "@/components/portfolio/Sidebar";
import ChatArea from "@/components/portfolio/ChatArea";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [chatKey, setChatKey] = useState(0);

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
      // Could implement search functionality
      return;
    }
    // Handle chat history selection
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
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