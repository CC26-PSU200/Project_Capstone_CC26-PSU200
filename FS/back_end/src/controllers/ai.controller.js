import { getDiseases, getSymptoms, predictDisease } from "../services/ai.service.js";

export async function predictSymptoms(req, res, next) {
  try {
    const result = await predictDisease(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function listSymptoms(req, res, next) {
  try {
    const result = await getSymptoms();
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function listDiseases(req, res, next) {
  try {
    const result = await getDiseases();
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
