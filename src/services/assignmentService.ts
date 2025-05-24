import { db, TABLES } from "../config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getUserDetails } from "./authService";
import { Assignment } from "common/models/Assignment";
import { UserType } from "common/models/User";

export const createAssignment = async (testId: string, candidateMailId: string) => {
  try {
    const assignmentId = doc(collection(db, TABLES.ASSIGNMENTS)).id; // Generate a unique ID
    const assignedDate = Date.now();
    const recruiterMailId = getUserDetails().email;

    await setDoc(doc(db, TABLES.ASSIGNMENTS, assignmentId), {
      testId: testId,
      candidateMailId: candidateMailId,
      recruiterMailId: recruiterMailId,
      status: "assigned",
      assignedDate: assignedDate,
      submissionDate: null,
      score: null,
      feedback: null,
      candidateResponses: {},
    });

    return { success: true, assignmentId: assignmentId };
  } catch (error: any) {
    console.error("Error creating assignment:", error);
    return { success: false, error: error.message };
  }
};

export const getAssignments = async (userType: UserType, shouldReturnFilteredList: boolean) => {
  const assignmentsRef = collection(db, TABLES.ASSIGNMENTS);
  let q: any;

  if (userType === UserType.RECRUITER) {
    const recruiterUid = getUserDetails().uid;
    q = query(assignmentsRef, where("recruiterUid", "==", recruiterUid));
  } else {
    const candidateMailId = getUserDetails().email;
    q = query(assignmentsRef, where("candidateMailId", "==", candidateMailId));
  }

  const snapshot = await getDocs(q);
  const assignments: any[] = [];
  for (const firebaseDoc of snapshot.docs) {
    const assignmentData = firebaseDoc.data() as Assignment;
    const testId = assignmentData.testId;

    const testDoc = await getDoc(doc(db, TABLES.TESTS, testId));
    const testData = testDoc?.data();

    if (testData) {
      const assignedDate =
        typeof assignmentData.assignedDate === "number"
          ? new Date(assignmentData.assignedDate)
          : null;
      const formattedDate = assignedDate
        ? `${assignedDate.getDate().toString().padStart(2, "0")}-${(assignedDate.getMonth() + 1).toString().padStart(2, "0")}-${assignedDate.getFullYear()}`
        : null;

      assignments.push({
        id: firebaseDoc.id,
        testId: assignmentData.testId,
        candidateMailId: assignmentData.candidateMailId,
        recruiterMailId: assignmentData.recruiterMailId,
        testTitle: testData.topic,
        status: assignmentData.status,
        overallScore: assignmentData.overallScore,
        assignedDate: formattedDate,
      });
    }
  }

  if (shouldReturnFilteredList) {
    if (userType === UserType.RECRUITER) {
      return assignments.map((assignment) => {
        const { recruiterMailId, ...rest } = assignment;
        return rest;
      });
    } else if (userType === UserType.CANDIDATE) {
      return assignments.map((assignment) => {
        const { candidateMailId, ...rest } = assignment;
        return rest;
      });
    } else {
      console.error("Invalid user type:", userType);
      return [];
    }
  }

  return assignments;
};

export const getAssignmentById = async (assignmentId: string): Promise<any | null> => {
  try {
    const assignmentRef = doc(db, TABLES.ASSIGNMENTS, assignmentId);
    const assignmentSnapshot = await getDoc(assignmentRef);

    if (assignmentSnapshot.exists()) {
      return {
        assignmentId: assignmentSnapshot.id,
        ...assignmentSnapshot.data(),
      };
    } else {
      console.warn(`Assignment with ID ${assignmentId} not found`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return null;
  }
};

export const saveAnswerAndScore = async (
  assignmentId: string,
  questionId: string,
  answer: string,
  score: number,
  overallScore: number,
) => {
  try {
    const assignmentRef = doc(db, TABLES.ASSIGNMENTS, assignmentId);
    await updateDoc(assignmentRef, {
      [`candidateResponses.${questionId}.answer`]: answer,
      [`candidateResponses.${questionId}.score`]: score,
      overallScore: overallScore,
      status: "completed",
    });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save answer and score:", error);
    return { success: false, error: error.message };
  }
};
