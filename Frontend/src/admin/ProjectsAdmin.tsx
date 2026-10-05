import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
import { PORTFOLIO_QUERY_KEY } from "@/portfolio/usePortfolio";
import type { ProjectContent } from "@/portfolio/types";
import { adminApi, type Entry } from "./adminApi";
import EntryEditor from "./EntryEditor";

/*
 * Projects: a list on the left (order, sidebar visibility, delete) and the
 * shared editor for the selected one. ?id= keeps the selection across reloads.
 */

const LIST_KEY = ["admin-entries", "project"];

const projectName = (e: Entry) =>
  ((e.draft ?? e.published) as ProjectContent | null)?.name?.trim() || "Untitled project";

const ProjectsAdmin = () => {
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("id");

  const list = useQuery({ queryKey: LIST_KEY, queryFn: () => adminApi.list("project") });
  const projects = list.data ?? [];
  const selected = projects.find((p) => p.id === selectedId) ?? null;

  const select = (id: string | null) => setParams(id ? { id } : {}, { replace: true });

  const replaceInList = (entry: Entry) =>
    queryClient.setQueryData<Entry[]>(LIST_KEY, (old) => old?.map((e) => (e.id === entry.id ? entry : e)));

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: LIST_KEY });
    await queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
  };

  const create = async () => {
    const entry = await adminApi.createProject();
    queryClient.setQueryData<Entry[]>(LIST_KEY, (old) => [...(old ?? []), entry]);
    select(entry.id);
  };

  // Swap with the neighbour, then store each project's list position as its sort order
  const move = async (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= projects.length) return;
    const order = [...projects];
    [order[index], order[target]] = [order[target], order[index]];
    await Promise.all(order.map((p, i) => (p.sortOrder === i ? null : adminApi.update(p.id, { sortOrder: i }))));
    await refresh();
  };

  const toggleSidebar = async (entry: Entry) => {
    replaceInList(await adminApi.update(entry.id, { showInSidebar: !entry.showInSidebar }));
    await queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
  };

  const remove = async (entry: Entry) => {
    const warning = entry.published
      ? `Delete “${projectName(entry)}”? It will disappear from the live site.`
      : `Delete “${projectName(entry)}”?`;
    if (!window.confirm(warning)) return;
    await adminApi.remove(entry.id);
    if (entry.id === selectedId) select(null);
    await refresh();
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="space-y-2">
        <button
          type="button"
          onClick={create}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 py-2.5 text-sm text-foreground hover:border-white/35 hover:bg-white/[0.03] transition-colors"
        >
          <Plus className="h-4 w-4" /> New project
        </button>

        {list.isPending && <Loader2 className="mx-auto mt-6 h-5 w-5 animate-spin text-muted-foreground" />}

        {projects.map((p, i) => {
          const isSelected = p.id === selectedId;
          return (
            <div
              key={p.id}
              className={`group rounded-xl border px-3 py-2.5 transition-colors ${
                isSelected ? "border-white/25 bg-white/[0.06]" : "border-white/10 hover:bg-white/[0.03]"
              }`}
            >
              <button type="button" onClick={() => select(p.id)} className="block w-full text-left">
                <div className="truncate text-sm text-foreground">{projectName(p)}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {[p.published ? "Published" : "Not published", p.draft && "draft", !p.showInSidebar && "not in sidebar"]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </button>
              <div className="mt-1.5 flex items-center gap-0.5 text-muted-foreground">
                <IconButton title="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton title="Move down" onClick={() => move(i, 1)} disabled={i === projects.length - 1}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton title={p.showInSidebar ? "Hide from sidebar" : "Show in sidebar"} onClick={() => toggleSidebar(p)}>
                  {p.showInSidebar ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </IconButton>
                <IconButton title="Delete" onClick={() => remove(p)} danger>
                  <Trash2 className="h-3.5 w-3.5" />
                </IconButton>
              </div>
            </div>
          );
        })}
      </aside>

      <section className="min-w-0">
        {selected ? (
          <EntryEditor
            key={selected.id}
            entry={selected}
            onEntryChange={async (entry) => {
              replaceInList(entry);
              await queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
            }}
          />
        ) : (
          <p className="pt-2 text-sm text-muted-foreground">
            Pick a project to edit, or create a new one — upload its write-up and let the AI draft the page.
          </p>
        )}
      </section>
    </div>
  );
};

const IconButton = ({
  title,
  onClick,
  disabled,
  danger,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={`rounded-md p-1.5 transition-colors disabled:opacity-30 ${
      danger ? "hover:bg-destructive/15 hover:text-destructive" : "hover:bg-accent hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

export default ProjectsAdmin;
