import { Router } from "express";
import { listDiseases, listSymptoms, predictSymptoms } from "../controllers/ai.controller.js";

const router = Router();

router.get("/symptoms", listSymptoms);
router.get("/diseases", listDiseases);
router.post("/predict", predictSymptoms);

export default router;
