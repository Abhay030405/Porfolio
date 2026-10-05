import { env } from "../env.ts";
import { isToolName, TOOLS, type ToolName } from "./tools.ts";

// Decides which tool answers a free-text chat query, using TypeSafe's Jev
// model (a System One "choice" question whose options are the tools). When
// Jev is unavailable or unsure, plain keyword matching decides instead.

const JEV_URL = "https://api.typesafe.ai/v1/systemone";
const JEV_TIMEOUT_MS = 5000;
const MIN_CONFIDENCE = 0.4;
const MAX_QUERY_LENGTH = 500;

/** Jev's option for "none of the tools" — greetings, off-topic questions. */
const NO_TOOL = "unknown";

export interface Routing {
  tool: ToolName | null;
  routedBy: "jev" | "keywords";
  confidence: number | null;
}

async function askJev(query: string): Promise<{ choice: string; confidence: number }> {
  const criteria: Record<string, string> = {
    ...Object.fromEntries(Object.entries(TOOLS).map(([name, tool]) => [name, tool.description])),
    [NO_TOOL]: "Greetings or anything unrelated to Abhay's portfolio",
  };

  const res = await fetch(JEV_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.TYPESAFE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      state: query,
      model: "jev-latest",
      questions: {
        tool: {
          type: "choice",
          instructions: "Which section of Abhay Agarwal's portfolio is the visitor asking to see?",
          criteria,
        },
      },
    }),
    signal: AbortSignal.timeout(JEV_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Jev returned ${res.status}: ${await res.text()}`);

  const answer = (await res.json())?.answers?.tool;
  if (typeof answer?.choice !== "string") throw new Error("Jev response missing answers.tool.choice");
  return { choice: answer.choice, confidence: Number(answer.confidence ?? 0) };
}

/** Last tool name mentioned in the query wins — the old frontend behaviour. */
function matchKeywords(query: string): ToolName | null {
  const lower = query.toLowerCase();
  let matched: ToolName | null = null;
  for (const name of Object.keys(TOOLS)) if (isToolName(name) && lower.includes(name)) matched = name;
  return matched;
}

export async function routeQuery(rawQuery: string): Promise<Routing> {
  const query = rawQuery.trim().slice(0, MAX_QUERY_LENGTH);

  if (env.TYPESAFE_API_KEY) {
    try {
      const started = Date.now();
      const { choice, confidence } = await askJev(query);
      console.log(`[chat] ${JSON.stringify(query)} -> ${choice} (${confidence}) in ${Date.now() - started}ms`);
      if (confidence >= MIN_CONFIDENCE) {
        // A confident "unrelated" is an answer too: no tool, show the help message
        if (choice === NO_TOOL) return { tool: null, routedBy: "jev", confidence };
        if (isToolName(choice)) return { tool: choice, routedBy: "jev", confidence };
      }
    } catch (err) {
      console.error("[chat] Jev failed, using keywords:", err);
    }
  }
  return { tool: matchKeywords(query), routedBy: "keywords", confidence: null };
}
