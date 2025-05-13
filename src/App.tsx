import { RouterProvider } from "react-router-dom";
import routes from "./config/routes";

function App() {
  return (
    <main className="App">
        <RouterProvider router={routes} />
      </main>
  );
}

export default App;
