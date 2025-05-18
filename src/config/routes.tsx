import { createBrowserRouter } from "react-router-dom";

import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import LoginNavigator from "pages/LoginNavigator";
import Login from "pages/Login";
import Dashboard from "pages/Dashboard";
// import Dashboard from "pages/Dashboard";

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
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
