import { useState, useEffect } from "react";
import {
  getArticles,
  getCategories,
  getArticleBySlug,
} from "../services/articleApi";

function ArtikelPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(["Semua"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCat, setSelectedCat] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [activeArticle, setActiveArticle] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 12;

  // Debounce search input 400ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let ignore = false;

    async function fetchArticles() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getArticles({
          category: selectedCat,
          search: debouncedSearch,
          page,
          limit: LIMIT,
        });

        if (ignore) return;

        setArticles(result.data);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      } catch (err) {
        if (ignore) return;

        setError(
          err.message || "Gagal memuat artikel kesehatan. Silakan coba lagi.",
        );
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchArticles();

    return () => {
      ignore = true;
    };
  }, [selectedCat, debouncedSearch, page]);

  // Fetch kategori sekali saat mount
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  // Buka modal detail artikel
  async function openArticle(slug) {
    setModalLoading(true);
    setActiveArticle({ slug });
    try {
      const res = await getArticleBySlug(slug);
      setActiveArticle(res.data);
    } catch {
      setActiveArticle(null);
    } finally {
      setModalLoading(false);
    }
  }

  // Warna per kategori
  const categoryColor = {
    Penyakit: "#14213D",
    Nutrisi: "#FCA311",
    "Gaya Hidup": "#3d4b68",
    Pencernaan: "#2a7d4f",
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#f8f8f8] text-[#000000] py-16 px-6 box-border flex flex-col items-center">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scroll::-webkit-scrollbar { width: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 8px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #FCA311; border-radius: 8px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #14213D; }
      `}</style>

      <div className="max-w-[1000px] w-full animate-fade-up">
        {/* HEADER */}
        <div className="text-center mb-12">
          <span className="font-['Nunito'] text-[11px] font-extrabold text-[#FCA311] tracking-[2.5px] block mb-3 uppercase">
            HEALTH EDUCATION CENTER
          </span>
          <h1 className="font-['Nunito'] text-4xl md:text-5xl font-black text-[#14213D] mb-4 tracking-tight leading-none">
            Edukasi Kesehatan DiagnoKu
          </h1>
          <p className="font-['DM_Sans'] text-[15.5px] text-[#808080] max-w-xl mx-auto leading-relaxed font-medium">
            Dapatkan informasi, tips hidup sehat, dan ulasan medis tepercaya
            yang dirangkum langsung bersumber dari portal kesehatan
            {!isLoading && !error && (
              <span className="ml-1 text-[#FCA311] font-bold">
                {total} artikel tersedia.
              </span>
            )}
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col gap-6 items-center mb-12 w-full">
          <div className="relative w-full max-w-[500px]">
            <input
              type="text"
              placeholder="Cari artikel kesehatan..."
              value={searchQuery}
              onChange={(e) => {
                setPage(1);
                setSearchQuery(e.target.value);
              }}
              disabled={!!error}
              className="w-full pl-6 pr-6 py-4 rounded-full border-[1.5px] border-[#E5E5E5] bg-white text-sm font-['DM_Sans'] text-[#000000] font-medium placeholder-[#cccccc] outline-none transition-all duration-300 focus:border-[#FCA311] focus:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setPage(1);
                  setSelectedCat(cat);
                }}
                disabled={!!error}
                className={`px-5 py-2.5 rounded-full text-[12.5px] font-['DM_Sans'] font-bold tracking-wide border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedCat === cat
                    ? "bg-[#FCA311] border-[#FCA311] text-[#000000] shadow-md transform scale-[1.03]"
                    : "bg-white border-[#E5E5E5] text-[#333333] hover:border-[#14213D] hover:bg-[#ffeec2]/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* SKELETON LOADING */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#E5E5E5] rounded-none flex flex-col overflow-hidden h-[360px] shadow-sm animate-pulse"
              >
                <div className="h-[120px] bg-gray-200 border-b border-gray-100"></div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded-md w-1/2 mb-6"></div>
                    <div className="h-3 bg-gray-100 rounded-sm w-full mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded-sm w-full mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded-sm w-2/3"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                    <div className="h-3 bg-gray-200 rounded-sm w-16"></div>
                    <div className="h-3 bg-gray-200 rounded-sm w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // ERROR STATE
          <div className="text-center py-16 bg-red-50 border border-red-200 rounded-2xl w-full">
            <span className="text-5xl block mb-4">⚠️</span>
            <h3 className="font-['Nunito'] text-lg font-extrabold text-red-700 mb-2">
              Oops! Terjadi Kesalahan
            </h3>
            <p className="font-['DM_Sans'] text-sm text-red-600 mb-6">
              {error}
            </p>
            <button
              onClick={() => {
                setPage(1);
                setSelectedCat("Semua");
                setSearchQuery("");
                setDebouncedSearch("");
              }}
              className="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-red-700 transition-colors"
            >
              Coba Muat Ulang
            </button>
          </div>
        ) : articles.length === 0 ? (
          // EMPTY STATE
          <div className="text-center py-20 bg-white border border-[#E5E5E5] rounded-2xl w-full">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="font-['Nunito'] text-lg font-extrabold text-[#14213D] mb-1">
              Artikel Tidak Ditemukan
            </h3>
            <p className="font-['DM_Sans'] text-sm text-gray-400">
              Coba ubah kata kunci pencarian atau ganti kategori filter Anda.
            </p>
          </div>
        ) : (
          // DAFTAR ARTIKEL
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {articles.map((art) => {
                const color = categoryColor[art.category] || "#14213D";
                return (
                  <div
                    key={art.id}
                    onClick={() => openArticle(art.slug)}
                    className="flex flex-col bg-white rounded-none border border-[#E5E5E5] overflow-hidden shadow-sm transition-all duration-300 hover:translate-y-[-6px] hover:shadow-xl hover:border-[#FCA311] group text-left min-h-[380px] cursor-pointer"
                  >
                    {/* Header Kartu */}
                    <div
                      className="h-[120px] p-5 flex items-end justify-between relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${color}22, ${color}05)`,
                      }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-25 rounded-full translate-x-8 -translate-y-8 blur-xl"></div>
                      <span
                        className="text-white px-3 py-1.5 rounded-lg text-[10.5px] font-extrabold font-['DM_Sans'] tracking-wider z-10 shadow-sm uppercase"
                        style={{ backgroundColor: color }}
                      >
                        {art.category}
                      </span>
                      {art.source && (
                        <span className="bg-white/90 text-[#14213D] px-2.5 py-1 rounded-lg text-[10px] font-bold font-['DM_Sans'] z-10 border border-white/50 truncate max-w-[120px]">
                          {(() => {
                            try {
                              return new URL(art.source).hostname.replace(
                                "www.",
                                "",
                              );
                            } catch {
                              return art.source;
                            }
                          })()}
                        </span>
                      )}
                    </div>

                    {/* Body Kartu */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-['Nunito'] text-[17px] font-extrabold text-[#14213D] mb-3 leading-[1.35] group-hover:text-[#FCA311] transition-colors duration-200 line-clamp-2">
                          {art.title}
                        </h3>
                        <p className="font-['DM_Sans'] text-[13.5px] text-[#6E6861] leading-[1.6] mb-5 line-clamp-3">
                          {art.description}
                        </p>
                      </div>
                      <div className="mt-auto flex justify-between items-center pt-4 border-t border-[#f2f3f5] shrink-0">
                        <span className="font-['DM_Sans'] text-[11.5px] font-bold text-[#808080]">
                          {art.category}
                        </span>
                        <span className="font-['Nunito'] text-[12.5px] font-extrabold text-[#FCA311] group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
                          Baca Selengkapnya{" "}
                          <span className="text-sm leading-none">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2.5 rounded-full text-[12.5px] font-['DM_Sans'] font-bold border border-[#E5E5E5] bg-white text-[#333] hover:border-[#14213D] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Sebelumnya
                </button>
                <span className="font-['DM_Sans'] text-[13px] font-bold text-[#808080]">
                  Halaman {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 rounded-full text-[12.5px] font-['DM_Sans'] font-bold border border-[#E5E5E5] bg-white text-[#333] hover:border-[#14213D] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Selanjutnya →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL DETAIL */}
      {activeArticle && (
        <div
          className="fixed inset-0 bg-[#000000]/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveArticle(null);
          }}
        >
          <div className="bg-white rounded-3xl max-w-[620px] w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-[#E5E5E5] animate-scale-up custom-scroll">
            {/* Header Modal */}
            <div className="bg-[#14213D] p-10 relative border-b-4 border-[#FCA311]">
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold flex items-center justify-center text-sm transition-colors duration-200 cursor-pointer"
              >
                ✕
              </button>
              {!modalLoading && activeArticle.category && (
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-white px-3 py-1 rounded-full text-[10px] font-extrabold font-['DM_Sans'] tracking-wider uppercase"
                    style={{
                      backgroundColor:
                        categoryColor[activeArticle.category] || "#14213D",
                    }}
                  >
                    {activeArticle.category}
                  </span>
                </div>
              )}
              <h2 className="font-['Nunito'] text-2xl md:text-3xl font-black text-white leading-[1.25] mb-2">
                {modalLoading ? "Memuat artikel..." : activeArticle.title}
              </h2>
            </div>

            {/* Body Modal */}
            <div className="p-8 md:p-10 text-left">
              {modalLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ) : (
                <>
                  <p className="font-['DM_Sans'] text-[15px] text-[#333333] leading-[1.75] mb-8 whitespace-pre-line font-normal">
                    {activeArticle.description}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-[#f2f3f5] gap-4">
                    {activeArticle.source && (
                      <a
                        href={activeArticle.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-['DM_Sans'] font-extrabold text-[#14213D] hover:text-[#FCA311] flex items-center gap-1.5 transition-colors duration-200 no-underline"
                      >
                        🌐 Buka Sumber Asli ↗
                      </a>
                    )}
                    <button
                      onClick={() => setActiveArticle(null)}
                      className="w-full sm:w-auto bg-[#FCA311] hover:bg-[#e08e0b] text-[#000000] py-3 px-8 font-['Nunito'] text-xs font-black uppercase tracking-wider rounded-full transition-colors duration-200 cursor-pointer text-center ml-auto"
                    >
                      Tutup
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtikelPage;
