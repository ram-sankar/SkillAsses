import { z } from "zod";

export const testSchema = z.object({
  topic: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().optional(),
  questions: z.array(z.any()).optional(),
});
