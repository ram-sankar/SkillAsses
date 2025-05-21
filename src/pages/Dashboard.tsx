import { useNavigate } from "react-router-dom";
import { isLoggedIn, getUserDetails } from "../services/authService";
import { UserType } from "../common/models/User";
import { Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import TopBar from "components/TopBar";
import SummaryCard from "components/SummaryCard";
import "./styles/Dashboard.scss";
import TableComponent from "components/TableComponent";
import { assignmentColumns } from "common/constants";

const assignments = [
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingAssessments, setPendingAssessments] = useState(0);
  const [completedAssessments, setCompletedAssessments] = useState(0);

  useEffect(() => {
    const userDetails = getUserDetails();
    setUserType(userDetails.userType);

    if (!isLoggedIn()) {
      navigate("/login");
    }

    setTotalAssignments(10);
    setTotalUsers(25);
    setPendingAssessments(5);
    setCompletedAssessments(12);
  }, [navigate]);

  return (
    <>
      <TopBar />
      <Container maxWidth="lg" className="dashboardContainer">
        <Grid container spacing={3} className="summaryGrid">
          <Grid item xs={12} md={3}>
            <SummaryCard title="Total Assignments" count={totalAssignments} href="/recruiter/assignments" />
          </Grid>
          <Grid item xs={12} md={3}>
            <SummaryCard title="Total Candidates" count={totalUsers} href="/recruiter/user-management" />
          </Grid>
          <Grid item xs={12} md={3}>
            <SummaryCard title="Pending Assessments" count={completedAssessments} href="/recruiter/assignments?assignmentStatus=pending" />
          </Grid>
          <Grid item xs={12} md={3}>
            <SummaryCard title="Interview Ready" count={pendingAssessments} href="/recruiter/assignments?assignmentStatus=completed" />
          </Grid>
        </Grid>

        <div className="assignmentSection">
          <TableComponent
            data={assignments}
            columns={assignmentColumns(userType as UserType)}
            title="Recent Assignments Overview"
            subtitle="Monitor candidate progress and upcoming deadlines"
          />
        </div>
      </Container>
    </>
  );
};

export default Dashboard;
