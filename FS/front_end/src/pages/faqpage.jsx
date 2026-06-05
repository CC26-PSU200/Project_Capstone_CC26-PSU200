import { useState } from "react";

const faqData = [
  {
    q: "Apakah DiagnoKu aman dan menjaga privasi saya?",
    a: "Tentu. Semua data gejala, keluhan, dan biodata yang Anda masukkan ke dalam obrolan tidak akan disebarluaskan, dienkripsi secara aman, dan hanya digunakan untuk keperluan kalkulasi prediksi kesehatan instan Anda.",
  },
  {
    q: "Bagaimana cara kerja prediksi gejala di DiagnoKu?",
    a: "AI kami mencocokkan gejala-gejala fisik yang Anda pilih dengan pola database penyakit umum, mengukur tingkat kecocokan (confidence rate), menilai tingkat keparahan (severity), serta memberikan rekomendasi awal yang paling aman berdasarkan standar umum panduan kesehatan.",
  },
  {
    q: "Kapan saya harus segera pergi ke Dokter?",
    a: "Apabila prediksi kesehatan Anda menunjukkan tanda 'Berat' (ditandai dengan indikator merah), atau Anda merasakan gejala darurat seperti sesak napas akut, nyeri dada kiri, atau demam tinggi terus menerus di atas 3 hari, harap segera pergi ke puskesmas atau rumah sakit terdekat.",
  },
];

function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 relative z-10">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-5xl">❓</span>
        <h1 className="text-3xl font-black text-gray-900 mt-3 tracking-tight">
          Pertanyaan Umum (FAQ)
        </h1>
        <p className="text-gray-500 text-sm mt-2 font-medium">
          Temukan jawaban atas pertanyaan seputar penggunaan DiagnoKu
        </p>
      </div>

      {/* Accordion */}
      <div className="flex flex-col gap-3">
        {faqData.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer"
            onClick={() => toggle(idx)}
          >
            {/* Question row */}
            <div
              className={`flex items-center justify-between px-6 py-5 transition-colors duration-200 ${
                openIndex === idx ? "bg-[#FCA311]" : "bg-white"
              }`}
            >
              <span className="font-bold text-gray-900 text-sm leading-snug pr-4">
                {faq.q}
              </span>
              <span className="text-gray-900 font-black text-xl flex-shrink-0">
                {openIndex === idx ? "−" : "+"}
              </span>
            </div>

            {/* Answer */}
            {openIndex === idx && (
              <div className="px-6 py-5 border-t border-gray-100 bg-white">
                <p className="text-gray-700 text-sm leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaqPage;
