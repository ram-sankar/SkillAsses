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
import { Question } from "../common/models/Question";
import "./styles/TestCreation.scss";
import TopBar from "components/TopBar";
import {
  generatePromptForQuestionCreation,
  getResponseFromPrompt,
} from "services/genaiService";

const TestCreation = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testTopic, setTestTopic] = useState<string>("");

  const handleFormSubmit = async (values: TestFormValues) => {
    setLoading(true);
    setQuestions([]);
    setTestTopic(values.topic);

    const questionCreationPrompt = generatePromptForQuestionCreation(values);
    const responseText = await getResponseFromPrompt(questionCreationPrompt);

    const jsonString = responseText.replace(/```json|```/g, "").trim();
    const parsed: any[] = JSON.parse(jsonString);
    const formattedQuestions: Question[] = parsed.map((q, index) => ({
      id: index + 1,
      text: q.text,
      type: q.type,
    }));

    setQuestions(formattedQuestions);
    setLoading(false);
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
                Generated Questions for {testTopic}
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
