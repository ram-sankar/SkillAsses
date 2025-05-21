import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import routes from "./config/routes";

function App() {
  return (
    <main className="App">
      <RouterProvider router={routes} />
      <ToastContainer />
    </main>
  );
}

export default App;
