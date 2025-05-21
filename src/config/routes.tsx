import { createBrowserRouter } from "react-router-dom";

import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import LoginNavigator from "pages/LoginNavigator";
import Login from "pages/Login";
import Dashboard from "pages/Dashboard";
import Assignments from "pages/Assignments";
import TestCreation from "pages/TestCreation";
import TestLibrary from "pages/TestLibrary";

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
    element: <Dashboard />,
  },
  {
    path: "/:userType/assigned-test",
    element: <Assignments />,
  },
  {
    path: "/recruiter/test-library",
    element: <TestLibrary />,
  },
  {
    path: "/recruiter/test-library/:testId",
    element: <TestCreation />,
  },
  {
    path: "/recruiter/candidates",
    element: <TestCreation />,
  },
  {
    path: "/candidate/test/:testId",
    element: <TestCreation />,
  },
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
