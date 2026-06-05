const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function fetchJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || "Gagal memuat data artikel.";
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  return data;
}

export async function getArticles({
  category,
  search,
  page = 1,
  limit = 12,
} = {}) {
  const params = new URLSearchParams();
  if (category && category !== "Semua") params.set("category", category);
  if (search) params.set("search", search);
  params.set("page", page);
  params.set("limit", limit);
  return fetchJson(`/api/artikel?${params.toString()}`);
}

export async function getArticleBySlug(slug) {
  return fetchJson(`/api/artikel/${slug}`);
}

export async function getCategories() {
  return fetchJson("/api/artikel/categories");
}
