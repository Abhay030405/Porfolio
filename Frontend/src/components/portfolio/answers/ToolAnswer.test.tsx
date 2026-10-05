import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ToolAnswer from "./ToolAnswer";

const skills = {
  opener: "My skills",
  quote: "",
  languagesHeading: "Languages",
  languages: [{ emoji: "🐍", name: "Python", level: "Advanced", codeLanguage: "python", snippet: 'print("hi")' }],
  groups: [
    {
      heading: "Web",
      intro: "",
      codeLanguage: "code",
      lines: ["Backend: Node.js, REST APIs & GraphQL", "Problem Solving     - Break problems down"],
    },
  ],
};

describe("ToolAnswer", () => {
  it("shows which tool ran and how it was chosen", () => {
    render(<ToolAnswer tool="skills" data={skills} trace={{ routedBy: "jev", confidence: 0.93 }} />);
    const trace = screen.getByRole("button", { name: /Used the skills tool, read 2 skill groups/ });
    fireEvent.click(trace);
    expect(screen.getByText("Jev · 93% confident")).toBeTruthy();
    expect(screen.getByText("Portfolio database")).toBeTruthy();
  });

  it("turns skill lines into chips and definitions", () => {
    render(<ToolAnswer tool="skills" data={skills} />);
    for (const chip of ["Node.js", "REST APIs", "GraphQL"]) expect(screen.getByText(chip)).toBeTruthy();
    expect(screen.getByText("Backend")).toBeTruthy();
    expect(screen.getByText("Problem Solving")).toBeTruthy();
    expect(screen.getByText('print("hi")')).toBeTruthy();
    // No trace in the admin preview
    expect(screen.queryByText(/Used the skills tool/)).toBeNull();
  });

  it("numbers achievements and labels problem and solution", () => {
    render(
      <ToolAnswer
        tool="achievements"
        data={{
          opener: "Wins",
          entries: [{ title: "Robo-Wars", recognition: "Winner — BotRush 2025", images: [], problem: "Robots break", solution: "We built a tank" }],
        }}
      />,
    );
    expect(screen.getByText("01")).toBeTruthy();
    expect(screen.getByText("Winner — BotRush 2025")).toBeTruthy();
    expect(screen.getByText("Problem")).toBeTruthy();
    expect(screen.getByText("We built a tank")).toBeTruthy();
  });

  it("links contact addresses and copies the email", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(
      <ToolAnswer
        tool="contact"
        data={{
          opener: "Hi",
          quote: "",
          pitch: "",
          email: "me@example.com",
          emailNote: "",
          linkGroups: [{ emoji: "🔗", title: "Networks", links: [{ label: "GitHub", value: "github.com/me" }] }],
          openTo: [],
          closingQuote: "",
        }}
      />,
    );
    expect(screen.getByText("GitHub").closest("a")?.getAttribute("href")).toBe("https://github.com/me");
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("me@example.com");
    expect(await screen.findByText("Copied")).toBeTruthy();
  });

  it("opens a project from its card", () => {
    const onOpenProject = vi.fn();
    render(
      <ToolAnswer
        tool="projects"
        data={[{ id: "1", showInSidebar: true, name: "QueueLens", description: "Kafka lag", meta: "2nd place", chats: [], artifacts: [] }]}
        onOpenProject={onOpenProject}
      />,
    );
    fireEvent.click(screen.getByText("QueueLens"));
    expect(onOpenProject).toHaveBeenCalledWith("QueueLens");
  });
});
