export interface Question {
  id: number;
  text: string;
  type: QuestionType;
}

export enum QuestionType {
  CODE = "code",
  TEXT = "text",
  MIXED = "both",
}

export interface TestData {
  id: string;
  questions: Question[];
  difficulty: string;
  candidateLevel: string;
  testDuration: string;
  topic: string;
  numQuestions: string;
  questionType: QuestionType;
}
