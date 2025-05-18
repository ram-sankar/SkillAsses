import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Assignment } from "../constants/models/Assignment";
import "./styles/AssignmentTable.scss";

interface AssignmentTableProps {
  assignments: Assignment[];
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({ assignments }) => {
  return (
    <Box mt={4} className="assignmentTable">
      <Typography variant="h5">Recent Assignments Overview</Typography>
      <Typography variant="subtitle1">
        Monitor candidate progress and upcoming deadlines
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Assignment Title</TableCell>
              <TableCell>Candidate Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Interview Stage</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.title}>
                <TableCell>{assignment.title}</TableCell>
                <TableCell>{assignment.candidate}</TableCell>
                <TableCell>
                  <span
                    className={`status-badge ${assignment.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {assignment.status}
                  </span>
                </TableCell>
                <TableCell>{assignment.dueDate}</TableCell>
                <TableCell>{assignment.interviewStage}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AssignmentTable;
