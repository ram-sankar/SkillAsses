import { db, TABLES } from "../config/firebase";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { getUserDetails } from "./authService";
import { Assignment } from "common/models/Assignment";

export const createAssignment = async (testId: string, candidateMailId: string) => {
  try {
    const assignmentId = doc(collection(db, TABLES.ASSIGNMENTS)).id; // Generate a unique ID
    const assignedDate = Date.now();
    const recruiterUid = getUserDetails().uid;

    await setDoc(doc(db, TABLES.ASSIGNMENTS, assignmentId), {
      testId: testId,
      candidateMailId: candidateMailId,
      recruiterUid: recruiterUid,
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

export const getRecruiterAssignments = async () => {
  const recruiterUid = getUserDetails().uid;
  const assignmentsRef = collection(db, TABLES.ASSIGNMENTS);
  const q = query(assignmentsRef, where("recruiterUid", "==", recruiterUid));
  const snapshot = await getDocs(q);

  const assignments: any[] = [];
  for (const firebaseDoc of snapshot.docs) {
    const assignmentData = firebaseDoc.data() as Assignment;
    const testId = assignmentData.testId;

    const testDoc = await getDoc(doc(db, TABLES.TESTS, testId));
    const testData = testDoc?.data();

    if (testData) {
      const assignedDate = typeof assignmentData.assignedDate === "number" ? new Date(assignmentData.assignedDate) : null;
      const formattedDate = assignedDate
        ? `${assignedDate.getDate().toString().padStart(2, "0")}-${(assignedDate.getMonth() + 1).toString().padStart(2, "0")}-${assignedDate.getFullYear()}`
        : null;

      assignments.push({
        assignmentId: firebaseDoc.id,
        candidateMailId: assignmentData.candidateMailId,
        testTitle: testData.topic,
        status: assignmentData.status,
        assignedDate: formattedDate,
      });
    }
  }

  return assignments;
};
