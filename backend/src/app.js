import cors from "cors";
import express from "express";
import eventRoutes from "./routes/event-routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    student: "2321032005",
  });
});

app.use("/events", eventRoutes);

export default app;
