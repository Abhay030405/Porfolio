import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import WelcomeAnswer from "./WelcomeAnswer";
import type { WelcomeContent } from "@/portfolio/types";

const welcome: WelcomeContent = {
  greeting: "Welcome to Abhay's portfolio.",
  intro: ["I'm an **AI engineer**."],
  prompt: "What would you like to know?",
  topics: [
    { tool: "experience", label: "Experience", description: "roles and teams" },
    { tool: "projects", label: "Projects", description: "" },
  ],
  resume: { text: "Short on time?", label: "Read my resume" },
  linksLabel: "Elsewhere:",
  links: [{ label: "GitHub", url: "https://github.com/Abhay030405" }],
};

describe("WelcomeAnswer", () => {
  it("opens a topic, the resume, and links out", () => {
    const onOpenTopic = vi.fn();
    const onOpenResume = vi.fn();
    render(<WelcomeAnswer data={welcome} onOpenTopic={onOpenTopic} onOpenResume={onOpenResume} />);

    fireEvent.click(screen.getByRole("button", { name: "Experience - roles and teams" }));
    expect(onOpenTopic).toHaveBeenCalledWith("experience");
    // No description → just the label
    fireEvent.click(screen.getByRole("button", { name: "Projects" }));
    expect(onOpenTopic).toHaveBeenCalledWith("projects");

    fireEvent.click(screen.getByRole("button", { name: "Read my resume" }));
    expect(onOpenResume).toHaveBeenCalled();

    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/Abhay030405");
    expect(screen.getByText("AI engineer").tagName).toBe("STRONG");
  });
});
