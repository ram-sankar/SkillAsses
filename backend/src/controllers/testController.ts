import { Request, Response } from "express";
import { db, auth } from "../config/firebase";
import { sendError, sendSuccess } from "../utils/response";
import { FIREBASE_TABLES } from "../constants/firebaseTables";
import { TestFormValues } from "../models/test";
import { testSchema } from "../validators/testValidator";

export const uploadQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;
    const { questions } = req.body;
    if (!testId) {
      sendError(res, "testId cannot be empty", 400);
      return;
    }
    const testRef = db.collection(FIREBASE_TABLES.TESTS).doc(testId);
    await testRef.update({
      questions: questions,
    });
    sendSuccess(res, { success: true }, "Questions uploaded successfully");
  } catch (error: any) {
    sendError(res, error.message || "Error uploading questions");
  }
};

export const updateTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = testSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.flatten().fieldErrors;
      sendError(res, errors, 400);
      return;
    }

    const testDetails: TestFormValues = req.body;
    const { testId } = req.params;

    if (!testDetails) {
      sendError(res, "testDetails cannot be empty", 400);
      return;
    }

    const testRef = db.collection(FIREBASE_TABLES.TESTS).doc(testId);
    await testRef.update({ ...testDetails });
    sendSuccess(res, { success: true, testId: testId }, "Test updated successfully");
  } catch (error: any) {
    sendError(res, error.message || "Error creating/updating test");
  }
};

export const addTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = testSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.flatten().fieldErrors;
      sendError(res, errors, 400);
      return;
    }

    const testDetails: TestFormValues = req.body;

    if (!testDetails) {
      sendError(res, "testDetails cannot be empty", 400);
      return;
    }

    const testRef = db.collection(FIREBASE_TABLES.TESTS).doc();
    await testRef.set({
      ...testDetails,
      questions: [],
    });
    sendSuccess(res, { success: true, testId: testRef.id }, "Test created successfully", 201);
  } catch (error: any) {
    sendError(res, error.message || "Error creating test");
  }
};

export const fetchTests = async (req: Request, res: Response): Promise<void> => {
  try {
    const testsCollectionRef = db.collection(FIREBASE_TABLES.TESTS);
    const testsSnapshot = await testsCollectionRef.get();
    const tests = testsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    sendSuccess(res, tests, "Tests fetched successfully");
  } catch (error: any) {
    sendError(res, error.message || "Error fetching tests");
  }
};

export const fetchTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;
    if (!testId) {
      sendError(res, "testId cannot be empty", 400);
      return;
    }
    const testRef = db.collection(FIREBASE_TABLES.TESTS).doc(testId);
    const testSnapshot = await testRef.get();

    if (testSnapshot.exists) {
      sendSuccess(
        res,
        { id: testSnapshot.id, ...testSnapshot.data() },
        "Test fetched successfully",
      );
    } else {
      sendError(res, "Test not found", 404);
    }
  } catch (error: any) {
    sendError(res, error.message || "Error fetching test");
  }
};
