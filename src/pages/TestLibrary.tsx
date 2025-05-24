import { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import "./styles/Assignments.scss";
import { fetchTests } from "../services/questionService";
import TableComponent from "components/TableComponent";
import { testColumns } from "common/constants";
import { TestData } from "common/models/Question";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import Button from "components/Button";
import { createAssignment } from "services/assignmentService";
import { toast } from "react-toastify";
import { Close } from "@mui/icons-material";

const TestLibrary = () => {
  const [testsData, setTestsData] = useState<TestData[]>([]);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchAndDisplayTests = async () => {
      const tests = await fetchTests();
      setTestsData(tests);
    };
    fetchAndDisplayTests();
  }, []);

  const handleAssignClick = (testId: string) => {
    setSelectedTestId(testId);
    setOpenAssignModal(true);
  };

  const handleAssignSubmit = async () => {
    const result = await createAssignment(selectedTestId || "", email);

    if (result.success) {
      toast.success("Assignment created successfully!");
    } else {
      console.error("Error creating assignment:", result.error);
      toast.error("Failed to create assignment.");
    }
    setOpenAssignModal(false);
    setEmail("");
  };

  const renderActions = (item: TestData) => (
    <Button outline style={{ marginLeft: "8px" }} onClick={() => handleAssignClick(item.id)}>
      Assign
    </Button>
  );

  return (
    <>
      <TopBar />
      <div className="assignment-container">
        <TableComponent
          data={testsData}
          columns={testColumns}
          title="Test Library"
          subtitle="Browse the list of tests you’ve created."
          baseUrl="/recruiter/test-library"
          buttonText="Create Test"
          navigateTo="/recruiter/test-library/new"
          renderActions={renderActions}
        />
      </div>

      <Dialog
        open={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        PaperProps={{
          sx: {
            width: 400,
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          Assign Test
          <IconButton
            style={{ position: "absolute", right: 8, top: 8 }}
            onClick={() => setOpenAssignModal(false)}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Candidate Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignModal(false)} outline size="md">
            Cancel
          </Button>
          <Button onClick={handleAssignSubmit} disabled={!email.trim()} size="md">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TestLibrary;
