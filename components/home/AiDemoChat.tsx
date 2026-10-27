"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import styles from "./home.module.css";

type Citation = {
  label: string;
  source: string;
  slug?: string;
};

type ChatMessage =
  | { id: string; role: "user"; content: string }
  | {
      id: string;
      role: "assistant";
      content: string;
      citations: Citation[];
      pending?: boolean;
    };

type ChatErrorCode =
  | "rate_limit"
  | "budget"
  | "too_long"
  | "validation"
  | "config"
  | "upstream"
  | "unknown";

type Props = {
  maxInputChars: number;
};

function errorMessage(
  t: ReturnType<typeof useTranslations<"Home.aiDemo">>,
  code: ChatErrorCode,
  maxInputChars: number,
): string {
  switch (code) {
    case "rate_limit":
      return t("errors.rateLimit");
    case "budget":
      return t("errors.budget");
    case "too_long":
      return t("errors.tooLong", { max: maxInputChars });
    case "validation":
      return t("errors.validation");
    case "config":
      return t("errors.config");
    case "upstream":
      return t("errors.upstream");
    default:
      return t("errors.unknown");
  }
}

function parseSseChunk(
  buffer: string,
): { events: { event: string; data: string }[]; rest: string } {
  const events: { event: string; data: string }[] = [];
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";

  for (const part of parts) {
    if (!part.trim()) continue;
    let event = "message";
    const dataLines: string[] = [];
    for (const line of part.split("\n")) {
      if (line.startsWith("event:")) {
        event = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim());
      }
    }
    events.push({ event, data: dataLines.join("\n") });
  }

  return { events, rest };
}

export function AiDemoChat({ maxInputChars }: Props) {
  const t = useTranslations("Home.aiDemo");
  const locale = useLocale();
  const inputId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, error, busy]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;

    if (trimmed.length > maxInputChars) {
      setError(errorMessage(t, "too_long", maxInputChars));
      return;
    }

    setError(null);
    setBusy(true);
    setStarted(true);
    setInput("");

    const userId = `u-${Date.now()}`;
    const assistantId = `a-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: trimmed },
      {
        id: assistantId,
        role: "assistant",
        content: "",
        citations: [],
        pending: true,
      },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, locale }),
      });

      const contentType = response.headers.get("content-type") ?? "";

      if (!response.ok || !contentType.includes("text/event-stream")) {
        let code: ChatErrorCode = "unknown";
        try {
          const json = (await response.json()) as {
            ok?: boolean;
            error?: ChatErrorCode;
          };
          if (json.error) code = json.error;
        } catch {
          /* ignore */
        }
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setError(errorMessage(t, code, maxInputChars));
        return;
      }

      if (!response.body) {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setError(errorMessage(t, "unknown", maxInputChars));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assembled = "";
      let citations: Citation[] = [];
      let streamError: ChatErrorCode | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parsed = parseSseChunk(buffer);
        buffer = parsed.rest;

        for (const evt of parsed.events) {
          let payload: unknown = null;
          try {
            payload = JSON.parse(evt.data);
          } catch {
            continue;
          }

          if (evt.event === "token") {
            const text =
              payload &&
              typeof payload === "object" &&
              "text" in payload &&
              typeof (payload as { text: unknown }).text === "string"
                ? (payload as { text: string }).text
                : "";
            if (!text) continue;
            assembled += text;
            const snapshot = assembled;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId && m.role === "assistant"
                  ? { ...m, content: snapshot, pending: true }
                  : m,
              ),
            );
          } else if (evt.event === "sources") {
            const items =
              payload &&
              typeof payload === "object" &&
              "items" in payload &&
              Array.isArray((payload as { items: unknown }).items)
                ? ((payload as { items: Citation[] }).items ?? [])
                : [];
            citations = items;
          } else if (evt.event === "error") {
            const code =
              payload &&
              typeof payload === "object" &&
              "error" in payload &&
              typeof (payload as { error: unknown }).error === "string"
                ? ((payload as { error: ChatErrorCode }).error ?? "upstream")
                : "upstream";
            streamError = code;
          }
        }
      }

      if (streamError) {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setError(errorMessage(t, streamError, maxInputChars));
        return;
      }

      const finalContent = assembled.trim() || t("emptyAnswer");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId && m.role === "assistant"
            ? {
                ...m,
                content: finalContent,
                citations,
                pending: false,
              }
            : m,
        ),
      );
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      setError(errorMessage(t, "unknown", maxInputChars));
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void ask(input);
  }

  function onSuggestion(text: string) {
    void ask(text);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void ask(input);
    }
  }

  return (
    <div className={styles.terminal}>
      <div className={styles.terminalBar}>
        <span className={styles.terminalDot} aria-hidden />
        <span className={styles.terminalDot} aria-hidden />
        <span className={styles.terminalDot} aria-hidden />
        <span className={styles.terminalTitle}>{t("terminalTitle")}</span>
      </div>

      <div
        className={styles.terminalBody}
        ref={bodyRef}
        role="log"
        aria-live="polite"
        aria-busy={busy}
        aria-relevant="additions"
      >
        {!started ? (
          <>
            <div className={styles.bubbleUser}>{t("sampleQuestion")}</div>
            <div className={styles.bubbleAssistant}>
              {t("sampleAnswer")}
              <div className={styles.citations}>
                <span className={styles.citation}>{t("citation1")}</span>
                <span className={styles.citation}>{t("citation2")}</span>
              </div>
            </div>
            <div className={styles.suggestions}>
              <button
                type="button"
                className={styles.suggestion}
                onClick={() => onSuggestion(t("suggestion1"))}
                disabled={busy}
              >
                {t("suggestion1")}
              </button>
              <button
                type="button"
                className={styles.suggestion}
                onClick={() => onSuggestion(t("suggestion2"))}
                disabled={busy}
              >
                {t("suggestion2")}
              </button>
            </div>
          </>
        ) : (
          messages.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className={styles.bubbleUser}>
                {message.content}
              </div>
            ) : (
              <div key={message.id} className={styles.bubbleAssistant}>
                {message.pending && !message.content
                  ? t("thinking")
                  : message.content}
                {message.citations.length > 0 ? (
                  <div className={styles.citations}>
                    {message.citations.map((citation, index) => (
                      <span
                        key={`${citation.source}-${citation.slug ?? citation.label}-${index}`}
                        className={styles.citation}
                      >
                        [{index + 1}] {citation.label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ),
          )
        )}

        {error ? <p className={`meta ${styles.chatError}`}>{error}</p> : null}
      </div>

      <form className={styles.terminalForm} onSubmit={onSubmit}>
        <label className={styles.srOnly} htmlFor={inputId}>
          {t("inputAria")}
        </label>
        <input
          id={inputId}
          className={styles.terminalInput}
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t("inputPlaceholder")}
          maxLength={maxInputChars}
          disabled={busy}
          autoComplete="off"
        />
        <button
          type="submit"
          className={styles.terminalAsk}
          disabled={busy || input.trim().length === 0}
        >
          {t("ask")}
        </button>
      </form>
    </div>
  );
}
