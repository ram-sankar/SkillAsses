export interface Assignment {
  id: string;
  testId: string;
  candidateMailId: string;
  recruiterMailId: string;
  status: string;
  dueDate: number;
  assignedDate: number;
  submissionDate: number | null;
  score: number | null;
  feedback: string | null;
  candidateResponses: {
    [key: string]: string;
  };
}
