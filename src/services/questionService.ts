import { db, TABLES } from "../config/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { Question } from "common/models/Question";
import { TestFormValues } from "components/TestDetailsForm";

export const uploadQuestions = async (
  testId: string | undefined,
  questions: Question[],
) => {
  try {
    if (!testId) throw Error("testId cannot be empty");
    const testRef = doc(db, TABLES.TESTS, testId);
    await updateDoc(testRef, {
      questions: arrayUnion(...questions),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error uploading questions:", error);
    return { success: false, error: error.message };
  }
};

export const createTest = async (testDetails: TestFormValues | undefined) => {
  try {
    if (!testDetails) throw Error("testDetails cannot be empty");
    const testRef = collection(db, TABLES.TESTS);
    const newTestRef = await addDoc(testRef, { ...testDetails, questions: [] });
    return { success: true, testId: newTestRef.id };
  } catch (error: any) {
    console.error("Error creating test:", error);
    return { success: false, error: error.message };
  }
};
