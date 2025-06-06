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
      questionId: questionId?.toString(),
      assignmentId,
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
