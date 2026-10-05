import type { ContentKind } from "@/portfolio/types";

/*
 * The private admin pages, one per kind of content. The paths are unlisted,
 * not secret — anyone reading the bundle can find them. What actually
 * protects the content is the backend's session check on every admin call.
 */
export const ADMIN_PATH_PREFIX = "/abhay20245003";

export const ADMIN_ROUTES: { code: string; kind: ContentKind; label: string }[] = [
  { code: "p", kind: "project", label: "Projects" },
  { code: "e", kind: "experience", label: "Experience" },
  { code: "s", kind: "skills", label: "Skills" },
  { code: "a", kind: "about", label: "About" },
  { code: "h", kind: "achievements", label: "Achievements" },
  { code: "c", kind: "contact", label: "Contact" },
];

export const adminPath = (code: string) => `${ADMIN_PATH_PREFIX}${code}`;
