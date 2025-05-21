import { assignmentColumns } from "common/constants";
import { UserType } from "common/models/User";
import TableComponent from "components/TableComponent";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAssignments } from "services/assignmentService";
import { getUserDetails } from "services/authService";
import { Assignment } from "../common/models/Assignment";
import TopBar from "../components/TopBar";
import "./styles/Assignments.scss";

const Assignments = () => {
  const [assignmentsData, setAssignmentsData] = useState<Assignment[]>([]);
  const [userType, setUserType] = useState<UserType | null>(null);

  useEffect(() => {
    getAssignmentsData();
  }, []);

  const getAssignmentsData = async () => {
    const userDetails = getUserDetails();
    setUserType(userDetails.userType);

    let assignmentList;
    const assignments = await getAssignments(userDetails.userType);

    if (userDetails.userType === UserType.RECRUITER) {
      assignmentList = assignments.map((assignment) => {
        const { recruiterMailId, ...rest } = assignment;
        return rest;
      });
    } else if (userDetails.userType === UserType.CANDIDATE) {
      assignmentList = assignments.map((assignment) => {
        const { candidateMailId, ...rest } = assignment;
        return rest;
      });
      console.log(assignments);
    } else {
      console.error("Invalid user type:", userType);
      return [];
    }
    setAssignmentsData(assignmentList);
  };

  return (
    <>
      <TopBar />
      <div className="assignment-container">
        <TableComponent
          data={assignmentsData}
          columns={assignmentColumns(userType as UserType)}
          baseUrl="/candidate/test"
          title="Recent Assignments Overview"
          subtitle="Monitor candidate progress and upcoming deadlines"
        />
      </div>
    </>
  );
};

export default Assignments;
