import { useState, useEffect } from "react";
import { getArticles, getArticleBySlug } from "../services/articleApi";

// Warna per kategori
const categoryColor = {
  Penyakit: "#14213D",
  Nutrisi: "#FCA311",
  "Gaya Hidup": "#3d4b68",
  Pencernaan: "#2a7d4f",
};

function Homepage() {
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [activeArticle, setActiveArticle] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    getArticles({ page: 1, limit: 3 })
      .then((res) => setTrendingArticles(res.data))
      .catch(() => setTrendingArticles([]))
      .finally(() => setIsLoadingArticles(false));
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

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#000000] flex flex-col items-center py-16 px-6 box-border overflow-hidden">
      {/* ─── ANIMASI KUSTOM CSS ─── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floating {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulseGold {
          0%, 100% { transform: scale(1) translateY(0); box-shadow: 0 0 20px 2px rgba(252, 163, 17, 0.15); }
          50% { transform: scale(1.02) translateY(-2px); box-shadow: 0 0 35px 6px rgba(252, 163, 17, 0.35); }
        }
        @keyframes blobRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-floating { animation: floating 3.5s ease-in-out infinite; }
        .animate-pulse-gold { animation: pulseGold 3s infinite ease-in-out; }
        .animate-blob { animation: blobRotate 25s linear infinite; }
        .animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .custom-scroll::-webkit-scrollbar { width: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 8px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #FCA311; border-radius: 8px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #14213D; }
      `}</style>

      {/* Latar Belakang Abstrak (Blobs) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#FCA311] opacity-10 blur-[80px] rounded-full animate-blob"></div>
        <div
          className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-[#14213D] opacity-10 blur-[100px] rounded-full animate-blob"
          style={{ animationDirection: "reverse" }}
        ></div>
      </div>

      <div className="max-w-[1100px] w-full relative z-10">
        {/* ─── SECTION 1: HERO & CALL TO ACTION ─── */}
        <section className="flex flex-col items-center text-center mt-10 mb-28 w-full max-w-3xl mx-auto animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffeec2] to-[#f2f3f5] border border-[#fde394] px-5 py-2 rounded-full mb-8 shadow-sm">
            <span className="text-base">✨</span>
            <span className="font-['DM_Sans'] text-[13px] font-bold text-[#FCA311] tracking-wide">
              AI-Powered Health Assistant
            </span>
          </div>

          <h1 className="font-['Nunito'] text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#000000] via-[#14213D] to-[#3d4b68] mb-6 tracking-tight leading-[1.15]">
            Kenali Gejala Anda <br className="hidden md:block" /> dengan Mudah
          </h1>

          <p className="font-['DM_Sans'] text-lg text-[#6E6861] leading-relaxed mb-10 font-medium max-w-xl mx-auto">
            Dapatkan prediksi awal cerdas untuk kondisi kesehatan Anda dalam
            hitungan detik. Pribadi, cepat, dan terpercaya.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <a
              href="/konsultasi"
              className="w-full sm:w-auto bg-[#FCA311] text-[#000000] py-4 px-10 font-['Nunito'] text-[14px] font-extrabold tracking-[1.5px] uppercase rounded-full transition-all duration-300 hover:text-[#000000] hover:bg-[#FFD700] active:scale-95 animate-pulse-gold border border-[#FCA311] hover:border-[#FFD700] flex items-center justify-center gap-2"
            >
              Mulai Chat <span className="text-lg leading-none">→</span>
            </a>
            <a
              href="/artikel"
              className="w-full sm:w-auto bg-white/80 backdrop-blur-md text-[#14213D] border-[1.5px] border-[#E5E5E5] py-4 px-8 font-['Nunito'] text-[14px] font-bold tracking-wide rounded-full transition-all duration-300 hover:border-[#14213D] hover:bg-white hover:shadow-lg active:scale-95 text-center"
            >
              Baca Artikel Kesehatan
            </a>
          </div>

          {/* Floating Bot Visual */}
          <div className="mt-20 relative w-full max-w-[650px] mx-auto h-[160px] bg-gradient-to-br from-[#ffffff] to-[#f2f3f5] rounded-[32px] border border-[#E5E5E5] shadow-xl flex flex-col items-center justify-center animate-fade-up delay-200">
            <div className="relative z-10 mb-3 animate-floating drop-shadow-md">
              <img
                src="/diagnoku-logo.png"
                alt="Logo DiagnoKu"
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
            </div>
            <p className="font-['DM_Sans'] text-[15px] font-bold text-[#14213D] relative z-10">
              Asisten Anda siap membantu
            </p>
          </div>
        </section>

        {/* ─── SECTION 2: FITUR UNGGULAN (3 KARTU) ─── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-28 w-full animate-fade-up delay-300">
          <div className="bg-white p-8 rounded-none border border-[#E5E5E5] shadow-sm transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl hover:border-[#FCA311] group text-left">
            <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 origin-bottom-left">
              💬
            </div>
            <h3 className="font-['Nunito'] text-[17px] font-extrabold text-[#14213D] mb-3">
              Respons Cepat
            </h3>
            <p className="font-['DM_Sans'] text-[13.5px] text-[#6E6861] leading-[1.7] font-medium m-0">
              Prediksi awal gejala dalam hitungan menit lewat percakapan natural
              tanpa perlu antre panjang.
            </p>
          </div>
          <div className="bg-white p-8 rounded-none border border-[#E5E5E5] shadow-sm transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl hover:border-[#FCA311] group text-left">
            <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 origin-bottom-left">
              🔒
            </div>
            <h3 className="font-['Nunito'] text-[17px] font-extrabold text-[#14213D] mb-3">
              Aman & Privat
            </h3>
            <p className="font-['DM_Sans'] text-[13.5px] text-[#6E6861] leading-[1.7] font-medium m-0">
              Data kesehatan Anda tidak disebarluaskan, dienkripsi, dan diproses
              dengan standar privasi ketat.
            </p>
          </div>
          <div className="bg-white p-8 rounded-none border border-[#E5E5E5] shadow-sm transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl hover:border-[#FCA311] group text-left">
            <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 origin-bottom-left">
              🤝
            </div>
            <h3 className="font-['Nunito'] text-[17px] font-extrabold text-[#14213D] mb-3">
              Panduan Lanjutan
            </h3>
            <p className="font-['DM_Sans'] text-[13.5px] text-[#6E6861] leading-[1.7] font-medium m-0">
              Rekomendasi tindak lanjut yang jelas dan peringatan dini kapan
              Anda harus segera menemui dokter.
            </p>
          </div>
        </section>

        {/* ─── SECTION 3: ARTIKEL TRENDING ─── */}
        <section className="w-full animate-fade-up delay-300 border-t border-[#E5E5E5] pt-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div className="text-left">
              <h2 className="font-['Nunito'] text-[26px] font-extrabold text-[#000000] mb-2 tracking-tight">
                🔥 Artikel yang Sedang Ramai
              </h2>
              <p className="font-['DM_Sans'] text-[14.5px] text-[#6E6861] font-medium m-0">
                Informasi kesehatan terpopuler dari berbagai sumber terpercaya.
              </p>
            </div>
            <a
              href="/artikel"
              className="group font-['DM_Sans'] text-[14px] font-bold text-[#FCA311] hover:text-[#14213D] flex items-center gap-1.5 transition-colors duration-200"
            >
              Lihat Semua
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          {/* SKELETON LOADING */}
          {isLoadingArticles ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-[#E5E5E5] rounded-none flex flex-col overflow-hidden h-[360px] shadow-sm animate-pulse"
                >
                  <div className="h-[130px] bg-gray-200 border-b border-gray-100"></div>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingArticles.map((art) => {
                const color = categoryColor[art.category] || "#14213D";
                return (
                  <div
                    key={art.id}
                    onClick={() => openArticle(art.slug)}
                    className="flex flex-col bg-white rounded-none border border-[#E5E5E5] overflow-hidden shadow-sm transition-all duration-300 hover:translate-y-[-6px] hover:shadow-xl hover:border-[#FCA311] group text-left min-h-[420px] cursor-pointer"
                  >
                    {/* Header Kartu */}
                    <div
                      className="h-[130px] p-5 flex items-end justify-between relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${color}22, ${color}05)`,
                      }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-25 rounded-full translate-x-8 -translate-y-8 blur-xl"></div>
                      <span
                        className="text-white px-3 py-1.5 rounded-lg text-[11px] font-extrabold font-['DM_Sans'] tracking-wide z-10 shadow-sm"
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
                    <div className="p-6 flex-1 flex flex-col text-left">
                      <h3 className="font-['Nunito'] text-[17px] font-extrabold text-[#14213D] mb-3 leading-[1.35] group-hover:text-[#FCA311] transition-colors duration-200">
                        {art.title}
                      </h3>
                      <p className="font-['DM_Sans'] text-[13.5px] text-[#6E6861] leading-[1.6] mb-5 line-clamp-3">
                        {art.description}
                      </p>
                      <div className="mt-auto flex justify-between items-center pt-4 border-t border-[#f2f3f5]">
                        <span className="font-['DM_Sans'] text-[11.5px] font-bold text-[#808080]">
                          {art.category}
                        </span>
                        <span className="font-['Nunito'] text-[12.5px] font-extrabold text-[#FCA311] group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
                          Baca Selengkapnya{" "}
                          <span className="text-lg leading-none">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ─── MODAL DETAIL ARTIKEL ─── */}
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

export default Homepage;
