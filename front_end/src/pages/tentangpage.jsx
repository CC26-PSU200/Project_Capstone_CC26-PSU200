function TentangPages() {
  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#f8f8f8] text-[#000000] flex flex-col items-center py-16 px-6 box-border overflow-hidden">
      {/* Definisi Animasi CSS Kustom yang Disinkronkan dengan Tailwind */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-32px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(32px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        /* Animasi Glow Emas Lembut untuk Tombol */
        @keyframes pulseGold {
          0%, 100% {
            transform: scale(1) translateY(0);
            box-shadow: 0 0 25px 2px rgba(212, 175, 55, 0.2);
          }
          50% {
            transform: scale(1.02) translateY(-2px);
            box-shadow: 0 0 40px 8px rgba(212, 175, 55, 0.4);
          }
        }
        .animate-fade-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-left {
          animation: fadeInLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-right {
          animation: fadeInRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pulse-gold {
          animation: pulseGold 3s infinite ease-in-out;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      <div className="max-w-[1000px] w-full">
        {/* ─── SECTION 1: HERO (ABOUT) ─── */}
        <section className="flex flex-col md:flex-row gap-12 md:gap-20 items-center mb-24 w-full">
          {/* Visual Kiri dengan Animasi Masuk */}
          <div className="flex-1 flex justify-center w-full animate-fade-left">
            <img
              src="/diagnoku-logo.png"
              alt="DiagnoKu Logo"
              className="rounded-2xl shadow-lg max-w-[350px] w-full h-auto transform transition-all duration-500 hover:scale-[1.03] hover:shadow-xl"
            />
          </div>

          {/* Teks Kanan */}
          <div className="flex-1 text-left animate-fade-right">
            <h1 className="font-['Nunito'] text-5xl md:text-6xl font-black text-[#000000] mb-4 tracking-tight leading-none">
              About Us
            </h1>
            <h2 className="font-['Nunito'] text-xl font-bold text-[#14213D] mb-5 tracking-tight">
              Mengenal Platform DiagnoKu
            </h2>
            <p className="font-['DM_Sans'] text-[14.5px] text-[#333333] leading-[1.8] mb-5 font-normal">
              DiagnoKu hadir sebagai terobosan asisten kesehatan berbasis
              kecerdasan buatan (AI) yang dirancang untuk menjembatani Anda
              dengan pemahaman kondisi tubuh yang lebih tenang dan ilmiah.
            </p>
            <p className="font-['DM_Sans'] text-[14.5px] text-[#333333] leading-[1.8] mb-5 font-normal">
              Kami memahami rasa khawatir yang sering muncul saat mendiagnosis
              diri secara asal di internet. Oleh sebab itu, kami menyederhanakan
              data gejala yang kompleks menjadi percakapan ramah dan saran
              terarah yang mudah dipahami oleh siapa saja.
            </p>
          </div>
        </section>

        {/* ─── SECTION 2: GRID FITUR ("Our Services" Style) ─── */}
        <section className="mt-24 pt-20 border-t border-[#E5E5E5] w-full animate-fade-up">
          <div className="text-center mb-14">
            <h2 className="font-['Nunito'] text-3xl md:text-4xl font-extrabold text-[#14213D] tracking-tight">
              Mengapa Memilih DiagnoKu?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Box Fitur 1 */}
            <div className="bg-white border border-[#E5E5E5] p-10 rounded-2xl text-left transition-all duration-500 transform hover:translate-y-[-6px] hover:shadow-2xl hover:border-[#FCA311] group">
              <span className="text-4xl inline-block mb-6 transition-transform duration-300 group-hover:scale-110">
                💬
              </span>
              <h3 className="font-['Nunito'] text-lg font-extrabold text-[#14213D] mb-2.5 tracking-tight">
                Percakapan Natural
              </h3>
              <p className="font-['DM_Sans'] text-sm text-[#808080] leading-[1.7] font-normal">
                Sistem memahami kalimat sehari-hari Anda secara fleksibel tanpa
                perlu menghafal istilah medis yang kaku.
              </p>
            </div>

            {/* Box Fitur 2 */}
            <div className="bg-white border border-[#E5E5E5] p-10 rounded-2xl text-left transition-all duration-500 transform hover:translate-y-[-6px] hover:shadow-2xl hover:border-[#FCA311] group">
              <span className="text-4xl inline-block mb-6 transition-transform duration-300 group-hover:scale-110">
                🧠
              </span>
              <h3 className="font-['Nunito'] text-lg font-extrabold text-[#14213D] mb-2.5 tracking-tight">
                Prediksi AI Terarah
              </h3>
              <p className="font-['DM_Sans'] text-sm text-[#808080] leading-[1.7] font-normal">
                Diproses dengan kombinasi model cerdas Deep Learning untuk
                memberikan 3 estimasi penyakit teratas secara instan.
              </p>
            </div>

            {/* Box Fitur 3 */}
            <div className="bg-white border border-[#E5E5E5] p-10 rounded-2xl text-left transition-all duration-500 transform hover:translate-y-[-6px] hover:shadow-2xl hover:border-[#FCA311] group">
              <span className="text-4xl inline-block mb-6 transition-transform duration-300 group-hover:scale-110">
                🔒
              </span>
              <h3 className="font-['Nunito'] text-lg font-extrabold text-[#14213D] mb-2.5 tracking-tight">
                Kerahasiaan Terjamin
              </h3>
              <p className="font-['DM_Sans'] text-sm text-[#808080] leading-[1.7] font-normal">
                Semua data gejala dan keluhan pribadi Anda diproses secara
                tertutup dan aman demi menjaga privasi penuh Anda.
              </p>
            </div>

            {/* Box Fitur 4 */}
            <div className="bg-white border border-[#E5E5E5] p-10 rounded-2xl text-left transition-all duration-500 transform hover:translate-y-[-6px] hover:shadow-2xl hover:border-[#FCA311] group">
              <span className="text-4xl inline-block mb-6 transition-transform duration-300 group-hover:scale-110">
                ⚡
              </span>
              <h3 className="font-['Nunito'] text-lg font-extrabold text-[#14213D] mb-2.5 tracking-tight">
                Akses Instan 24/7
              </h3>
              <p className="font-['DM_Sans'] text-sm text-[#808080] leading-[1.7] font-normal">
                Cek kondisi kesehatan awal Anda kapan saja dan di mana saja
                sebelum memutuskan mengunjungi dokter.
              </p>
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: HOW WE WORK (Alur Proses 01, 02, 03) ─── */}
        <section className="mt-24 pt-20 border-t border-[#E5E5E5] w-full animate-fade-up delay-100">
          <div className="text-center mb-14">
            <h2 className="font-['Nunito'] text-3xl md:text-4xl font-extrabold text-[#14213D] tracking-tight">
              Bagaimana Kami Bekerja
            </h2>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-12 mt-12">
            {/* Langkah 1 */}
            <div className="flex-1 text-left relative group">
              <span className="font-['Nunito'] text-[42px] font-black text-[#FCA311] opacity-40 mb-2 block transition-all duration-300 transform group-hover:scale-105 group-hover:text-[#14213D] group-hover:opacity-100">
                01
              </span>
              <h3 className="font-['Nunito'] text-base font-bold text-[#1e1a17] mb-2.5 tracking-tight">
                Ketik Keluhan
              </h3>
              <p className="font-['DM_Sans'] text-sm text-[#808080] leading-[1.7] font-normal">
                Masukkan keluhan kesehatan Anda pada kolom percakapan secara
                santai dengan bahasa Anda sendiri.
              </p>
            </div>

            {/* Langkah 2 */}
            <div className="flex-1 text-left relative group">
              <span className="font-['Nunito'] text-[42px] font-black text-[#FCA311] opacity-40 mb-2 block transition-all duration-300 transform group-hover:scale-105 group-hover:text-[#14213D] group-hover:opacity-100">
                02
              </span>
              <h3 className="font-['Nunito'] text-base font-bold text-[#1e1a17] mb-2.5 tracking-tight">
                Analisis Sistem
              </h3>
              <p className="font-['DM_Sans'] text-sm text-[#808080] leading-[1.7] font-normal">
                Kecerdasan buatan kami segera memetakan pola keluhan Anda dengan
                ribuan relasi database gejala medis baku.
              </p>
            </div>

            {/* Langkah 3 */}
            <div className="flex-1 text-left relative group">
              <span className="font-['Nunito'] text-[42px] font-black text-[#FCA311] opacity-40 mb-2 block transition-all duration-300 transform group-hover:scale-105 group-hover:text-[#14213D] group-hover:opacity-100">
                03
              </span>
              <h3 className="font-['Nunito'] text-base font-bold text-[#1e1a17] mb-2.5 tracking-tight">
                Hasil & Rekomendasi
              </h3>
              <p className="font-['DM_Sans'] text-sm text-[#808080] leading-[1.7] font-normal">
                Dapatkan estimasi prediksi kecocokan penyakit beserta
                rekomendasi tindakan pertama yang aman dilakukan.
              </p>
            </div>
          </div>
        </section>

        {/* ─── SECTION 4: DISCLAIMER & TIM PENGEMBANG ─── */}
        <section className="mt-24 pt-20 border-t border-[#E5E5E5] flex flex-col gap-12 w-full animate-fade-up delay-200">
          {/* Box Disclaimer */}
          <div className="bg-[#ffebee] border-l-4 border-[#e84545] rounded-r-2xl p-10 text-left transition-all duration-300 hover:shadow-lg">
            <h3 className="font-['Nunito'] text-base font-bold text-[#c62828] mb-2.5 tracking-tight">
              ⚠️ Penting untuk Diingat (Medical Disclaimer)
            </h3>
            <p className="font-['DM_Sans'] text-sm text-[#b71c1c] leading-[1.7] font-normal">
              Platform DiagnoKu adalah asisten digital berbasis kecerdasan
              buatan untuk membantu melakukan pengecekan awal secara mandiri.
              Kami{" "}
              <strong className="font-bold">
                bukan merupakan pengganti diagnosis dokter resmi
              </strong>
              . Apabila Anda mengalami keluhan yang berat atau darurat, segera
              hubungi atau datangi klinik dan rumah sakit terdekat.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TentangPages;
