import { useState } from "react";
import {
  SquarePen,
  Search,
  PanelLeftClose,
  Menu,
  User,
  Briefcase,
  Code,
  Trophy,
  FileText,
  FolderKanban,
  Mail,
  Linkedin,
  Github,
  Download,
} from "lucide-react";

interface SidebarProps {
  onNewChat: () => void;
  onSelectSection: (section: string) => void;
  activeSection: string | null;
  chatHistory: string[];
  onSelectChat: (chatId: string) => void;
}

const portfolioSections = [
  { id: "about", label: "About Me", icon: User },
  { id: "experience", label: "My Experience", icon: Briefcase },
  { id: "skills", label: "My Skills", icon: Code },
  { id: "achievements", label: "My Achievements", icon: Trophy },
  { id: "research", label: "My Research Progress", icon: FileText },
  { id: "projects", label: "My Projects", icon: FolderKanban },
  { id: "contact", label: "Contact Me", icon: Mail },
];

const socialLinks = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/abhay-agarwal-8563352b1/" },
  { id: "github", label: "GitHub", icon: Github, url: "https://github.com/Abhay030405" },
  { id: "codeforces", label: "CodeForces", icon: Code, url: "https://codeforces.com/profile/absolutabhay" },
  { id: "leetcode", label: "LeetCode", icon: Code, url: "https://leetcode.com/u/absolutabhay/" },
  { id: "kaggle", label: "Kaggle", icon: Code, url: "https://www.kaggle.com/abhayondata" },
];

const CodeForcesIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M4.5 7.5A1.5 1.5 0 016 9v10.5a1.5 1.5 0 01-3 0V9a1.5 1.5 0 011.5-1.5zm6-4.5A1.5 1.5 0 0112 4.5v15a1.5 1.5 0 01-3 0v-15a1.5 1.5 0 011.5-1.5zm6 7.5a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-3 0V12a1.5 1.5 0 011.5-1.5z" />
  </svg>
);

const LeetCodeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M13.483 0a1.374 1.374 0 00-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 00-1.209 2.104 5.35 5.35 0 00-.125.513 5.527 5.527 0 00.062 2.362 5.83 5.83 0 00.349 1.017 5.938 5.938 0 001.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 00-1.951-.003l-2.396 2.392a3.021 3.021 0 01-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 01.066-.523 2.545 2.545 0 01.619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 00-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0013.483 0zm-2.866 12.815a1.38 1.38 0 00-1.38 1.382 1.38 1.38 0 001.38 1.382H20.79a1.38 1.38 0 001.38-1.382 1.38 1.38 0 00-1.38-1.382z" />
  </svg>
);

const KaggleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.28.18.022.098-.02.18-.14.26l-6.851 6.827 7.157 8.488c.094.14.12.227.095.319z" />
  </svg>
);

const Sidebar = ({ onNewChat, onSelectSection, activeSection, chatHistory, onSelectChat }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  const handleSocialClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadResume = () => {
    window.open("https://drive.google.com/drive/folders/1ZEBNjCnFSacDxsSu5aGypGHWaXoZ0Mal?usp=sharing", "_blank", "noopener,noreferrer");
  };

  const getSocialIcon = (id: string) => {
    switch (id) {
      case "codeforces": return <CodeForcesIcon />;
      case "leetcode": return <LeetCodeIcon />;
      case "kaggle": return <KaggleIcon />;
      default: return null;
    }
  };

  return (
    <>
      {/* Mobile: floating hamburger — fades in when sidebar is collapsed */}
      <button
        className={`md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-all duration-300 ease-in-out ${
          isCollapsed ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCollapsed(false)}
      >
        <Menu className="w-5 h-5" />
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
            <Menu className="w-5 h-5" />
          </button>

          {/* Close + new-chat — cross-fades in when expanded */}
          <div
            className={`flex items-center justify-between w-full transition-all duration-200 ${
              isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
            <button
              onClick={onNewChat}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
            >
              <SquarePen className="w-5 h-5" />
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

          {/* Search & Social Links */}
          <div className="px-3 space-y-0.5 mb-4">
            <button
              onClick={() => onSelectChat("search")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search chats</span>
            </button>
            {socialLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleSocialClick(link.url)}
                className="social-link w-full"
              >
                {link.id === "linkedin" && <Linkedin className="w-4 h-4" />}
                {link.id === "github" && <Github className="w-4 h-4" />}
                {getSocialIcon(link.id)}
                <span>{link.label}</span>
              </button>
            ))}
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

          {/* Download Resume */}
          <div className="px-3 py-2 border-t border-sidebar-border">
            <button
              onClick={handleDownloadResume}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Resume</span>
            </button>
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
