import { UserType } from "common/models/User";
import axiosInstance, { handleRequestError } from "./axiosInstance";

const API_URL = "/api/assignments";

export const createAssignment = async (testId: string, candidateMailId: string) => {
  try {
    const response = await axiosInstance.post(API_URL, { testId, candidateMailId });

    return { success: true, assignmentId: response.data.assignmentId };
  } catch (error: any) {
    return handleRequestError(error, "Error creating assignment");
  }
};

export const getAssignments = async (userType: UserType, shouldReturnFilteredList: boolean) => {
  // const assignmentsRef = collection(db, TABLES.ASSIGNMENTS);
  // let q: any;

  // if (userType === UserType.RECRUITER) {
  //   const recruiterMailId = getUserDetails().email;
  //   q = query(assignmentsRef, where("recruiterMailId", "==", recruiterMailId));
  // } else {
  //   const candidateMailId = getUserDetails().email;
  //   q = query(assignmentsRef, where("candidateMailId", "==", candidateMailId));
  // }

  // const snapshot = await getDocs(q);
  // const assignments: any[] = [];
  // for (const firebaseDoc of snapshot.docs) {
  //   const assignmentData = firebaseDoc.data() as Assignment;
  //   const testId = assignmentData.testId;

  //   const testDoc = await getDoc(doc(db, TABLES.TESTS, testId));
  //   const testData = testDoc?.data();

  //   if (testData) {
  //     const assignedDate =
  //       typeof assignmentData.assignedDate === "number"
  //         ? new Date(assignmentData.assignedDate)
  //         : null;
  //     const formattedDate = assignedDate
  //       ? `${assignedDate.getDate().toString().padStart(2, "0")}-${(assignedDate.getMonth() + 1).toString().padStart(2, "0")}-${assignedDate.getFullYear()}`
  //       : null;

  //     const candidateResponses = Object.values(assignmentData.candidateResponses);
  //     const totalScore =
  //       candidateResponses?.reduce?.((sum, item) => sum + (item.score || 0), 0) || 0;
  //     const avgScore = candidateResponses.length
  //       ? ((totalScore / candidateResponses.length) * 10).toFixed(0)
  //       : "0";

  //     assignments.push({
  //       id: firebaseDoc.id,
  //       testId: assignmentData.testId,
  //       candidateMailId: assignmentData.candidateMailId,
  //       recruiterMailId: assignmentData.recruiterMailId,
  //       testTitle: testData.topic,
  //       status: assignmentData.status,
  //       overallScore: avgScore + "%",
  //       assignedDate: formattedDate,
  //     });
  //   }
  // }

  try {
    const response = await axiosInstance.get(
      `${API_URL}?userType=${userType}&shouldReturnFilteredList=${shouldReturnFilteredList}`,
    );

    return response.data;
  } catch (error: any) {
    return handleRequestError(error, "Error getting assignments");
  }
};

export const getAssignmentById = async (assignmentId: string): Promise<any | null> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${assignmentId}`);

    return response.data;
  } catch (error: any) {
    return handleRequestError(error, "Error fetching assignment");
  }
};

export const saveAnswerAndScore = async (
  assignmentId: string,
  questionId: string,
  answer: string,
  score: number,
  status: string,
) => {
  try {
    const payload = {
      questionId,
      answer,
      score,
      status,
    };
    const response = await axiosInstance.put(`${API_URL}/${assignmentId}/answer`, payload);
    return { success: true };
  } catch (error: any) {
    return handleRequestError(error, "Failed to save answer and score");
  }
};
