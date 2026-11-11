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

app.use((error, _req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: { message: "Invalid JSON body" } });
  }

  next(error);
});

export default app;
