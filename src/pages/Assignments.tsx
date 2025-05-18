import { useState, useEffect } from "react";
import { Assignment } from "../constants/models/Assignment";
import AssignmentTable from "../components/AssignmentTable";
import TopBar from "../components/TopBar";
import "./styles/Assignments.scss";

const assignments: Assignment[] = [
  {
    title: "Coding Challenge 1",
    candidate: "John Doe",
    status: "Pending",
    dueDate: "2024-03-15",
    interviewStage: "Applied",
  },
  {
    title: "Technical Interview",
    candidate: "Jane Smith",
    status: "In Progress",
    dueDate: "2024-03-22",
    interviewStage: "Test Given",
  },
  {
    title: "Technical Interview",
    candidate: "Jane Smith",
    status: "Completed",
    dueDate: "2024-03-22",
    interviewStage: "Test Given",
  },
];

const Assignments = () => {
  const [assignmentsData, setAssignmentsData] = useState<Assignment[]>([]);

  useEffect(() => {
    setAssignmentsData(assignments);
  }, []);

  return (
    <>
      <TopBar />
      <div className="assignment-container">
        <AssignmentTable assignments={assignmentsData} />
      </div>
    </>
  );
};

export default Assignments;
