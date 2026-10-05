# Backend

The portfolio API: serves published content, powers the private admin pages
(AI-drafted or hand-written edits), and answers the chat through tools. The frontend
talks to it over HTTP only — no imports across the `Frontend/` ↔ `Backend/`
boundary.

Hono on Node 22.18+, which runs the TypeScript directly (no build step).
Postgres on Neon, AI drafts through OpenRouter.

## Setup

```sh
cd Backend
npm install
cp .env.example .env    # fill in DATABASE_URL and OPENROUTER_API_KEY
npm run migrate         # create tables (safe to re-run)
npm run seed            # load seed/content.ts into an empty database
npm run set-password    # choose the admin password
npm run dev             # http://localhost:3000, restarts on change
```

`npm run typecheck` type-checks; `npm start` runs in production.

## Content model

Every piece of content fits a **fixed template** — `src/content/schemas.ts`
(zod). The frontend mirrors the shapes in `Frontend/src/portfolio/types.ts` and
renders them; keep the two in sync.

| Table       | Holds                                                                                 |
| ----------- | ------------------------------------------------------------------------------------- |
| `entries`   | One row per section (`id` = `about`, `experience`, …) and per project (`id` = uuid). `published` is public, `draft` is admin-only. |
| `documents` | Uploaded source files' extracted text, reused when regenerating a draft.              |
| `revisions` | The previous `published` value, snapshotted on every publish and delete.              |

## API

Public:

| Route                  | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `GET /api/portfolio`   | All published sections and projects (cached 60s)                |
| `POST /api/chat`       | `{ query }` → Jev picks a tool, or `{ tool }` → that tool; returns `{ tool, routedBy, confidence, data }` |
| `POST /api/auth/login` | `{ password }` → httpOnly session cookie (5 tries / 15 min / IP) |
| `POST /api/auth/logout`, `GET /api/auth/me` | Session management                          |

Admin — every route under `/api/admin` requires the session cookie:

| Route                                          | Purpose                                          |
| ---------------------------------------------- | ------------------------------------------------ |
| `GET /entries?kind=`, `GET /entries/:id`       | Read entries with their drafts                   |
| `POST /entries` `{ kind: "project" }`          | New (empty) project                              |
| `PATCH /entries/:id`, `DELETE /entries/:id`    | Sidebar visibility / order; delete a project     |
| `POST /documents` (multipart `file`, `kind`)   | Upload PDF / DOCX / MD / TXT, extract its text   |
| `POST /entries/:id/generate`                   | AI draft from `documentId`, or regenerate with `feedback` |
| `PUT /entries/:id/draft`, `DELETE …/draft`     | Save an edited draft / reject it                 |
| `POST /entries/:id/publish`                    | Publish `data` (or the stored draft)             |
| `GET …/revisions`, `POST …/revisions/:rid/restore` | Roll back via a draft                        |

Drafts are never public: AI output only becomes visible after a human presses
Approve/Publish on the admin page.

## Chat tools

`src/chat/tools.ts` defines six tools — `about`, `experience`, `skills`,
`achievements`, `projects`, `contact` — each reading its published content
from `entries`. For a typed question, `src/chat/router.ts` asks TypeSafe's Jev
model to choose a tool, using each tool's `description` as the choice criteria
(plus an `unknown` option for greetings and off-topic questions). If Jev isn't
configured, fails, or answers below 0.4 confidence, keyword matching decides.
Tool names double as the frontend's section keys.

## Auth

Single admin. `npm run set-password` stores a scrypt hash in
`ADMIN_PASSWORD_HASH` and rotates `SESSION_SECRET` (which logs out every
session). The session cookie is `httpOnly`, `Secure`, `SameSite=Lax`, scoped to
`/api`, valid 7 days.

## Deployment

Serve the API at `api.itsabhay.me` and `api.abhay.si` — the frontend derives
the API host from its own domain, and a same-site API is what lets the session
cookie work. Add every site origin to `ALLOWED_ORIGINS`. It needs a long-running
Node host (Render, Railway, Fly, a VPS…). In development, Vite proxies `/api`
to `http://localhost:3000`.
