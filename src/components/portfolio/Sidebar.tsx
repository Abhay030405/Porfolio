import { useEffect, useState } from "react";
import {
  SquarePen,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
  MoreVertical,
} from "lucide-react";

interface SidebarProps {
  onNewChat: () => void;
  chatHistory: string[];
  onSelectChat: (chatId: string) => void;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const Sidebar = ({ onNewChat, chatHistory, onSelectChat, isCollapsed, onCollapsedChange }: SidebarProps) => {
  const setIsCollapsed = onCollapsedChange;
  const [selectedRecent, setSelectedRecent] = useState<number | null>(null);

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

          {/* Recents Section */}
          <div className="flex-1 overflow-y-auto px-3">
            {chatHistory.length > 0 && (
              <>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-sidebar-muted font-medium">Recents</span>
                  <button className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-muted transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  {chatHistory.map((chat, index) => {
                    const isSelected = selectedRecent === index;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedRecent(index);
                          onSelectChat(chat);
                        }}
                        className={`group w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isSelected
                            ? "bg-[#121212] text-white"
                            : "text-sidebar-foreground/80 hover:bg-[#121212] hover:text-white"
                        }`}
                      >
                        <span className="truncate">{chat}</span>
                        <MoreVertical
                          className={`w-4 h-4 flex-shrink-0 transition-opacity ${
                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        />
                      </button>
                    );
                  })}
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
