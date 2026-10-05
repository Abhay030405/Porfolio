# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

An interactive developer portfolio for Abhay Agarwal, presented as a
ChatGPT-style chat interface. Visitors pick a topic (about, experience, skills,
achievements, projects, contact) from a sidebar or type a query, and the "chat"
streams back portfolio content. Live at https://itsabhay.me/

## Repository layout

```
GPT_Portfolio/
├── Frontend/     React + TypeScript + Vite app (the site and the admin pages)
├── Backend/      Hono API: published content, admin editing + AI drafts (see Backend/README.md)
├── README.md     Public-facing project README
└── CLAUDE.md     This file
```

`Frontend/` and `Backend/` are independent projects. Each owns its dependency
manifest and lockfile; nothing imports across the boundary, so the content
templates exist twice: `Backend/src/content/schemas.ts` (zod) and
`Frontend/src/portfolio/types.ts` — change both together. Commands below run
from inside `Frontend/`; the backend has its own in `Backend/README.md`.

## Commands

```sh
cd Frontend
npm install
npm run dev        # Vite dev server on http://localhost:8080
npm run build      # production build to Frontend/dist
npm run build:dev  # build in development mode
npm run preview    # serve the production build
npm run lint       # ESLint
npm run test       # vitest, single run
npm run test:watch # vitest in watch mode
```

Note the dev server is on **port 8080**, not Vite's default 5173
(`Frontend/vite.config.ts`).

## Frontend architecture

### Routing

`src/App.tsx` wires providers (react-query, tooltip, two toasters) and
`BrowserRouter`. Routes:

| Path                     | Component            |
| ------------------------ | -------------------- |
| `/`                      | `pages/Index.tsx`    |
| `/projects`              | `pages/Index.tsx` (projects grid over the chat) |
| `/project/:slug`         | `pages/Index.tsx` (project page over the chat)  |
| `/project/provenlane`    | `pages/ProvenLane`   |
| `/project/switchboard`   | `pages/Switchboard`  |
| `/abhay20245003{p,e,s,a,h,c,w}` | `pages/AdminPage` (lazy) — private editors for projects, experience, skills, about, achievements, contact, welcome |
| `*`                      | `pages/NotFound`     |

`ProvenLane` and `Switchboard` are placeholder stubs. Custom routes must be
added **above** the catch-all `*` route. The admin routes come from
`src/admin/adminRoutes.ts`; their paths are unlisted, not secret — the backend
session check is the real protection.

### The chat surface

The frontend holds **no portfolio content** — it all lives in the database,
edited on the admin pages. Every chat answer is a **tool call**:

1. A typed question goes to `POST /api/chat { query }`; the backend asks Jev
   which of the six tools (`about`, `experience`, `skills`, `achievements`,
   `projects`, `contact`) answers it. A sidebar pick or nav chip sends
   `{ tool }` and skips Jev.
2. The tool reads its published content from the DB and the response carries
   it: `{ tool, routedBy, confidence, data }` (`tool: null` → help message).
3. `ChatArea.toAnswer` turns the result into a message, and
   `components/portfolio/answers/ToolAnswer.tsx` renders it: a trace line
   ("Used the experience tool, read 3 entries ›") over one component per tool,
   built from the shared serif/chip primitives in `answers/primitives.tsx`.
   The admin preview renders the same `ToolAnswer`, so previews are exact.
   Plain replies (help, offline) still stream as text through `ChatMessage`.

- **`src/components/portfolio/ChatArea.tsx`** — the core: the tool round trip
  (`lib/chat.ts`), the typing/streaming animation, the welcome message, and the
  resizable split between chat and the project detail panel.
- **`src/components/portfolio/ChatMessage.tsx`** — renders a single message,
  including the markdown-ish parsing of rendered section strings.

The chat opens with the **welcome** section (`answers/WelcomeAnswer.tsx`):
greeting, intro, topic links, resume link and outside links, all edited on the
welcome admin page. It is a section, not a tool — `Index.tsx` reads it from
`GET /api/portfolio` and its topics also feed the "Want to know more?" list
under each answer. If it can't load, the chat falls back to a plain text
welcome.

Outside the chat, the sidebar, projects grid and project pages read published
projects from `GET /api/portfolio` via `useProjects()` (`portfolio/usePortfolio.ts`).
If the backend is unreachable the chat says so — there is no bundled fallback.
Adding a seventh tool means: a template in both schema files, a tool in
`Backend/src/chat/tools.ts`, and a case in `toAnswer`.

Every tool has its own answer component in `answers/` (`AboutAnswer`,
`ExperienceAnswer`, …), all built from `primitives.tsx` so they read as one
family — add new answer layouts the same way rather than with one-off fonts or
styles. `CampaignXProject` and `ResumeViewer` (opened from `ChatArea`) are the
remaining hand-built panels.

### State

`pages/Index.tsx` holds the top-level state — `activeSection`, `chatHistory`,
`chatKey` (bumped to force-remount `ChatArea` for "new chat"), sidebar collapse,
and `containerHeight`. There is no global store; state flows down as props.

Two deliberate quirks worth preserving:

- **Visual Viewport handling** — `Index.tsx` subscribes to
  `window.visualViewport` and sets container height to
  `viewport.height + viewport.offsetTop`. This keeps the input above the iOS
  Safari keyboard. Don't replace it with `100vh`.
- **Section re-selection** — `handleSelectChat` sets `activeSection` to `null`
  then back after a 10ms timeout, so re-picking the same section still fires
  `ChatArea`'s effect. `instantSectionRef` flags that path so it skips the
  typing animation.

### UI layer

shadcn-ui components live in `src/components/ui/` and are generated, not
hand-written — prefer configuring them over editing them. Config in
`components.json`. Styling is Tailwind with design tokens defined in
`src/index.css` and `tailwind.config.ts`; use the semantic token classes
(`bg-background`, `text-foreground`, …) rather than raw color values.

Path alias `@/` → `Frontend/src/` (set in both `vite.config.ts` and the
tsconfigs).

### Assets

Everything in `Frontend/public/` is served from the site root — project
screenshots, `resume_abhay.pdf`, and `pdf.worker.min.mjs` (the react-pdf worker
that `ResumeViewer` depends on; do not delete it). Reference them as absolute
paths like `/commandnest.png`.

## Conventions

- TypeScript throughout; components are function components with typed prop
  interfaces declared next to them.
- Tests use vitest + Testing Library, jsdom environment, setup in
  `src/test/setup.ts`.
- Match the surrounding file's style. `ChatArea.tsx` is long by design — content
  data and presentation live together there; splitting it is a decision for the
  repo owner, not a drive-by refactor.

## Deployment

The frontend calls the API at `https://api.abhay.si` (Railway) from every
domain, unless `VITE_API_BASE_URL` is set; on localhost Vite proxies `/api` to
port 3000. Admin login only works from abhay.si — the session cookie is
same-site with the API.

The site builds to `Frontend/dist` and is deployed as a static site. Because the
app moved from the repository root into `Frontend/`, the hosting provider's
**root directory setting must be `Frontend`** (build `npm run build`, output
`dist`).
