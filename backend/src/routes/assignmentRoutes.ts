import { Router } from "express";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  saveAnswerAndScore,
} from "../controllers/assignmentController";
import { authenticateFirebaseToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authenticateFirebaseToken, createAssignment);
router.get("/", authenticateFirebaseToken, getAssignments);
router.get("/:assignmentId", authenticateFirebaseToken, getAssignmentById);
router.put("/:id/answer", authenticateFirebaseToken, saveAnswerAndScore);

export default router;
