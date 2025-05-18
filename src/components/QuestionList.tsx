import "./styles/QuestionList.scss";
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import { Question, QuestionType } from "../common/models/Question";

interface QuestionListProps {
  questions: Question[];
  onUpdate: (updatedQuestion: Question) => void;
  onDelete: (id: number) => void;
}

const QuestionList = ({ questions, onUpdate, onDelete }: QuestionListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [questionType, setQuestionType] = useState<QuestionType>(
    QuestionType.CODE,
  );
  const [editingText, setEditingText] = useState("");

  const startEditing = (id: number, text: string, quesType: QuestionType) => {
    setEditingId(id);
    setEditingText(text);
    setQuestionType(quesType);
  };

  const saveEdit = () => {
    if (editingId !== null) {
      onUpdate({ id: editingId, text: editingText, type: questionType });
      setEditingId(null);
      setEditingText("");
    }
  };

  return (
    <Box className="question-card-container">
      {questions.map((q) =>
        editingId === q.id ? (
          <Card key={q.id} className="question-card editing">
            <CardContent>
              <TextField
                multiline
                fullWidth
                maxRows={6}
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                variant="outlined"
                className="edit-field"
              />
            </CardContent>
            <CardActions className="card-actions">
              <Button
                onClick={saveEdit}
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </CardActions>
          </Card>
        ) : (
          <Card key={q.id} className="question-card">
            <Box className="card-row">
              <Typography variant="body1" className="question-text">
                {q.text}
              </Typography>
              <Box className="card-actions">
                <IconButton
                  onClick={() => startEditing(q.id, q.text, q.type)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(q.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Card>
        ),
      )}
    </Box>
  );
};

export default QuestionList;
