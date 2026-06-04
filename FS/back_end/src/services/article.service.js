import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ARTICLES_PATH = join(__dirname, "..", "data", "articles.json");

const articles = JSON.parse(readFileSync(ARTICLES_PATH, "utf-8"));

export function getAllArticles({
  category,
  search,
  page = 1,
  limit = 12,
} = {}) {
  let result = [...articles];

  if (category && category !== "Semua") {
    result = result.filter(
      (a) => a.category?.toLowerCase() === category.toLowerCase(),
    );
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q),
    );
  }

  const total = result.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const data = result.slice(offset, offset + limit);

  return { data, total, page, totalPages, limit };
}

export function getArticleBySlug(slug) {
  return articles.find((a) => a.slug === slug) || null;
}

export function getCategories() {
  const cats = [...new Set(articles.map((a) => a.category).filter(Boolean))];
  return ["Semua", ...cats.sort()];
}
