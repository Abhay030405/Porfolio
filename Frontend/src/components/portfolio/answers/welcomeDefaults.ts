import type { WelcomeContent } from "@/portfolio/types";

type Topic = WelcomeContent["topics"][number];

/** The six sections, for when the published welcome hasn't loaded. */
export const DEFAULT_TOPICS: Topic[] = [
  { tool: "about", label: "About me", description: "who I am and what drives me" },
  { tool: "experience", label: "Experience", description: "roles, teams and what I built" },
  { tool: "projects", label: "Projects", description: "things I've designed and shipped" },
  { tool: "skills", label: "Skills", description: "languages, frameworks and tools I use" },
  { tool: "achievements", label: "Achievements", description: "milestones and recognition so far" },
  { tool: "contact", label: "Contact", description: "the best ways to reach me" },
];

/** Shown when the published welcome can't be loaded — no portfolio facts, just the way in. */
export const FALLBACK_WELCOME: WelcomeContent = {
  greeting: "Welcome to Abhay Agarwal's portfolio.",
  intro: [],
  prompt: "What would you like to know?",
  topics: DEFAULT_TOPICS,
  resume: { text: "Short on time?", label: "Read my resume" },
  linksLabel: "",
  links: [],
};

/** The reply to a question no tool fits: the same topic links, nothing else. */
export const helpWelcome = (topics: Topic[]): WelcomeContent => ({
  greeting: "",
  intro: ["I'm not sure what you're looking for. Try one of these:"],
  prompt: "",
  topics,
  resume: { text: "", label: "" },
  linksLabel: "",
  links: [],
});
