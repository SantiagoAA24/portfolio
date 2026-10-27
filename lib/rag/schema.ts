import { z } from "zod";
import { getChatMaxInputChars } from "./env";

export function createChatSchema() {
  const max = getChatMaxInputChars();
  return z.object({
    message: z
      .string()
      .trim()
      .min(1)
      .max(max, { message: "too_long" }),
    locale: z.enum(["en", "es"]),
  });
}

export type ChatRequestBody = z.infer<ReturnType<typeof createChatSchema>>;
