import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import AdminPage from "@/pages/AdminPage";

const experience = {
  opener: "Opener line",
  heading: "My Experience",
  intro: "Intro",
  quote: "",
  entries: [
    {
      emoji: "🤖",
      title: "Software Development Intern",
      period: "2026",
      organization: "Acme Labs",
      location: "Remote",
      tagline: "",
      images: [],
      summary: "",
      bullets: ["Shipped the thing"],
      techStack: "Go",
      quote: "",
    },
  ],
};

const entry = {
  id: "experience",
  kind: "experience",
  sortOrder: 0,
  showInSidebar: true,
  published: experience,
  draft: null,
  draftSource: null,
  draftDocument: null,
  updatedAt: "2026-10-05T10:00:00Z",
  publishedAt: "2026-10-05T10:00:00Z",
};

const respond = (status: number, body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));

function mockApi(loggedIn: boolean) {
  let session = loggedIn;
  const calls: { url: string; init?: RequestInit }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string, init?: RequestInit) => {
      calls.push({ url, init });
      if (url.endsWith("/api/auth/me")) return session ? respond(200, { admin: true }) : respond(401, { admin: false });
      if (url.endsWith("/api/auth/login")) {
        const ok = JSON.parse(String(init?.body)).password === "correct horse";
        session = ok;
        return ok ? respond(200, { ok: true }) : respond(401, { error: "Wrong password" });
      }
      if (url.endsWith("/api/admin/entries/experience")) return respond(200, entry);
      if (url.endsWith("/api/admin/entries/experience/publish")) {
        return respond(200, { ...entry, published: JSON.parse(String(init?.body)).data });
      }
      if (url.endsWith("/api/portfolio")) return respond(200, { sections: {}, projects: [] });
      return respond(404, { error: "Not found" });
    }),
  );
  return calls;
}

const renderAdmin = () =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={["/abhay20245003e"]}>
        <AdminPage kind="experience" />
      </MemoryRouter>
    </QueryClientProvider>,
  );

afterEach(() => vi.unstubAllGlobals());

describe("AdminPage", () => {
  it("asks for the password and rejects a wrong one", async () => {
    mockApi(false);
    renderAdmin();
    const input = await screen.findByLabelText("Password");
    fireEvent.change(input, { target: { value: "nope" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByText("Wrong password")).toBeTruthy();
  });

  it("logs in, shows the template form and a live preview, and publishes edits", async () => {
    const calls = mockApi(false);
    renderAdmin();
    fireEvent.change(await screen.findByLabelText("Password"), { target: { value: "correct horse" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    // Editor with published status and the preview rendered by the site's own ChatMessage
    expect(await screen.findByText(/^Published/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Write it myself/ }));
    await waitFor(() => expect(document.body.textContent).toContain("Shipped the thing"));

    // Edit the opening line; the preview follows
    const opener = screen.getByDisplayValue("Opener line");
    fireEvent.change(opener, { target: { value: "Edited opener" } });
    await waitFor(() => expect(document.body.textContent).toContain("Edited opener"));
    expect(screen.getByText("Unsaved changes")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    expect(await screen.findByText(/it's live on the site/)).toBeTruthy();
    const publish = calls.find((c) => c.url.endsWith("/publish"));
    expect(JSON.parse(String(publish?.init?.body)).data.opener).toBe("Edited opener");
    expect(publish?.init?.credentials).toBe("include");
  });
});
