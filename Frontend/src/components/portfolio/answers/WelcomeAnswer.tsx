import type { WelcomeContent } from "@/portfolio/types";
import { Heading, Lead, LinkList, Para, Stack, textLink } from "./primitives";

/*
 * The first message in the chat: who Abhay is, then the sections to open,
 * the resume and the outside links. Not a tool result — it points at them.
 */

interface WelcomeAnswerProps {
  data: WelcomeContent;
  animate?: boolean;
  onOpenTopic?: (tool: string) => void;
  onOpenResume?: () => void;
}

const WelcomeAnswer = ({ data, animate = false, onOpenTopic, onOpenResume }: WelcomeAnswerProps) => {
  const links = data.links.filter((l) => l.label.trim() && l.url.trim());
  return (
    <Stack animate={animate} gap="gap-4">
      {data.greeting.trim() && <Heading>{data.greeting}</Heading>}
      {data.intro.map((paragraph, i) => (i === 0 ? <Lead key={i} text={paragraph} /> : <Para key={i} text={paragraph} />))}
      {data.prompt.trim() && <Para text={data.prompt} />}
      <LinkList
        items={data.topics.map((topic) => ({
          key: topic.tool + topic.label,
          label: topic.description.trim() ? `${topic.label} - ${topic.description}` : topic.label,
          onClick: () => onOpenTopic?.(topic.tool),
        }))}
      />
      {data.resume.label.trim() && (
        <p className="font-serif text-[1rem] md:text-[1.0625rem] leading-[1.75] text-foreground/90">
          {data.resume.text.trim() && <>{data.resume.text} </>}
          <button type="button" onClick={onOpenResume} className={textLink}>
            {data.resume.label}
          </button>
        </p>
      )}
      {links.length > 0 && (
        <p className="font-serif text-[1rem] md:text-[1.0625rem] leading-[1.75] text-foreground/90">
          {data.linksLabel.trim() && <>{data.linksLabel} </>}
          {links.map((link, i) => (
            <span key={link.url}>
              {i > 0 && <span className="text-muted-foreground"> · </span>}
              <a href={link.url} target="_blank" rel="noopener noreferrer" className={textLink}>
                {link.label}
              </a>
            </span>
          ))}
        </p>
      )}
    </Stack>
  );
};

export default WelcomeAnswer;
