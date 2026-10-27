import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(120).default(""),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(200).default(""),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactPayload = z.infer<typeof contactSchema>;
