import { z } from "zod";

/**
 * The public form on /kelvi-pathil. Readers see these messages, so they are in
 * Tamil, unlike the admin ones.
 */
export const askQuestionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "உங்கள் பெயரை உள்ளிடவும்")
    .max(120, "பெயர் 120 எழுத்துகளுக்குள் இருக்க வேண்டும்"),

  email: z
    .string()
    .trim()
    .max(190, "மின்னஞ்சல் மிக நீளமாக உள்ளது")
    .email("சரியான மின்னஞ்சலை உள்ளிடவும்"),

  topic: z.string().trim().max(120).optional().or(z.literal("")),

  question: z
    .string()
    .trim()
    .min(10, "கேள்வி குறைந்தது 10 எழுத்துகள் இருக்க வேண்டும்")
    .max(3000, "கேள்வி 3000 எழுத்துகளுக்குள் இருக்க வேண்டும்"),

  // Honeypot. The field is hidden from people, so anything in it came from a bot.
  website: z.string().optional(),
});

/** The admin's answer form. An answer is required only to publish. */
export const answerQuestionSchema = z
  .object({
    question: z
      .string()
      .trim()
      .min(3, "Question must be at least 3 characters")
      .max(20000, "Question must be at most 20,000 characters"),

    answer: z
      .string()
      .trim()
      .max(200000, "Answer must be at most 200,000 characters")
      .optional()
      .or(z.literal("")),

    answeredBy: z
      .string()
      .trim()
      .max(160, "Answered by must be at most 160 characters")
      .optional()
      .or(z.literal("")),

    status: z.enum(["DRAFT", "PUBLISHED"]),
  })
  .refine((v) => v.status !== "PUBLISHED" || Boolean(v.answer), {
    message: "Write an answer before publishing",
    path: ["answer"],
  });
