import { assignmentColumns } from "common/constants";
import TableComponent from "components/TableComponent";
import { useState, useEffect } from "react";
import { getRecruiterAssignments } from "services/assignmentService";
import { Assignment } from "../common/models/Assignment";
import TopBar from "../components/TopBar";
import "./styles/Assignments.scss";

const Assignments = () => {
  const [assignmentsData, setAssignmentsData] = useState<Assignment[]>([]);

  useEffect(() => {
    setInitalData();
  }, []);

  const setInitalData = async () => {
    const assignments2: any = await getRecruiterAssignments();
    setAssignmentsData(assignments2);
    console.log(assignments2);
  };

  return (
    <>
      <TopBar />
      <div className="assignment-container">
        <TableComponent data={assignmentsData} columns={assignmentColumns} title="Recent Assignments Overview" subtitle="Monitor candidate progress and upcoming deadlines" />
      </div>
    </>
  );
};

export default Assignments;
