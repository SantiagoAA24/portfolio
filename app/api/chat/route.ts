import { getClientIp } from "@/lib/http/ip";
import {
  checkDailyBudget,
  costFromUsage,
  estimateRequestCostUsd,
  getMaxOutputTokens,
  recordSpend,
} from "@/lib/rag/budget";
import { embedQuery, getOpenAI } from "@/lib/rag/embeddings";
import {
  getChatMaxInputChars,
  getOpenAiChatModel,
  requireEnv,
} from "@/lib/rag/env";
import { queryChunks } from "@/lib/rag/pinecone";
import { checkChatRateLimit } from "@/lib/rag/rate-limit";
import { createChatSchema } from "@/lib/rag/schema";
import {
  buildSystemPrompt,
  dedupeSources,
  formatContext,
} from "@/lib/rag/sources";
import { NextResponse } from "next/server";

type ApiError =
  | { ok: false; error: "rate_limit" }
  | { ok: false; error: "budget" }
  | { ok: false; error: "too_long" }
  | { ok: false; error: "validation" }
  | { ok: false; error: "config" }
  | { ok: false; error: "invalid_json" }
  | { ok: false; error: "upstream" };

function sseEncode(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" } satisfies ApiError,
      { status: 400 },
    );
  }

  let openaiConfigured = true;
  let pineconeConfigured = true;
  try {
    requireEnv("OPENAI_API_KEY");
  } catch {
    openaiConfigured = false;
  }
  try {
    requireEnv("PINECONE_API_KEY");
    requireEnv("PINECONE_INDEX");
  } catch {
    pineconeConfigured = false;
  }
  if (!openaiConfigured || !pineconeConfigured) {
    return NextResponse.json(
      { ok: false, error: "config" } satisfies ApiError,
      { status: 500 },
    );
  }

  const ip = getClientIp(request);
  const rate = checkChatRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limit" } satisfies ApiError,
      { status: 429 },
    );
  }

  const schema = createChatSchema();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const tooLong = parsed.error.issues.some(
      (issue) =>
        issue.path[0] === "message" &&
        (issue.code === "too_big" || issue.message === "too_long"),
    );
    if (tooLong) {
      return NextResponse.json(
        { ok: false, error: "too_long" } satisfies ApiError,
        { status: 400 },
      );
    }
    return NextResponse.json(
      { ok: false, error: "validation" } satisfies ApiError,
      { status: 400 },
    );
  }

  const { message, locale } = parsed.data;
  const maxChars = getChatMaxInputChars();
  if (message.length > maxChars) {
    return NextResponse.json(
      { ok: false, error: "too_long" } satisfies ApiError,
      { status: 400 },
    );
  }

  let queryVector: number[];
  let embeddingTokens = 0;
  try {
    queryVector = await embedQuery(message);
    embeddingTokens = Math.ceil(message.length / 4);
  } catch {
    return NextResponse.json(
      { ok: false, error: "upstream" } satisfies ApiError,
      { status: 502 },
    );
  }

  let chunks;
  try {
    chunks = await queryChunks(queryVector, locale, 5);
  } catch {
    return NextResponse.json(
      { ok: false, error: "upstream" } satisfies ApiError,
      { status: 502 },
    );
  }

  const context = formatContext(chunks);
  const sources = dedupeSources(chunks);
  const estimated = estimateRequestCostUsd({
    queryChars: message.length,
    contextChars: context.length,
  });
  const budget = checkDailyBudget(estimated);
  if (!budget.ok) {
    return NextResponse.json(
      { ok: false, error: "budget" } satisfies ApiError,
      { status: 503 },
    );
  }

  const openai = getOpenAI();
  const model = getOpenAiChatModel();
  const system = buildSystemPrompt(locale);
  const userContent = context
    ? `Context:\n${context}\n\nQuestion: ${message}`
    : `Context: (none retrieved)\n\nQuestion: ${message}`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(sseEncode(event, data)));
      };

      try {
        const completion = await openai.chat.completions.create({
          model,
          stream: true,
          stream_options: { include_usage: true },
          max_tokens: getMaxOutputTokens(),
          temperature: 0.2,
          messages: [
            { role: "system", content: system },
            { role: "user", content: userContent },
          ],
        });

        let promptTokens = 0;
        let completionTokens = 0;

        for await (const part of completion) {
          const usage = part.usage;
          if (usage) {
            promptTokens = usage.prompt_tokens ?? promptTokens;
            completionTokens = usage.completion_tokens ?? completionTokens;
          }

          const delta = part.choices[0]?.delta?.content;
          if (delta) {
            send("token", { text: delta });
          }
        }

        send("sources", { items: sources });
        send("done", {});

        const spent = costFromUsage({
          embeddingTokens,
          promptTokens:
            promptTokens ||
            Math.ceil((system.length + userContent.length) / 4),
          completionTokens: completionTokens || 200,
        });
        recordSpend(spent);
      } catch {
        send("error", { error: "upstream" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
