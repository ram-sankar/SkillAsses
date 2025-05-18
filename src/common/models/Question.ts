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
