import { Router } from "express";
import {
  listArticles,
  detailArticle,
  listCategories,
} from "../controllers/article.controller.js";

const router = Router();

// GET /api/artikel            → semua artikel (support ?category=&search=&page=&limit=)
router.get("/", listArticles);

// GET /api/artikel/categories → daftar kategori unik
router.get("/categories", listCategories);

// GET /api/artikel/:slug      → detail satu artikel
router.get("/:slug", detailArticle);

export default router;
