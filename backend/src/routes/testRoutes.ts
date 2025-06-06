import { Router } from "express";
import {
  uploadQuestions,
  updateTest,
  addTest,
  fetchTests,
  fetchTest,
} from "../controllers/testController";
import { authenticateFirebaseToken } from "../middlewares/authMiddleware";

const router = Router();

router.put("/:testId/questions", authenticateFirebaseToken, uploadQuestions);
router.put("/:testId", authenticateFirebaseToken, updateTest);
router.post("/", authenticateFirebaseToken, addTest);
router.get("/", authenticateFirebaseToken, fetchTests);
router.get("/:testId", authenticateFirebaseToken, fetchTest);

export default router;
