import { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import "./styles/Assignments.scss";
import { fetchTests } from "../services/questionService";
import TableComponent from "components/TableComponent";
import { testColumns } from "common/constants";
import { TestData } from "common/models/Question";

const TestLibrary = () => {
  const [testsData, setTestsData] = useState<TestData[]>([]);

  useEffect(() => {
    const fetchAndDisplayTests = async () => {
      const tests = await fetchTests();
      console.log(tests);
      setTestsData(tests);
    };
    fetchAndDisplayTests();
  }, []);

  return (
    <>
      <TopBar />
      <div className="assignment-container">
        <TableComponent
          data={testsData}
          columns={testColumns}
          title="Test Library"
          subtitle="Browse the list of tests you’ve created."
        />
      </div>
    </>
  );
};

export default TestLibrary;
