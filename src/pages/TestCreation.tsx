import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Button as MUIButton,
} from "@mui/material";
import { useState } from "react";
import TestDetailsForm, { TestFormValues } from "../components/TestDetailsForm";
import QuestionList from "../components/QuestionList";
import { Question, QuestionType } from "../common/models/Question";
import "./styles/TestCreation.scss";
import TopBar from "components/TopBar";
import {
  generatePromptForQuestionCreation,
  getResponseFromPrompt,
} from "services/genaiService";
import Button from "components/Button";
import { createTest, uploadQuestions } from "services/questionService";

const TestCreation = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "What is React?",
      type: QuestionType.TEXT,
    },
    {
      id: 2,
      text: "What is JSX?",
      type: QuestionType.TEXT,
    },
    {
      id: 3,
      text: "What are React components?",
      type: QuestionType.TEXT,
    },
    {
      id: 4,
      text: "What is the purpose of the `render()` method in React?",
      type: QuestionType.TEXT,
    },
    {
      id: 5,
      text: "What is a React element?",
      type: QuestionType.TEXT,
    },
    {
      id: 6,
      text: "What is the difference between a class component and a functional component?",
      type: QuestionType.TEXT,
    },
    {
      id: 7,
      text: "What are props in React?",
      type: QuestionType.TEXT,
    },
    {
      id: 8,
      text: "What is state in React?",
      type: QuestionType.TEXT,
    },
    {
      id: 9,
      text: "How do you update the state of a component in React?",
      type: QuestionType.TEXT,
    },
    {
      id: 10,
      text: "What is the purpose of `setState()` in React?",
      type: QuestionType.TEXT,
    },
  ]);
  const [formValues, setFormValues] = useState<TestFormValues>();

  const handleFormSubmit = async (values: TestFormValues) => {
    setLoading(true);
    setQuestions([]);
    setFormValues(values);

    const questionCreationPrompt = generatePromptForQuestionCreation(values);
    const responseText = await getResponseFromPrompt(questionCreationPrompt);

    const jsonString = responseText.replace(/```json|```/g, "").trim();
    const parsed: any[] = JSON.parse(jsonString);
    const formattedQuestions: Question[] = parsed.map((q, index) => ({
      id: index + 1,
      text: q.text,
      type: q.type,
    }));
    console.log(formattedQuestions);

    setQuestions(formattedQuestions);
    setLoading(false);
  };

  const handleCreateTest = async () => {
    const testCreationResponse = await createTest(formValues);
    if (!testCreationResponse.success) {
      console.error("Failed to create test:", testCreationResponse.error);
    } else {
      const uploadQuestionsReponse = await uploadQuestions(
        testCreationResponse?.testId,
        questions,
      );
      if (!uploadQuestionsReponse.success) {
        console.error(
          "Failed to upload questions:",
          uploadQuestionsReponse.error,
        );
      } else {
        console.log("Test created successfully", testCreationResponse.testId);
      }
    }
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
                Generated Questions for {formValues?.topic}
              </Typography>

              <Box className="questionList">
                <QuestionList
                  questions={questions}
                  onUpdate={updateQuestion}
                  onDelete={deleteQuestion}
                />
              </Box>

              <Box mt={2}>
                <MUIButton
                  className="pr-3"
                  variant="outlined"
                  color="error"
                  onClick={resetAll}
                >
                  Clear Questions
                </MUIButton>
                <Button className="ml-3" onClick={handleCreateTest}>
                  Create Test
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
