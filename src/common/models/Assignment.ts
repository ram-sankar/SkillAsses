export interface Assignment {
  testId: string;
  candidateMailId: string;
  recruiterUid: string;
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
