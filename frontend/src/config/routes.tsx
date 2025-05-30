import { createBrowserRouter } from "react-router-dom";

import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import LoginNavigator from "pages/LoginNavigator";
import Login from "pages/Login";
import Dashboard from "pages/Dashboard";
import Assignments from "pages/Assignments";
import TestCreation from "pages/TestCreation";
import TestLibrary from "pages/TestLibrary";
import CandidateTest from "pages/CandidateTest";
import RequireAuth from "components/RequireAuth";

const routes = createBrowserRouter([
  {
    path: "/login-navigator",
    element: <LoginNavigator />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: "/:userType/assigned-test",
    element: (
      <RequireAuth>
        <Assignments />
      </RequireAuth>
    ),
  },
  {
    path: "/recruiter/test-library",
    element: (
      <RequireAuth>
        <TestLibrary />
      </RequireAuth>
    ),
  },
  {
    path: "/recruiter/test-library/:testId",
    element: (
      <RequireAuth>
        <TestCreation />
      </RequireAuth>
    ),
  },
  {
    path: "/recruiter/candidates",
    element: (
      <RequireAuth>
        <TestCreation />
      </RequireAuth>
    ),
  },
  {
    path: "/candidate/test/:assignmentId",
    element: (
      <RequireAuth>
        <CandidateTest />
      </RequireAuth>
    ),
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
