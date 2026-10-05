import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Loader2, LogOut } from "lucide-react";
import AdminGate from "@/admin/AdminGate";
import EntryEditor from "@/admin/EntryEditor";
import ProjectsAdmin from "@/admin/ProjectsAdmin";
import { ADMIN_SESSION_KEY, adminApi } from "@/admin/adminApi";
import { ADMIN_ROUTES, adminPath } from "@/admin/adminRoutes";
import { PORTFOLIO_QUERY_KEY } from "@/portfolio/usePortfolio";
import type { ContentKind, SectionKind } from "@/portfolio/types";

/* One private admin page per kind of content (see admin/adminRoutes.ts). Lazy-loaded from App. */

const AdminPage = ({ kind }: { kind: ContentKind }) => {
  // Keep the admin pages out of search results
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const previousTitle = document.title;
    document.title = "Portfolio admin";
    return () => {
      meta.remove();
      document.title = previousTitle;
    };
  }, []);

  return (
    <AdminGate>
      <AdminShell kind={kind} />
    </AdminGate>
  );
};

const AdminShell = ({ kind }: { kind: ContentKind }) => {
  const queryClient = useQueryClient();

  const logout = async () => {
    await adminApi.logout().catch(() => {});
    queryClient.setQueryData(ADMIN_SESSION_KEY, false);
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[96rem] items-center gap-4 overflow-x-auto px-4 py-3 md:px-8">
          <span className="font-serif text-lg font-semibold tracking-tight whitespace-nowrap">Portfolio admin</span>
          <nav className="flex items-center gap-1">
            {ADMIN_ROUTES.map(({ code, label }) => (
              <NavLink
                key={code}
                to={adminPath(code)}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    isActive ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" /> View site
            </a>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[96rem] px-4 py-6 md:px-8">
        {kind === "project" ? <ProjectsAdmin /> : <SectionAdmin key={kind} kind={kind} />}
      </main>
    </div>
  );
};

/* Sections are single entries whose id is their kind. */
const SectionAdmin = ({ kind }: { kind: SectionKind }) => {
  const queryClient = useQueryClient();
  const entry = useQuery({ queryKey: ["admin-entry", kind], queryFn: () => adminApi.get(kind) });

  if (entry.isPending) return <Loader2 className="mx-auto mt-10 h-5 w-5 animate-spin text-muted-foreground" />;
  if (entry.isError) return <p className="text-sm text-destructive">{entry.error.message}</p>;

  return (
    <EntryEditor
      entry={entry.data}
      onEntryChange={async (next) => {
        queryClient.setQueryData(["admin-entry", kind], next);
        await queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
      }}
    />
  );
};

export default AdminPage;
