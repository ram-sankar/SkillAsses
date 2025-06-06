import { Container, Typography, CircularProgress, Box } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import TestDetailsForm, { TestFormValues } from "../components/TestDetailsForm";
import QuestionList from "../components/QuestionList";
import { Question } from "../common/models/Question";
import "./styles/TestCreation.scss";
import TopBar from "components/TopBar";
import { generatePromptForQuestionCreation, getResponseFromPrompt } from "services/genaiService";
import Button from "components/Button";
import { createOrUpdateTest, uploadQuestions, fetchTest } from "services/questionService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const TestCreation = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [isQuestionGenerationInProgress, setIsQuestionGenerationInProgress] = useState(false);
  const [isFormSubmissionInProgress, setIsFormSubmissionInProgress] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formInitialValue, setFormInitialValue] = useState<TestFormValues>();
  const [formValues, setFormValues] = useState<TestFormValues>();
  const isUpdateMode = testId !== "new";

  const fetchData = useCallback(async () => {
    if (isUpdateMode && testId) {
      setIsQuestionGenerationInProgress(true);
      const testData = await fetchTest(testId);
      if (testData) {
        setFormInitialValue(testData);
        setFormValues(testData);
        setQuestions(testData.questions || []);
      }
      setIsQuestionGenerationInProgress(false);
    }
  }, [testId]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateQuestion = async (values: TestFormValues) => {
    setIsQuestionGenerationInProgress(true);
    setQuestions([]);
    setFormValues(values);

    try {
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
    } catch (error: any) {
      console.error("Error parsing JSON:", error.message);
    } finally {
      setIsQuestionGenerationInProgress(false);
    }
  };

  const handleFormSubmission = async () => {
    setIsFormSubmissionInProgress(true);
    console.log(formValues);
    const testCreationResponse = await createOrUpdateTest(formValues, testId);
    console.log(testCreationResponse);
    if (!testCreationResponse.success) {
      console.error("Failed to create/update test:", testCreationResponse.error);
      toast.error("Failed to create test");
    } else {
      callUploadQuestions(isUpdateMode ? testId : testCreationResponse?.testId);
    }

    setIsFormSubmissionInProgress(false);
  };

  const callUploadQuestions = async (testIdLocal: string | undefined) => {
    const uploadQuestionsReponse = await uploadQuestions(testIdLocal, questions);
    if (!uploadQuestionsReponse.success) {
      console.error("Failed to upload questions:", uploadQuestionsReponse.error);
      toast.error("Failed to upload questions");
    } else {
      toast.success(
        `${formValues?.topic || "Test"} ${isUpdateMode ? "updated" : "created"} successfully!`,
      );
      navigate("/recruiter/test-library");
    }
  };

  const updateQuestion = (updated: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  };

  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <>
      <TopBar />
      <Container maxWidth="md" className="testCreationPage">
        <Typography variant="h4" className="pageTitle">
          {isUpdateMode ? "Update Test" : "Create a New Test"}
        </Typography>

        <Box className="testCard">
          <TestDetailsForm
            onSubmit={handleGenerateQuestion}
            isLoading={isQuestionGenerationInProgress}
            initialValues={formInitialValue}
          />
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
                <QuestionList
                  questions={questions}
                  onUpdate={updateQuestion}
                  onDelete={deleteQuestion}
                />
              </Box>

              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFormSubmission}
                  disabled={isFormSubmissionInProgress}
                >
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
