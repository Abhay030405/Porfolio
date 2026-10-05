import { useState, useEffect } from "react";
import ToolAnswer from "./answers/ToolAnswer";
import type { Trace } from "./answers/ToolTrace";
import type { ToolName } from "@/portfolio/types";

/** Follow-up topics listed under an answer, minus the one just shown. */
const MORE_TOPICS = [
  { label: "About me - who I am and what drives me",     section: "about"        },
  { label: "Experience - roles, teams and what I built", section: "experience"   },
  { label: "Skills - languages, frameworks and tools I use", section: "skills"   },
  { label: "Achievements - milestones and recognition so far", section: "achievements" },
  { label: "Projects - things I've designed and shipped", section: "projects"    },
  { label: "Contact - the best ways to reach me",       section: "contact"      },
];

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

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
  onSectionChange?: (section: string) => void;
  onOpenProject?: () => void;
  /** Opens a project's page — the projects tool lists them from the database. */
  onOpenProjectPage?: (name: string) => void;
}

const CHARS_PER_SECOND = 400;

const TOOL_NAMES: ToolName[] = ["about", "experience", "skills", "achievements", "projects", "contact"];
const isToolName = (name: string): name is ToolName => (TOOL_NAMES as string[]).includes(name);

const ChatMessage = ({ message, isLatest = false, onSectionChange, onOpenProject, onOpenProjectPage }: ChatMessageProps) => {
  // A tool result renders as its own component; plain replies (help, errors) stream as text
  const toolAnswer =
    message.section && isToolName(message.section) && message.data !== undefined ? message.section : null;
  const isCustomSection = toolAnswer !== null;

  const [displayedContent, setDisplayedContent] = useState(
    message.type === "assistant" && isLatest && !message.instant && !isCustomSection ? "" : message.content
  );
  const [streamDone, setStreamDone] = useState(
    !(message.type === "assistant" && isLatest && !message.instant && !isCustomSection)
  );

  useEffect(() => {
    if (message.type !== "assistant" || !isLatest || message.instant || isCustomSection) {
      setDisplayedContent(message.content);
      setStreamDone(true);
      return;
    }

    setStreamDone(false);
    let rafId: number;
    let startTime: number | null = null;
    setDisplayedContent("");

    const step = (timestamp: number) => {
      startTime ??= timestamp;
      const charsToShow = Math.min(
        Math.floor(((timestamp - startTime) / 1000) * CHARS_PER_SECOND),
        message.content.length
      );
      setDisplayedContent(message.content.slice(0, charsToShow));
      if (charsToShow < message.content.length) {
        rafId = requestAnimationFrame(step);
      } else {
        setStreamDone(true);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [message.id]);

  const formatContent = (content: string) => {
    // Process the content line by line for better control
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';
    let result: string[] = [];

    // Helper function to render inline images
    const renderImageGrid = (imageUrls: string[]): string => {
      // A single image gets the full column; multiples flow into as many
      // tracks as fit, so the grid reshapes with the container rather than
      // locking to two columns on a narrow phone.
      const gridClass = imageUrls.length === 1
        ? 'grid-cols-1'
        : 'grid-cols-[repeat(auto-fit,minmax(min(11rem,100%),1fr))]';

      const imageElements = imageUrls.map((url) => `
        <div class="relative group overflow-hidden rounded-xl border border-border bg-muted hover:border-primary/50 transition-all duration-200 cursor-pointer">
          <img
            src="${url.trim()}"
            alt="Project screenshot"
            class="w-full aspect-[16/10] object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
        </div>
      `).join('');

      return `<div class="my-4 grid gap-2 ${gridClass}">${imageElements}</div>`;
    };

    lines.forEach((line) => {
      // Code block start
      if (line.startsWith('```') && !inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim() || 'code';
        codeContent = '';
        return;
      }

      // Code block end
      if (line.startsWith('```') && inCodeBlock) {
        inCodeBlock = false;
        result.push(`
          <div class="my-4 rounded-lg overflow-hidden bg-[#1e1e1e] border border-border max-w-full">
            <div class="flex items-center justify-between px-3 py-2 bg-[#2d2d2d] border-b border-border">
              <span class="text-xs text-muted-foreground">${codeLanguage}</span>
              <button class="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy code
              </button>
            </div>
            <pre class="p-3 overflow-x-auto text-xs md:text-sm"><code class="font-mono text-[#d4d4d4] whitespace-pre">${codeContent.trim()}</code></pre>
          </div>
        `);
        return;
      }

      // Inside code block
      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

      // Image syntax: [IMAGE:url1,url2,url3]
      const imageMatch = line.match(/\[IMAGE:(.+?)\]/);
      if (imageMatch) {
        const imageUrls = imageMatch[1].split(',');
        result.push(renderImageGrid(imageUrls));
        // Process any remaining text on the line
        const remainingText = line.replace(/\[IMAGE:.+?\]/, '').trim();
        if (remainingText) {
          result.push(`<p class="text-foreground leading-relaxed my-2">${formatInlineText(remainingText)}</p>`);
        }
        return;
      }

      // Horizontal rule
      if (line.trim() === '---' || line.trim() === '***') {
        result.push('<hr class="my-6 border-border" />');
        return;
      }

      // Numbered section headers (like "1️⃣ Header" or "🔬 Header")
      const numberedHeaderMatch = line.match(/^([🔢1️⃣2️⃣3️⃣4️⃣🔬💼🌐🤖📊📄🏆🎓🚀🏅📧🔗💬])\s*\*\*(.+?)\*\*$/);
      if (numberedHeaderMatch) {
        result.push(`
          <div class="flex items-center gap-2 mt-6 mb-3">
            <span class="text-base">${numberedHeaderMatch[1]}</span>
            <h3 class="text-lg font-semibold text-foreground">${numberedHeaderMatch[2]}</h3>
          </div>
        `);
        return;
      }

      // Regular headers with emoji
      const emojiHeaderMatch = line.match(/^([🔬💼🌐🤖📊📄🏆🎓🚀🏅📧🔗💬🐍💛⚡☕📚🤝])\s*(.+)$/);
      if (emojiHeaderMatch && !line.includes('•') && !line.startsWith('-')) {
        result.push(`
          <div class="flex items-start gap-2 mt-4">
            <span class="text-base">${emojiHeaderMatch[1]}</span>
            <span class="text-foreground">${formatInlineText(emojiHeaderMatch[2])}</span>
          </div>
        `);
        return;
      }

      // H2 Headers (## Header)
      if (line.startsWith('## ')) {
        result.push(`<h2 class="text-xl font-semibold text-foreground mt-8 mb-4">${line.slice(3)}</h2>`);
        return;
      }

      // H3 Headers (### Header) — used for project titles
      if (line.startsWith('### ')) {
        result.push(`<h3 class="text-2xl font-bold text-foreground mt-8 mb-3">${line.slice(4)}</h3>`);
        return;
      }

      // Bold headers ending with colon (like "**Programming Languages:**")
      const boldHeaderMatch = line.match(/^\*\*(.+?):\*\*$/);
      if (boldHeaderMatch) {
        result.push(`<h3 class="text-base font-semibold text-foreground mt-6 mb-2">${boldHeaderMatch[1]}:</h3>`);
        return;
      }

      // Standalone bold headers (like "**What drives me:**")
      const standaloneBoldMatch = line.match(/^\*\*(.+?)\*\*$/);
      if (standaloneBoldMatch && !line.includes(':')) {
        result.push(`<h3 class="text-lg font-semibold text-foreground mt-6 mb-3">${standaloneBoldMatch[1]}</h3>`);
        return;
      }

      // Blockquotes
      if (line.trim().startsWith('>')) {
        const quoteContent = line.trim().slice(1).trim();
        result.push(`
          <blockquote class="border-l-2 border-muted-foreground/30 pl-4 my-4 text-muted-foreground italic">
            ${formatInlineText(quoteContent)}
          </blockquote>
        `);
        return;
      }

      // Bullet points with • or -
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        const bulletContent = line.trim().slice(1).trim();
        result.push(`
          <li class="flex items-start gap-3 ml-2 my-1.5">
            <span class="text-muted-foreground mt-1.5 text-xs">•</span>
            <span class="text-foreground">${formatInlineText(bulletContent)}</span>
          </li>
        `);
        return;
      }

      // Empty lines
      if (line.trim() === '') {
        result.push('<div class="h-3"></div>');
        return;
      }

      // Regular paragraphs
      result.push(`<p class="text-foreground leading-relaxed my-2">${formatInlineText(line)}</p>`);
    });

    return result.join('');
  };

  const formatInlineText = (text: string): string => {
    return text
      // Bold text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      // Italic text
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-[#2d2d2d] text-[#e06c75] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      // Em dash
      .replace(/—/g, '—');
  };

  if (message.type === "user") {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="user-message max-w-[85%] md:max-w-[70%]">
          <p className="whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-foreground">{message.content}</p>
        </div>
      </div>
    );
  }

  const animate = isLatest && !message.instant;

  return (
    <div className="flex items-start animate-fade-in">
      <div className="message-bubble assistant-message flex-1 min-w-0">
        {toolAnswer ? (
          <ToolAnswer
            tool={toolAnswer}
            data={message.data}
            trace={message.trace}
            animate={animate}
            onOpenCaseStudy={onOpenProject}
            onOpenProject={onOpenProjectPage}
          />
        ) : (
          <div
            className="w-full overflow-hidden font-serif text-[1rem] md:text-[1.0625rem] leading-[1.75]"
            dangerouslySetInnerHTML={{ __html: formatContent(displayedContent) }}
          />
        )}
        {/* "Know more" — the other topics, listed like a reply's sources once the answer has landed */}
        {isLatest && streamDone && onSectionChange && (
          <div
            className={`mt-6 font-serif text-[1rem] md:text-[1.0625rem] leading-[1.75] ${
              animate && toolAnswer ? "animate-fade-in [animation-delay:500ms] [animation-fill-mode:both] motion-reduce:animate-none" : ""
            }`}
          >
            <p className="text-foreground">Want to know more?</p>
            <ul className="mt-2 space-y-1 pl-6">
              {MORE_TOPICS.filter((item) => item.section !== message.section).map((item) => (
                <li key={item.section} className="list-disc pl-1 marker:text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => onSectionChange(item.section)}
                    className="text-left text-[#7AA7FF] underline decoration-[#7AA7FF]/40 underline-offset-[0.2em] hover:decoration-[#7AA7FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7AA7FF]/40 rounded-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
