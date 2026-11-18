
import express from "express";
import cors from "cors";
import eventRoutes from "./routes/event-routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Sunucu sağlık kontrolü
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    time: new Date().toISOString(),
    student: "2321032005",
  });
});

// Etkinlik API adresleri
app.use("/events", eventRoutes);

// Bulunamayan adresler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
    },
  });
});

// Beklenmeyen sunucu hataları
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: {
      message: "Server error",
    },
  });
});

export default app;
