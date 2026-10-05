import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { SidebarProject } from "@/components/portfolio/sidebarProjects";
import type { PortfolioResponse, ProjectContent } from "./types";

/*
 * Published content from the backend — the only source of portfolio content.
 * Chat answers come through the chat tools (lib/chat.ts); this query feeds
 * the parts of the UI that list projects outside the chat.
 */
export const PORTFOLIO_QUERY_KEY = ["portfolio"];

export function usePortfolio() {
  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEY,
    queryFn: () => apiFetch<PortfolioResponse>("/api/portfolio"),
    staleTime: 60_000,
    retry: 2,
  });
}

/** API project → the shape the sidebar, grid and project page render. */
export const toSidebarProject = (p: ProjectContent): SidebarProject => ({
  name: p.name,
  items: p.chats.map((c) => c.title),
  itemTimes: p.chats.map((c) => c.time),
  artifacts: p.artifacts,
  description: p.description || undefined,
  meta: p.meta || undefined,
});

/** Empty while loading or when the API is unreachable. */
export function useProjects() {
  const { data, isPending } = usePortfolio();
  return useMemo(
    () => ({
      allProjects: (data?.projects ?? []).map(toSidebarProject),
      sidebarProjects: (data?.projects ?? []).filter((p) => p.showInSidebar).map(toSidebarProject),
      isLoading: isPending,
    }),
    [data, isPending],
  );
}
