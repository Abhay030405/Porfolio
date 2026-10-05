import { Component, type ReactNode } from "react";
import ProjectDetailPage from "@/components/portfolio/ProjectDetailPage";
import ToolAnswer from "@/components/portfolio/answers/ToolAnswer";
import WelcomeAnswer from "@/components/portfolio/answers/WelcomeAnswer";
import { toSidebarProject } from "@/portfolio/usePortfolio";
import type { ContentKind, ProjectContent, WelcomeContent } from "@/portfolio/types";

/* Renders content exactly as visitors will see it, using the site's own components. */

const noop = () => {};

const ContentPreview = ({ kind, value }: { kind: ContentKind; value: unknown }) => (
  <PreviewBoundary resetKey={value}>
    {kind === "project" ? (
      <div className="h-[46rem] overflow-hidden rounded-xl border border-white/10">
        <ProjectDetailPage
          project={toSidebarProject(value as ProjectContent)}
          onOpenProjects={noop}
          onOpenProject={noop}
          onStartChat={noop}
        />
      </div>
    ) : kind === "welcome" ? (
      <WelcomeAnswer data={value as WelcomeContent} />
    ) : (
      // The same component the chat renders the section's tool result with
      <ToolAnswer tool={kind} data={value} />
    )}
  </PreviewBoundary>
);

/* A half-edited value must never take the editor down with it. */
class PreviewBoundary extends Component<{ children: ReactNode; resetKey: unknown }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  // Try again once the content changes
  componentDidUpdate(prev: { resetKey: unknown }) {
    if (this.state.failed && prev.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }
  render() {
    return this.state.failed ? (
      <p className="text-sm text-muted-foreground">The preview can't render this content yet.</p>
    ) : (
      this.props.children
    );
  }
}

export default ContentPreview;
