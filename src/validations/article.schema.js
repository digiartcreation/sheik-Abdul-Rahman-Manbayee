import { z } from "zod";
import { divisions } from "@/lib/divisions";

const divisionKeys = divisions.map((d) => d.key);

/** The admin form. `division` is the section, `content` the full description. */
export const articleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Heading must be at least 3 characters")
    .max(300, "Heading must be at most 300 characters"),

  division: z.enum(divisionKeys, {
    errorMap: () => ({ message: "Choose one of the site sections" }),
  }),

  category: z
    .string()
    .trim()
    .max(120, "Sub-category must be at most 120 characters")
    .optional()
    .or(z.literal("")),

  author: z
    .string()
    .trim()
    .max(160, "Author must be at most 160 characters")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(600, "Short summary must be at most 600 characters")
    .optional()
    .or(z.literal("")),

  content: z.string().trim().min(20, "Full description must be at least 20 characters"),

  // Either an uploaded path (/api/media/…) or a pasted absolute URL.
  image: z
    .string()
    .trim()
    .max(500)
    .refine((v) => !v || v.startsWith("/") || /^https?:\/\//i.test(v), {
      message: "Thumbnail must be an uploaded file or a http(s) link",
    })
    .optional()
    .or(z.literal("")),

  videoUrl: z
    .string()
    .trim()
    .max(500)
    .refine((v) => !v || /^https?:\/\//i.test(v), { message: "Video must be a http(s) link" })
    .optional()
    .or(z.literal("")),

  publishedAt: z
    .string()
    .trim()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), { message: "Enter a valid date" })
    .optional()
    .or(z.literal("")),

  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

export const articleQuerySchema = z.object({
  division: z.string().trim().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  q: z.string().trim().optional(),
});
