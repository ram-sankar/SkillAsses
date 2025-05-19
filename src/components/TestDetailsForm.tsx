import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Grid,
} from "@mui/material";
import { QuestionType } from "common/models/Question";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "./Button";
import "./styles/TestDetailsForm.scss";
import { useEffect } from "react";

interface TestDetailsFormProps {
  onSubmit: (values: TestFormValues) => void;
  isLoading: boolean;
  initialValues?: TestFormValues;
}

export interface TestFormValues {
  topic: string;
  candidateLevel: string;
  difficulty: string;
  questionType: QuestionType;
  testDuration: string;
  numQuestions: string;
}

const candidateLevels = ["Fresher", "2-4 YOE", "4-8 YOE", "8+ YOE"];
const difficultyLevels = ["Easy", "Medium", "Hard"];
const questionTypes = [
  { text: "Text Answer", value: QuestionType.TEXT },
  { text: "Coding Problem", value: QuestionType.CODE },
  { text: "Both", value: "both" },
];

const validationSchema = Yup.object({
  topic: Yup.string().required("Required"),
  candidateLevel: Yup.string().required("Required"),
  difficulty: Yup.string().required("Required"),
  questionType: Yup.string().required("Required"),
  testDuration: Yup.number().min(1, "Must be > 0").required("Required"),
  numQuestions: Yup.number().min(1, "At least 1").required("Required"),
});

const TestDetailsForm = ({
  onSubmit,
  isLoading,
  initialValues,
}: TestDetailsFormProps) => {
  const formik = useFormik<TestFormValues>({
    initialValues: {
      topic: "",
      candidateLevel: candidateLevels[0],
      difficulty: difficultyLevels[0],
      questionType: QuestionType.TEXT,
      testDuration: "10",
      numQuestions: "10",
    },
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (initialValues) {
      formik.setValues(initialValues);
    }
  }, [formik, initialValues]);

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="test-form">
      <TextField
        label="Topic"
        name="topic"
        value={formik.values.topic}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.topic && Boolean(formik.errors.topic)}
        helperText={formik.touched.topic && formik.errors.topic}
        fullWidth
        margin="normal"
        required
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            required
            margin="normal"
            error={
              formik.touched.candidateLevel &&
              Boolean(formik.errors.candidateLevel)
            }
          >
            <InputLabel>Candidate Level</InputLabel>
            <Select
              name="candidateLevel"
              value={formik.values.candidateLevel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Candidate Level"
            >
              {candidateLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.candidateLevel && formik.errors.candidateLevel && (
              <Box color="error.main" fontSize="0.75rem" mt={0.5}>
                {formik.errors.candidateLevel}
              </Box>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            required
            margin="normal"
            error={
              formik.touched.difficulty && Boolean(formik.errors.difficulty)
            }
          >
            <InputLabel>Difficulty</InputLabel>
            <Select
              name="difficulty"
              value={formik.values.difficulty}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Difficulty"
            >
              {difficultyLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.difficulty && formik.errors.difficulty && (
              <Box color="error.main" fontSize="0.75rem" mt={0.5}>
                {formik.errors.difficulty}
              </Box>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            required
            margin="normal"
            error={
              formik.touched.questionType && Boolean(formik.errors.questionType)
            }
          >
            <InputLabel>Question Type</InputLabel>
            <Select
              name="questionType"
              value={formik.values.questionType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Question Type"
            >
              {questionTypes.map((questionType) => (
                <MenuItem key={questionType.value} value={questionType.value}>
                  {questionType.text}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.questionType && formik.errors.questionType && (
              <Box color="error.main" fontSize="0.75rem" mt={0.5}>
                {formik.errors.questionType}
              </Box>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label="Test Duration (minutes)"
            name="testDuration"
            type="number"
            inputProps={{ min: 1 }}
            value={formik.values.testDuration}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.testDuration && Boolean(formik.errors.testDuration)
            }
            helperText={
              formik.touched.testDuration && formik.errors.testDuration
            }
            fullWidth
            margin="normal"
            required
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label="Number of Questions"
            name="numQuestions"
            type="number"
            inputProps={{ min: 1 }}
            value={formik.values.numQuestions}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.numQuestions && Boolean(formik.errors.numQuestions)
            }
            helperText={
              formik.touched.numQuestions && formik.errors.numQuestions
            }
            fullWidth
            margin="normal"
            required
          />
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          type="reset"
          onClick={formik.handleReset}
          disabled={isLoading}
          color="secondary"
          outline={true.valueOf()}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Questions"}
        </Button>
      </Box>
    </form>
  );
};

export default TestDetailsForm;
