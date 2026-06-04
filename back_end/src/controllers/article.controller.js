import {
  getAllArticles,
  getArticleBySlug,
  getCategories,
} from "../services/article.service.js";

export async function listArticles(req, res, next) {
  try {
    const { category, search, page, limit } = req.query;
    const result = getAllArticles({
      category,
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 12,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function detailArticle(req, res, next) {
  try {
    const article = getArticleBySlug(req.params.slug);
    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Artikel tidak ditemukan." });
    }
    res.json({ success: true, data: article });
  } catch (err) {
    next(err);
  }
}

export async function listCategories(req, res, next) {
  try {
    const categories = getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}
