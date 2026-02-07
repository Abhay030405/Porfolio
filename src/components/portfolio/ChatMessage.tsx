import { useState, useEffect } from "react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  section?: string;
  images?: string[];
}

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

const ChatMessage = ({ message, isLatest = false }: ChatMessageProps) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Typing animation effect
  useEffect(() => {
    if (message.type === "assistant" && isLatest && !isTypingComplete) {
      let currentIndex = 0;
      setDisplayedContent("");
      
      const typingInterval = setInterval(() => {
        if (currentIndex < message.content.length) {
          setDisplayedContent(message.content.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTypingComplete(true);
          clearInterval(typingInterval);
        }
      }, 0.5); // Adjust speed here (lower = faster)

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedContent(message.content);
      setIsTypingComplete(true);
    }
  }, [message.content, message.type, isLatest]);

  const formatContent = (content: string) => {
    // Process the content line by line for better control
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';
    let result: string[] = [];

    // Helper function to render inline images
    const renderImageGrid = (imageUrls: string[]): string => {
      const gridClass = imageUrls.length === 1 ? 'grid-cols-1' :
                        imageUrls.length === 2 ? 'grid-cols-2' :
                        'grid-cols-2';
      
      const imageElements = imageUrls.map((url, index) => `
        <div class="relative group overflow-hidden rounded-xl border border-border bg-muted hover:border-primary/50 transition-all duration-200 cursor-pointer">
          <img
            src="${url.trim()}"
            alt="Project screenshot ${index + 1}"
            class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
        </div>
      `).join('');

      return `<div class="my-4 grid gap-2 ${gridClass}">${imageElements}</div>`;
    };

    lines.forEach((line, index) => {
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
          <div class="my-4 rounded-lg overflow-hidden bg-[#1e1e1e] border border-border">
            <div class="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
              <span class="text-xs text-muted-foreground">${codeLanguage}</span>
              <button class="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy code
              </button>
            </div>
            <pre class="p-4 overflow-x-auto"><code class="text-sm font-mono text-[#d4d4d4]">${codeContent.trim()}</code></pre>
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

      // H2 Headers (## Header or **Header:**)
      if (line.startsWith('## ')) {
        result.push(`<h2 class="text-xl font-semibold text-foreground mt-8 mb-4">${line.slice(3)}</h2>`);
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
        <div className="user-message max-w-md">
          <p className="text-foreground text-sm">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium flex-shrink-0">
        A
      </div>
      <div className="message-bubble assistant-message flex-1 pt-1">
        <div
          className="text-[15px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatContent(displayedContent) }}
        />
      </div>
    </div>
  );
};

export default ChatMessage;