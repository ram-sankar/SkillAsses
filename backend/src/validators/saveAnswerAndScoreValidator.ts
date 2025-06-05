import { z } from "zod";
import { AssignmentStatus } from "../models/assignments";

export const saveAnswerAndScoreSchema = z.object({
  assignmentId: z.string().min(1),
  questionId: z.string().min(1),
  answer: z.any(),
  score: z.number(),
  status: z.nativeEnum(AssignmentStatus),
});
