import axiosInstance from "./axiosInstance";
import { Question } from "common/models/Question";
import { TestFormValues } from "components/TestDetailsForm";

const API_BASE = "/api/tests";

export const uploadQuestions = async (testId: string | undefined, questions: Question[]) => {
  try {
    if (!testId) throw Error("testId cannot be empty in frontend");
    const response = await axiosInstance.put(`${API_BASE}/${testId}/questions`, { questions });
    return { success: true };
  } catch (error: any) {
    console.error("Error uploading questions:", error);
    return { success: false, error: error.message };
  }
};

export const createOrUpdateTest = async (
  testDetails: TestFormValues | undefined,
  testId?: string,
) => {
  try {
    if (!testDetails) throw Error("testDetails cannot be empty");

    let response;
    if (testId && testId !== "new") {
      // Update existing test
      response = await axiosInstance.put(`${API_BASE}/${testId}`, testDetails);
    } else {
      // Create new test
      response = await axiosInstance.post(`${API_BASE}`, testDetails);
    }
    return { success: true, testId: response?.data?.data?.testId };
  } catch (error: any) {
    console.error("Error creating/updating test:", error);
    return { success: false, error: error.message };
  }
};

export const fetchTests = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE}`);
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching tests:", error);
    return []; // Return empty array on error
  }
};

export const fetchTest = async (testId: string | undefined): Promise<any> => {
  try {
    if (!testId) throw Error("testId cannot be empty");
    const response = await axiosInstance.get(`${API_BASE}/${testId}`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching test:", error);
    return null;
  }
};
