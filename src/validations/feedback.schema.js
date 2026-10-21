import { z } from "zod";
import { feedbackTypes } from "@/lib/feedback-types";

/** The public form on /ungal-paguthi. Readers see these messages, so they are in Tamil. */
export const feedbackSchema = z.object({
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

  type: z.enum(feedbackTypes, {
    errorMap: () => ({ message: "வகையைத் தேர்ந்தெடுக்கவும்" }),
  }),

  content: z
    .string()
    .trim()
    .min(5, "கருத்து குறைந்தது 5 எழுத்துகள் இருக்க வேண்டும்")
    .max(3000, "கருத்து 3000 எழுத்துகளுக்குள் இருக்க வேண்டும்"),

  // Honeypot. The field is hidden from people, so anything in it came from a bot.
  website: z.string().optional(),
});

/** The admin hides a comment (INACTIVE) or puts it back (ACTIVE). */
export const feedbackStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
