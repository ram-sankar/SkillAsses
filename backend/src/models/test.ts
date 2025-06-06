export interface TestFormValues {
  topic: string;
  candidateLevel: string;
  difficulty: string;
  questionType: QuestionType;
  testDuration: string;
  numQuestions: string;
}

export enum QuestionType {
  CODE = "code",
  TEXT = "text",
  MIXED = "both",
}
