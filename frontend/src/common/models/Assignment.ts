export interface Assignment {
  id: string;
  testId: string;
  candidateMailId: string;
  recruiterMailId: string;
  status: STATUS;
  dueDate: number;
  assignedDate: number;
  submissionDate: number | null;
  score: number | null;
  feedback: string | null;
  overallScore: number;
  candidateResponses: {
    [key: number]: CandidateResponse;
  };
}

export interface CandidateResponse {
  score: number;
  answer: string;
}

export enum STATUS {
  COMPLETED = "completed",
  IN_PROGRESS = "in-progress",
  ASSIGNED = "assigned",
}
