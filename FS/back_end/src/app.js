import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";
import articleRoutes from "./routes/article.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Back End is running",
    endpoints: {
      health: "/health",
      aiPredict: "/api/ai/predict",
      aiSymptoms: "/api/ai/symptoms",
      aiDiseases: "/api/ai/diseases",
      artikel: "/api/artikel",
      artikelCategories: "/api/artikel/categories",
      artikelDetail: "/api/artikel/:slug",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/ai", aiRoutes);
app.use("/api/artikel", articleRoutes);
app.use(errorMiddleware);

export default app;
