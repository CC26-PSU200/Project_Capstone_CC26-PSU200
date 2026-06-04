import Footer from "./components/footer";
import Navbar from "./components/navbar";

import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Homepage from "./pages/homepage";
import TentangPage from "./pages/tentangpage";
import FaqPage from "./pages/faqpage";
import KonsultasiPage from "./pages/konsultasipage";
import KontakPage from "./pages/kontakpage";
import ArtikelPage from "./pages/artikelpage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    // 1. Ubah fragment <> menjadi div dengan flex-col dan min-h-screen
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />

      {/* 2. Bungkus Routes dengan main dan berikan flex-grow */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/tentang" element={<TentangPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/konsultasi" element={<KonsultasiPage />} />
          <Route path="/kontak" element={<KontakPage />} />
          <Route path="/artikel" element={<ArtikelPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
