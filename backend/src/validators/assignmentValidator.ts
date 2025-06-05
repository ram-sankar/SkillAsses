import { z } from "zod";
import { AssignmentStatus } from "../models/assignments";

export const createAssignmentSchema = z.object({
  testId: z.string().min(1),
  candidateMailId: z.string().email(),
  recruiterMailId: z.string().email(),
  status: z.nativeEnum(AssignmentStatus).optional(),
  assignedDate: z.number().int().optional(),
  submissionDate: z.number().int().nullable().optional(),
  score: z.number().nullable().optional(),
  feedback: z.string().nullable().optional(),
  candidateResponses: z.record(z.any()).optional(),
});
