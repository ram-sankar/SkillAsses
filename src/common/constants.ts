import { UserType } from "./models/User";

export const assignmentColumns = (userType: UserType) => [
  { title: "Assignment Title", field: "testTitle" },
  { title: userType === UserType.CANDIDATE ? "Recruiter Mail Id" : "Candidate Mail Id", field: userType === UserType.CANDIDATE ? "recruiterMailId" : "candidateMailId" },
  { title: "Status", field: "status" },
  { title: "Assigned Date", field: "assignedDate" },
];

export const testColumns = [
  { title: "Test ID", field: "id" },
  { title: "Topic", field: "topic" },
  { title: "Number of Questions", field: "numQuestions" },
  { title: "Question Type", field: "questionType" },
  { title: "Candidate Level", field: "candidateLevel" },
  { title: "Difficulty", field: "difficulty" },
];
