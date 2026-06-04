function KontakPage() {
  // Fungsi sederhana untuk mencegah halaman me-reload saat form dikirim
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Terima kasih! Pesan Anda telah terkirim. (Ini hanya simulasi UI)");
  };

  return (
    <main className="container mx-auto px-6 py-16 md:py-24 min-h-screen">
      {/* Header Kontak */}
      <div className="w-full max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
          Hubungi <span className="text-[#FCA311]">Kami</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Ada pertanyaan, masukan, atau kendala teknis? Tim DiagnoKu siap
          membantu Anda.
        </p>
      </div>

      {/* Grid Layout: Kiri (Info) & Kanan (Form) */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* --- Bagian Kiri: Informasi Kontak --- */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Informasi Kontak
          </h2>

          {/* Card Email */}
          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-2xl shrink-0">
              ✉️
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Email</h3>
              <p className="text-gray-500 text-sm mt-1">support@diagnoku.id</p>
            </div>
          </div>

          {/* Card Telepon/WA */}
          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-2xl shrink-0">
              📞
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Telepon / WhatsApp</h3>
              <p className="text-gray-500 text-sm mt-1">+62 812 3456 7890</p>
            </div>
          </div>

          {/* Card Alamat */}
          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-2xl shrink-0">
              📍
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Lokasi Kantor</h3>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                Gedung Kesehatan AI Lt. 4<br />
                Jl. Teknologi Medis No. 88, Jakarta Selatan
              </p>
            </div>
          </div>
        </div>

        {/* --- Bagian Kanan: Form Kirim Pesan --- */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Input Nama */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                placeholder="Masukkan nama Anda"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FCA311] focus:ring-2 focus:ring-orange-100 transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Input Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">
                Alamat Email
              </label>
              <input
                type="email"
                required
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FCA311] focus:ring-2 focus:ring-orange-100 transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Input Pesan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">Pesan</label>
              <textarea
                required
                rows="4"
                placeholder="Tuliskan pertanyaan atau pesan Anda di sini..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FCA311] focus:ring-2 focus:ring-orange-100 transition-all bg-gray-50 focus:bg-white resize-none"
              ></textarea>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              className="w-full mt-2 bg-[#788D7C] text-white font-bold py-3.5 px-8 rounded-xl hover:-translate-y-1 transition-all duration-300"
            >
              Kirim Pesan Sekarang
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default KontakPage;
