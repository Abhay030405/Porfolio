import { Hono } from "hono";
import { routeQuery } from "../chat/router.ts";
import { isToolName, TOOLS, type ToolName } from "../chat/tools.ts";

// The chat endpoint. Body is either
//   { query: "where has he worked?" }  → Jev picks the tool
//   { tool: "experience" }             → the visitor picked it (sidebar, chips)
// and the response carries the tool's result for the frontend to render:
//   { tool, routedBy, confidence, data }   — tool and data are null when nothing fits.

export const chatRoute = new Hono();

chatRoute.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);

  let tool: ToolName | null;
  let routedBy: "direct" | "jev" | "keywords" = "direct";
  let confidence: number | null = null;

  if (typeof body?.tool === "string") {
    if (!isToolName(body.tool)) return c.json({ error: `Unknown tool: ${body.tool}` }, 400);
    tool = body.tool;
  } else if (typeof body?.query === "string" && body.query.trim()) {
    ({ tool, routedBy, confidence } = await routeQuery(body.query));
  } else {
    return c.json({ error: "Send `query` (text) or `tool` (a tool name)" }, 400);
  }

  const data = tool ? await TOOLS[tool].run() : null;
  return c.json({ tool, routedBy, confidence, data });
});
