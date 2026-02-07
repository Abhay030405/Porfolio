import { useState } from "react";
import {
  SquarePen,
  Search,
  PanelLeftClose,
  PanelLeft,
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

// Custom icons for platforms without Lucide icons
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSocialClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadResume = () => {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = '/resume_abhay.pdf';
    link.download = 'Abhay_Agarwal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSocialIcon = (id: string) => {
    switch (id) {
      case "codeforces":
        return <CodeForcesIcon />;
      case "leetcode":
        return <LeetCodeIcon />;
      case "kaggle":
        return <KaggleIcon />;
      default:
        return null;
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-sidebar h-screen flex flex-col items-center py-3 border-r border-sidebar-border">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onNewChat}
          className="mt-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
        >
          <SquarePen className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-sidebar h-screen flex flex-col border-r border-sidebar-border">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
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

        {/* Dynamic Chat History */}
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
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-medium">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-sidebar-foreground truncate">Abhay Agarwal</div>
            <div className="text-xs text-sidebar-muted">Personal account</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;