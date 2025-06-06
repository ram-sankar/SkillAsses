import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import assignmentRoutes from "./routes/assignmentRoutes";
import testRoutes from "./routes/testRoutes";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/tests", testRoutes);

export default app;
