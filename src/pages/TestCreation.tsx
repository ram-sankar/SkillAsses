import { Container, Typography, CircularProgress, Box } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import TestDetailsForm, { TestFormValues } from "../components/TestDetailsForm";
import QuestionList from "../components/QuestionList";
import { Question } from "../common/models/Question";
import "./styles/TestCreation.scss";
import TopBar from "components/TopBar";
import { generatePromptForQuestionCreation, getResponseFromPrompt } from "services/genaiService";
import Button from "components/Button";
import { createTest, uploadQuestions, fetchTest } from "services/questionService";
import { useNavigate, useParams } from "react-router-dom";

const TestCreation = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [isQuestionGenerationInProgress, setIsQuestionGenerationInProgress] = useState(false);
  const [isFormSubmissionInProgress, setIsFormSubmissionInProgress] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formValues, setFormValues] = useState<TestFormValues>();
  const isUpdateMode = testId !== "new";

  const fetchData = useCallback(async () => {
    if (testId) {
      setIsQuestionGenerationInProgress(true);
      const testData = await fetchTest(testId);
      if (testData) {
        setFormValues(testData);
        setQuestions(testData.questions || []);
      }
      setIsQuestionGenerationInProgress(false);
    }
  }, [testId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGenerateQuestion = async (values: TestFormValues) => {
    setIsQuestionGenerationInProgress(true);
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

    setQuestions(formattedQuestions);
    setIsQuestionGenerationInProgress(false);
  };

  const handleFormSubmission = async () => {
    setIsFormSubmissionInProgress(true);
    const testCreationResponse = await createTest(formValues, testId);
    if (!testCreationResponse.success) {
      console.error("Failed to create/update test:", testCreationResponse.error);
    } else {
      const uploadQuestionsReponse = await uploadQuestions(testCreationResponse?.testId, questions);
      if (!uploadQuestionsReponse.success) {
        console.error("Failed to upload questions:", uploadQuestionsReponse.error);
      } else {
        console.log("Test created/updated successfully", testCreationResponse.testId);
        navigate("/recruiter/test-library");
      }
    }
    setIsFormSubmissionInProgress(false);
  };

  const updateQuestion = (updated: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
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
          {isUpdateMode ? "Update Test" : "Create a New Test"}
        </Typography>

        <Box className="testCard">
          <TestDetailsForm onSubmit={handleGenerateQuestion} isLoading={isQuestionGenerationInProgress} initialValues={formValues} />
        </Box>

        <Box mt={4}>
          {isQuestionGenerationInProgress && (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          )}

          {!isQuestionGenerationInProgress && questions.length > 0 && (
            <>
              <Typography variant="h5" className="sectionTitle" mb={2}>
                Generated Questions for {formValues?.topic}
              </Typography>

              <Box className="questionList">
                <QuestionList questions={questions} onUpdate={updateQuestion} onDelete={deleteQuestion} />
              </Box>

              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" color="primary" onClick={handleFormSubmission} disabled={isFormSubmissionInProgress}>
                  {isUpdateMode ? "Update Test" : "Create Test"}
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
