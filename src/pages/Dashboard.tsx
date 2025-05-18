// import * as React from 'react';
import { useNavigate } from "react-router-dom";
import {
  logoutUser,
  isLoggedIn,
  getUserDetails,
} from "../services/authService";
import { UserType } from "../constants/models/User";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useEffect, useState } from "react";
import TopBar from "components/TopBar";
import SummaryCard from "components/SummaryCard";
import Button from "components/Button";

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
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingAssessments, setPendingAssessments] = useState(0);
  const [completedAssessments, setcompletedAssessments] = useState(0);

  useEffect(() => {
    const userDetails = getUserDetails();
    setUserType(userDetails.userType);

    if (!isLoggedIn()) {
      navigate("/login");
    }

    setTotalAssignments(10);
    setTotalUsers(25);
    setPendingAssessments(5);
    setcompletedAssessments(12);
  }, [navigate]);

  return (
    <>
      <TopBar />
      <Container maxWidth="lg" pt-2>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <SummaryCard
              title="Total Assignments"
              count={totalAssignments}
              href="/recruiter/assignments"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SummaryCard
              title="Total Candidate"
              count={totalUsers}
              href="/recruiter/user-management"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SummaryCard
              title="Pending Assessments"
              count={completedAssessments}
              href="/recruiter/assignments?assignmentStatus=pending"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SummaryCard
              title="Interview Ready"
              count={pendingAssessments}
              href="/recruiter/assignments?assignmentStatus=completed"
            />
          </Grid>
        </Grid>

        <Box mt={4}>
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
                    <TableCell>{assignment.status}</TableCell>
                    <TableCell>{assignment.dueDate}</TableCell>
                    <TableCell>{assignment.interviewStage}</TableCell>
                    <TableCell>
                      <Button outline>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
