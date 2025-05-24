import React from "react";
import { QuestionType, Question } from "common/models/Question";
import ReactCodeMirror from "@uiw/react-codemirror";

type Props = {
  question: Question;
  answer: string;
  onChange: (value: string) => void;
};

const QuestionRenderer: React.FC<Props> = ({ question, answer, onChange }) => {
  if (question.type === QuestionType.CODE) {
    return <ReactCodeMirror theme="dark" value={answer} height="300px" onChange={onChange} />;
  }

  if (question.type === QuestionType.TEXT) {
    return (
      <textarea
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your answer here"
        className="w-full p-3 border rounded"
      />
    );
  }

  return <p>Unsupported question type.</p>;
};

export default QuestionRenderer;
