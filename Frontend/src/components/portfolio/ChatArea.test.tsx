import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChatArea from "./ChatArea";

vi.mock("react-pdf", () => ({ Document: () => null, Page: () => null, pdfjs: { GlobalWorkerOptions: {} } }));
// jsdom has no layout, so no scrolling
Element.prototype.scrollIntoView = () => {};

const experience = {
  opener: "Here's my journey",
  heading: "My Experience",
  intro: "Intro",
  quote: "",
  entries: [
    {
      emoji: "🤖",
      title: "Intern",
      period: "2026",
      organization: "Acme Labs",
      location: "",
      tagline: "",
      images: [],
      summary: "",
      bullets: ["Shipped the database-backed thing"],
      techStack: "",
      quote: "",
    },
  ],
};

const renderChat = (activeSection: string | null = null) =>
  render(
    <MemoryRouter>
      <ChatArea
        activeSection={activeSection}
        onSectionChange={() => {}}
        onAddToHistory={() => {}}
        onCollapseSidebar={() => {}}
      />
    </MemoryRouter>,
  );

const typeQuestion = (text: string) => {
  const input = screen.getAllByRole("textbox")[0];
  fireEvent.change(input, { target: { value: text } });
  fireEvent.submit(input.closest("form")!);
};

afterEach(() => vi.unstubAllGlobals());

describe("ChatArea tools", () => {
  it("sends a typed question to /api/chat and renders the tool Jev picked", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ tool: "experience", routedBy: "jev", confidence: 1, data: experience }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    renderChat();

    typeQuestion("where has he worked?");

    await waitFor(() => expect(document.body.textContent).toContain("Shipped the database-backed thing"), { timeout: 4000 });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/api\/chat$/);
    expect(JSON.parse(String(init.body))).toEqual({ query: "where has he worked?" });
  });

  it("calls the tool directly when a section is picked", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify({ tool: "experience", routedBy: "direct", confidence: null, data: experience }), { status: 200 })),
    );
    vi.stubGlobal("fetch", fetchMock);
    renderChat("experience");

    await waitFor(() => expect(document.body.textContent).toContain("Shipped the database-backed thing"), { timeout: 4000 });
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(String(init.body))).toEqual({ tool: "experience" });
  });

  it("says so when the backend can't be reached", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))));
    renderChat();

    typeQuestion("skills");

    await waitFor(() => expect(document.body.textContent).toContain("I can't reach my portfolio right now"), { timeout: 4000 });
  });
});
