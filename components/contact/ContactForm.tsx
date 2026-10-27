"use client";

import { Button, Card } from "@/components";
import { contactSchema } from "@/lib/contact/schema";
import { useTranslations } from "next-intl";
import { useId, useState, type FormEvent } from "react";
import styles from "./contact.module.css";

type FieldErrors = Partial<Record<"name" | "email" | "company" | "message", string>>;

type Status =
  | { kind: "idle" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function ContactForm() {
  const t = useTranslations("Contact.form");
  const baseId = useId();
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const nameId = `${baseId}-name`;
  const emailId = `${baseId}-email`;
  const companyId = `${baseId}-company`;
  const messageId = `${baseId}-message`;
  const websiteId = `${baseId}-website`;
  const statusId = `${baseId}-status`;

  function mapZodErrors(
    issues: { path: PropertyKey[]; message: string }[],
  ): FieldErrors {
    const next: FieldErrors = {};
    for (const issue of issues) {
      const key = String(issue.path[0] ?? "");
      if (key === "name") next.name = t("errors.nameRequired");
      else if (key === "email") next.email = t("errors.emailInvalid");
      else if (key === "message") {
        next.message =
          issue.message.toLowerCase().includes("at most") ||
          issue.message.includes("5000")
            ? t("errors.messageMax")
            : t("errors.messageMin");
      }
    }
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: "idle" });

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error.issues));
      setStatus({ kind: "idle" });
      return;
    }

    setFieldErrors({});
    setPending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (res.ok && json.ok) {
        form.reset();
        setStatus({ kind: "success" });
        return;
      }

      if (json.error === "rate_limit") {
        setStatus({ kind: "error", message: t("errors.rateLimit") });
      } else if (json.error === "config") {
        setStatus({ kind: "error", message: t("errors.config") });
      } else if (json.error === "validation") {
        setStatus({ kind: "error", message: t("errors.generic") });
      } else {
        setStatus({ kind: "error", message: t("errors.sendFailed") });
      }
    } catch {
      setStatus({ kind: "error", message: t("errors.sendFailed") });
    } finally {
      setPending(false);
    }
  }

  return (
    <Card
      as="form"
      className={styles.formCard}
      noValidate
      onSubmit={onSubmit}
      aria-describedby={status.kind !== "idle" ? statusId : undefined}
    >
      <h2 className={styles.formTitle}>{t("title")}</h2>

      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor={websiteId}>{t("honeypot")}</label>
        <input
          id={websiteId}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={nameId}>
          {t("name")}
        </label>
        <input
          id={nameId}
          className="form-input"
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={pending}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? `${nameId}-error` : undefined}
        />
        {fieldErrors.name ? (
          <p className="form-error" id={`${nameId}-error`}>
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={emailId}>
          {t("email")}
        </label>
        <input
          id={emailId}
          className="form-input"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={pending}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? `${emailId}-error` : undefined}
        />
        {fieldErrors.email ? (
          <p className="form-error" id={`${emailId}-error`}>
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={companyId}>
          {t("company")}
        </label>
        <input
          id={companyId}
          className="form-input"
          name="company"
          type="text"
          autoComplete="organization"
          disabled={pending}
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={messageId}>
          {t("message")}
        </label>
        <textarea
          id={messageId}
          className="form-textarea"
          name="message"
          rows={6}
          required
          disabled={pending}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={
            fieldErrors.message ? `${messageId}-error` : undefined
          }
        />
        {fieldErrors.message ? (
          <p className="form-error" id={`${messageId}-error`}>
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <div className={styles.formFooter}>
        <p className={styles.helper}>{t("helper")}</p>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? t("submitting") : t("submit")}
        </Button>
      </div>

      <div
        id={statusId}
        className={
          status.kind === "error"
            ? "form-status form-status--error"
            : status.kind === "success"
              ? "form-status form-status--success"
              : "form-status"
        }
        role="status"
        aria-live="polite"
      >
        {status.kind === "success"
          ? t("success")
          : status.kind === "error"
            ? status.message
            : null}
      </div>
    </Card>
  );
}
