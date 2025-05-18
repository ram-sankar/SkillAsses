import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { useState } from "react";
import TestDetailsForm, { TestFormValues } from "../components/TestDetailsForm";
import QuestionList from "../components/QuestionList";
import { Question } from "../constants/models/Question";
import "./styles/TestCreation.scss";
import TopBar from "components/TopBar";

const TestCreation = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const generatePrompt = (values: TestFormValues) => {
    const numQuestions = Number(values.numQuestions) || 5;
    const difficulty = values.difficulty || "medium";
    const candidateLevel = values.candidateLevel || "fresher";
    const topic = values.topic.trim();
    const tags = values.tags ? ` with tags: ${values.tags}` : "";

    const basePrompt = `Generate exactly ${numQuestions} ${difficulty} difficulty`;
    const candidateTopic = `for ${candidateLevel} candidates on the topic '${topic}'${tags}.`;
    const jsonInstruction = `
  Please respond only with a valid JSON array of objects where each object has the following structure:
  {
    "id": unique integer,
    "type": TYPE_PLACEHOLDER,
    "text": string containing the question
  }
  Do not include any explanation or extra text outside the JSON Array.
    `.trim();

    if (values.questionType === "both") {
      const half = Math.floor(numQuestions / 2);
      const remainder = numQuestions - half;
      const questionBody = `
        The questions should be a mix of:
        - ${half} textual questions that test theoretical knowledge.
        - ${remainder} coding problems that require writing a function or algorithm.
            `.trim();

      return `
        ${basePrompt} questions ${candidateTopic}
        ${questionBody}

        ${jsonInstruction.replace("TYPE_PLACEHOLDER", `either "text" or "coding"`)}
            `.trim();
    } else if (values.questionType === "coding") {
      const questionBody = `coding problems that require writing a function or algorithm.`;

      return `
        ${basePrompt} ${questionBody} ${candidateTopic}

        ${jsonInstruction.replace("TYPE_PLACEHOLDER", `"coding"`)}
            `.trim();
    } else {
      // text answer questions
      const questionBody = `textual questions that test theoretical knowledge.`;

      return `
        ${basePrompt} ${questionBody} ${candidateTopic}

        ${jsonInstruction.replace("TYPE_PLACEHOLDER", `"text"`)}
      `.trim();
    }
  };

  const handleFormSubmit = (values: TestFormValues) => {
    setLoading(true);
    setQuestions([]);
    const prompt = generatePrompt(values);
    console.log("Prompt sent to AI:", prompt);

    setTimeout(() => {
      // Fake AI response generation
      const fakeQuestions = Array.from(
        { length: Number(values.numQuestions) || 5 },
        (_, i) => ({
          id: Date.now() + i,
          text: `${values.questionType} question ${i + 1} about ${values.topic}`,
        }),
      );
      setQuestions(fakeQuestions);
      setLoading(false);
    }, 2000);
  };

  const updateQuestion = (updated: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q)),
    );
  };

  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const resetAll = () => {
    setQuestions([]);
  };

  return (
    <>
      <TopBar />
      <Container maxWidth="md" className="testCreationPage">
        <Typography variant="h4" className="pageTitle">
          Create a New Test
        </Typography>

        <Box className="testCard">
          <TestDetailsForm onSubmit={handleFormSubmit} isLoading={loading} />
        </Box>

        <Box mt={4}>
          {loading && (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          )}

          {!loading && questions.length > 0 && (
            <>
              <Typography variant="h5" className="sectionTitle" mb={2}>
                Generated Questions
              </Typography>

              <Box className="questionList">
                <QuestionList
                  questions={questions}
                  onUpdate={updateQuestion}
                  onDelete={deleteQuestion}
                />
              </Box>

              <Box mt={2}>
                <Button variant="outlined" color="error" onClick={resetAll}>
                  Clear Questions
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </>
  );
};

export default TestCreation;
