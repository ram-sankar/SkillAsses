import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { createAssignmentSchema } from "../validators/assignmentValidator";
import { saveAnswerAndScoreSchema } from "../validators/saveAnswerAndScoreValidator";
import { sendError, sendSuccess } from "../utils/response";
import { COMMON_STRINGS, ASSIGNMENT_MESSAGES } from "../constants/messages";
import { AssignmentStatus } from "../models/assignments";
import {
  getDocument,
  queryDocuments,
  updateDocument,
  createDocument,
} from "../services/databaseService";
import { FIREBASE_TABLES } from "../constants/firebaseTables";
import { UserRole } from "../models/user";

const getEmailFromRequest = (req: AuthenticatedRequest): string | null => {
  return req?.user?.email || null;
};

export const createAssignment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const parseResult = createAssignmentSchema.safeParse(req.body);

  if (!parseResult.success) {
    const errors = parseResult.error.flatten().fieldErrors;
    sendError(res, errors, 400);
    return;
  }

  const { testId, candidateMailId } = req.body;

  const recruiterMailId = getEmailFromRequest(req);
  if (!recruiterMailId) {
    sendError(res, COMMON_STRINGS.MISSING_USER_EMAIL, 401);
    return;
  }

  try {
    const assignedDate = Date.now();
    const assignmentId = await createDocument(FIREBASE_TABLES.ASSIGNMENTS, {
      testId,
      candidateMailId,
      recruiterMailId,
      status: AssignmentStatus.ASSIGNED,
      assignedDate,
      submissionDate: null,
      score: null,
      feedback: null,
      candidateResponses: {},
    });

    sendSuccess(res, { assignmentId }, ASSIGNMENT_MESSAGES.ASSIGNMENT_CREATED, 201);
  } catch (error: any) {
    sendError(res, error.message || ASSIGNMENT_MESSAGES.FAILED_CREATE_ASSIGNMENT);
  }
};

export const getAssignments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userType = req?.user?.role as string;
  const shouldReturnFilteredList = req.query.shouldReturnFilteredList === "true";

  if (!userType) {
    sendError(res, COMMON_STRINGS.MISSING_USER_TYPE, 400);
    return;
  }

  const email = getEmailFromRequest(req);
  if (!email) {
    sendError(res, COMMON_STRINGS.MISSING_USER_EMAIL, 401);
    return;
  }

  try {
    let assignments: any[];

    if (userType === UserRole.RECRUITER) {
      assignments = await queryDocuments(
        FIREBASE_TABLES.ASSIGNMENTS,
        "recruiterMailId",
        "==",
        email,
      );
    } else if (userType === UserRole.CANDIDATE) {
      assignments = await queryDocuments(
        FIREBASE_TABLES.ASSIGNMENTS,
        "candidateMailId",
        "==",
        email,
      );
    } else {
      sendError(res, COMMON_STRINGS.INVALID_USER_TYPE, 400);
      return;
    }

    const testIds = assignments.map((assignment: any) => assignment.testId);
    const uniqueTestIds = [...new Set(testIds)];

    const testDataMap: { [testId: string]: any } = {};
    const batchSize = 10; // Firebase 'in' query limit
    for (let i = 0; i < uniqueTestIds.length; i += batchSize) {
      const batch = uniqueTestIds.slice(i, i + batchSize);
      const tests = await queryDocuments(FIREBASE_TABLES.TESTS, "__name__", "in", batch);
      tests.forEach((test: any) => {
        testDataMap[test.id] = test;
      });
    }

    const assignmentDetails = [];
    for (const assignment of assignments) {
      const testData = testDataMap[assignment.testId];
      if (testData) {
        const assignedDate =
          typeof assignment.assignedDate === "number" ? new Date(assignment.assignedDate) : null;
        const formattedDate = assignedDate
          ? `${assignedDate.getDate().toString().padStart(2, "0")}-${(assignedDate.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${assignedDate.getFullYear()}`
          : null;

        const candidateResponses = Object.values(assignment.candidateResponses || {});
        const totalScore = candidateResponses.reduce(
          (sum: number, item: any) => sum + (item.score || 0),
          0,
        );
        const avgScore = candidateResponses.length
          ? ((totalScore / candidateResponses.length) * 10).toFixed(0)
          : "0";

        assignmentDetails.push({
          id: assignment.id,
          testId: assignment.testId,
          candidateMailId: assignment.candidateMailId,
          recruiterMailId: assignment.recruiterMailId,
          testTitle: testData.topic,
          status: assignment.status,
          overallScore: avgScore + "%",
          assignedDate: formattedDate,
        });
      }
    }

    if (shouldReturnFilteredList) {
      if (userType === UserRole.RECRUITER) {
        res.json(assignmentDetails.map(({ recruiterMailId, ...rest }) => rest));
      } else if (userType === UserRole.CANDIDATE) {
        res.json(assignmentDetails.map(({ candidateMailId, ...rest }) => rest));
      } else {
        res.json(assignmentDetails);
      }
      return;
    }
    console.log(assignmentDetails);
    res.json(assignmentDetails);
  } catch (error: any) {
    sendError(res, error.message || ASSIGNMENT_MESSAGES.FAILED_CREATE_ASSIGNMENT);
  }
};

export const getAssignmentById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { assignmentId } = req.params;

  if (!assignmentId) {
    sendError(res, COMMON_STRINGS.MISSING_ASSIGNMENT_ID, 400);
    return;
  }

  try {
    const assignment = await getDocument(FIREBASE_TABLES.ASSIGNMENTS, assignmentId);

    if (!assignment) {
      sendError(res, COMMON_STRINGS.ASSIGNMENT_NOT_FOUND, 404);
      return;
    }

    res.json(assignment);
  } catch (error: any) {
    sendError(res, error.message || ASSIGNMENT_MESSAGES.FAILED_FETCH_ASSIGNMENT, 500);
  }
};

export const saveAnswerAndScore = async (req: Request, res: Response): Promise<void> => {
  const parseResult = saveAnswerAndScoreSchema.safeParse(req.body);

  if (!parseResult.success) {
    const errors = parseResult.error.flatten().fieldErrors;
    sendError(res, errors, 400);
    return;
  }

  const { assignmentId, questionId, answer, score, status } = req.body;

  try {
    await updateDocument(FIREBASE_TABLES.ASSIGNMENTS, assignmentId, {
      [`candidateResponses.${questionId}.answer`]: answer,
      [`candidateResponses.${questionId}.score`]: score,
      status,
    });

    sendSuccess(res, { success: true }, COMMON_STRINGS.SUCCESS);
  } catch (error: any) {
    sendError(res, error.message || ASSIGNMENT_MESSAGES.FAILED_SAVE_ANSWER, 500);
  }
};
