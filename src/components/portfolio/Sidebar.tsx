import { useEffect, useState } from "react";
import {
  SquarePen,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Briefcase,
  Code,
  Trophy,
  FolderKanban,
  Mail,
} from "lucide-react";

interface SidebarProps {
  onNewChat: () => void;
  onSelectSection: (section: string) => void;
  activeSection: string | null;
  chatHistory: string[];
  onSelectChat: (chatId: string) => void;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const portfolioSections = [
  { id: "about", label: "About Me", icon: User },
  { id: "experience", label: "My Experience", icon: Briefcase },
  { id: "skills", label: "My Skills", icon: Code },
  { id: "achievements", label: "My Achievements", icon: Trophy },
  { id: "projects", label: "My Projects", icon: FolderKanban },
  { id: "contact", label: "Contact Me", icon: Mail },
];


const Sidebar = ({ onNewChat, onSelectSection, activeSection, chatHistory, onSelectChat, isCollapsed, onCollapsedChange }: SidebarProps) => {
  const setIsCollapsed = onCollapsedChange;

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onCollapsedChange(true);
    }
  }, []);

  return (
    <>
      {/* Mobile: floating hamburger — fades in when sidebar is collapsed */}
      <button
        className={`md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-all duration-300 ease-in-out ${
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
        Desktop → static; width animates between w-16 and w-64
      */}
      <div
        className={`
          fixed md:static left-0 top-0 z-50 md:z-auto
          h-screen bg-sidebar flex flex-col border-r border-sidebar-border
          overflow-hidden flex-shrink-0
          transition-all duration-300 ease-in-out
          ${isCollapsed
            ? "-translate-x-full md:translate-x-0 w-64 md:w-16"
            : "translate-x-0 w-64"
          }
        `}
      >
        {/* Header */}
        <div className="relative flex items-center p-3 h-[52px] flex-shrink-0">
          {/* Menu icon — cross-fades in for desktop collapsed state */}
          <button
            className={`absolute left-3 p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-all duration-200 ${
              isCollapsed ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsCollapsed(false)}
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>

          {/* Close + new-chat — cross-fades in when expanded */}
          <div
            className={`flex items-center justify-between w-full transition-all duration-200 ${
              isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <button
              onClick={() => setIsCollapsed(true)}
              className="px-2 py-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground text-base font-semibold tracking-tight"
            >
              Abhay Agarwal
            </button>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar body — fades out when collapsing so text doesn't peek out */}
        <div
          className={`flex flex-col flex-1 min-h-0 transition-opacity duration-150 ease-in-out ${
            isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* New Chat Button */}
          <div className="px-3 mb-2">
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <SquarePen className="w-4 h-4" />
              <span>New chat</span>
            </button>
          </div>

          {/* Search */}
          <div className="px-3 space-y-0.5 mb-4">
            <button
              onClick={() => onSelectChat("search")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search chats</span>
            </button>
          </div>

          {/* Your Chats Section */}
          <div className="flex-1 overflow-y-auto px-3">
            <div className="text-xs text-sidebar-muted px-3 py-2 font-medium">Your chats</div>
            <div className="space-y-0.5">
              {portfolioSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => onSelectSection(section.id)}
                  className={`section-link w-full ${activeSection === section.id ? "bg-sidebar-accent" : ""}`}
                >
                  <section.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{section.label}</span>
                </button>
              ))}
            </div>

            {chatHistory.length > 0 && (
              <>
                <div className="text-xs text-sidebar-muted px-3 py-2 mt-4 font-medium">Recent</div>
                <div className="space-y-0.5">
                  {chatHistory.map((chat, index) => (
                    <button
                      key={index}
                      onClick={() => onSelectChat(chat)}
                      className="section-link w-full"
                    >
                      <span className="truncate">{chat}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <div className="p-3 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-medium flex-shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-sidebar-foreground truncate">Abhay Agarwal</div>
                <div className="text-xs text-sidebar-muted">Personal account</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
