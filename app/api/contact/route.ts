import { contactSchema } from "@/lib/contact/schema";
import { checkRateLimit, getClientIp } from "@/lib/contact/rate-limit";
import { Resend } from "resend";
import { NextResponse } from "next/server";

type ApiError =
  | { ok: false; error: "rate_limit" }
  | { ok: false; error: "validation"; fields: Record<string, string[]> }
  | { ok: false; error: "config" }
  | { ok: false; error: "send_failed" }
  | { ok: false; error: "invalid_json" };

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

  const raw =
    body !== null && typeof body === "object"
      ? (body as Record<string, unknown>)
      : {};

  const honeypot =
    typeof raw.website === "string" ? raw.website.trim() : "";
  if (honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limit" } satisfies ApiError,
      { status: 429 },
    );
  }

  const parsed = contactSchema.safeParse({
    ...raw,
    website: "",
  });

  if (!parsed.success) {
    const fields: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fields[key]) fields[key] = [];
      fields[key].push(issue.message);
    }
    return NextResponse.json(
      { ok: false, error: "validation", fields } satisfies ApiError,
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    return NextResponse.json(
      { ok: false, error: "config" } satisfies ApiError,
      { status: 500 },
    );
  }

  const { name, email, company, message } = parsed.data;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Portfolio contact: ${name}`,
      text,
      html,
    });

    if (result.error) {
      return NextResponse.json(
        { ok: false, error: "send_failed" } satisfies ApiError,
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "send_failed" } satisfies ApiError,
      { status: 502 },
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
