import { db, TABLES } from "../config/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
  getDoc,
  getDocs,
  FirestoreError,
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
      questions: questions,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error uploading questions:", error);
    return { success: false, error: error.message };
  }
};

export const createTest = async (
  testDetails: TestFormValues | undefined,
  testId?: string,
) => {
  try {
    if (!testDetails) throw Error("testDetails cannot be empty");

    if (testId) {
      // Update existing test
      const testRef = doc(db, TABLES.TESTS, testId);
      await updateDoc(testRef, { ...testDetails });
      return { success: true, testId: testId };
    } else {
      // Create new test
      const testRef = collection(db, TABLES.TESTS);
      const newTestRef = await addDoc(testRef, {
        ...testDetails,
        questions: [],
      });
      return { success: true, testId: newTestRef.id };
    }
  } catch (error: any) {
    console.error("Error creating/updating test:", error);
    return { success: false, error: error.message };
  }
};

export const fetchTests = async (): Promise<any[]> => {
  try {
    const testsCollectionRef = collection(db, TABLES.TESTS);
    const testsSnapshot = await getDocs(testsCollectionRef);
    const tests = testsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return tests;
  } catch (error) {
    console.error("Error fetching tests:", error);
    return []; // Return empty array on error
  }
};

export const fetchTest = async (testId: string | undefined): Promise<any> => {
  try {
    if (!testId) throw Error("testId cannot be empty");
    const testRef = doc(db, TABLES.TESTS, testId);
    const testSnapshot = await getDoc(testRef);

    if (testSnapshot.exists()) {
      return { id: testSnapshot.id, ...testSnapshot.data() };
    } else {
      console.log("Test not found");
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching test:", error);
    return null;
  }
};
