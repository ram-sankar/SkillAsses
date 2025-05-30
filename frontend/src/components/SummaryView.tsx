import React from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactCodeMirror from "@uiw/react-codemirror";
import Button from "components/Button";
import { Question, QuestionType } from "common/models/Question";
import "../pages/styles/CandidateTest.scss";

type Props = {
  questions: Question[];
  answers: { [key: string]: string };
  scores: { [key: string]: number };
};

const SummaryView: React.FC<Props> = ({ questions, answers, scores }) => {
  const navigate = useNavigate();

  const totalScore = questions.reduce((acc, q) => acc + (scores[q.id] || 0), 0);
  const averageScore = (totalScore / questions.length).toFixed(2);

  return (
    <Box
      className="summary-container"
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h4" mb={2} textAlign="center">
        Test Summary
      </Typography>
      <Typography variant="h5" mb={3} textAlign="center" color="primary">
        Overall Score: {averageScore} / 10
      </Typography>
      <div className="summary-list">
        {questions.map((q, idx) => (
          <Accordion key={q.id} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-content-${q.id}`}
              id={`panel-header-${q.id}`}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Q{idx + 1}: {q.text}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="secondary"
                  sx={{ fontWeight: "bold", ml: 2, whiteSpace: "nowrap" }}
                >
                  Score: {scores[q.id] ?? "N/A"}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {q.type === QuestionType.CODE ? (
                <ReactCodeMirror
                  value={answers[q.id]}
                  theme={"dark"}
                  height="200px"
                  editable={false}
                  basicSetup={{ lineNumbers: true }}
                  style={{ borderRadius: 4, border: "1px solid #ddd" }}
                />
              ) : (
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mt: 1, pl: 1 }}>
                  {answers[q.id]}
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
      <Box textAlign="center" mt={4}>
        <Button onClick={() => navigate("/candidate/assigned-test")}>Back to Assignments</Button>
      </Box>
    </Box>
  );
};

export default SummaryView;
