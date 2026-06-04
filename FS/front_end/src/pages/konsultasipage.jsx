import { useState, useRef, useEffect, useCallback } from "react";
import { getSymptoms, predictSymptoms } from "../services/aiApi.js";

// ─── DAFTAR GEJALA ───
const DEFAULT_SYMPTOMS = [
  "Demam",
  "Batuk kering",
  "Batuk berdahak",
  "Sakit kepala",
  "Pusing",
  "Nyeri otot",
  "Mual / muntah",
  "Diare",
  "Sesak napas",
  "Nyeri dada",
  "Sakit tenggorokan",
  "Hidung tersumbat",
  "Menggigil",
  "Kelelahan",
  "Mata merah / gatal",
  "Nyeri sendi",
  "Perut kembung",
  "Mual tanpa muntah",
  "Mimisan",
  "Sulit konsentrasi",
  "Susah tidur",
  "Keringat berlebih",
  "Telinga berdenging",
  "Mulut kering",
  "Jantung berdebar",
];

// ─── KOMPONEN: INPUT PENCARIAN GEJALA ───
function SymptomPicker({ value, onChange, symptoms = DEFAULT_SYMPTOMS }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const selected = value || [];

  const symptomOptions = symptoms.length > 0 ? symptoms : DEFAULT_SYMPTOMS;
  const parsedSymptoms = symptomOptions.map((s) => ({
    text: s,
    full: s,
  }));

  const filtered = parsedSymptoms.filter(
    (s) =>
      s.text.toLowerCase().includes(query.toLowerCase()) &&
      !selected.includes(s.full),
  );

  const inlineMatch = query
    ? filtered.find((s) => s.text.toLowerCase().startsWith(query.toLowerCase()))
    : null;
  const predictedRemainder = inlineMatch
    ? inlineMatch.text.substring(query.length)
    : "";

  const remove = (sFull) => onChange(selected.filter((x) => x !== sFull));
  const add = (sFull) => {
    if (!selected.includes(sFull)) onChange([...selected, sFull]);
    setQuery("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && query === "" && selected.length > 0) {
      remove(selected[selected.length - 1]);
    } else if (e.key === "Tab" || e.key === "ArrowRight") {
      if (inlineMatch && query.length > 0) {
        e.preventDefault();
        add(inlineMatch.full);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (inlineMatch && query.length > 0) add(inlineMatch.full);
      else if (query.trim().length > 0) add(query.trim());
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => inputRef.current?.focus()}
        className={`min-h-[48px] p-2 rounded-2xl border-2 cursor-text flex flex-wrap gap-2 items-center transition-colors duration-300 bg-white ${query ? "border-[#FCA311]" : "border-[#E5E5E5]"}`}
      >
        {selected.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1 bg-[#14213D] rounded-full py-1.5 px-3 font-['DM_Sans'] text-xs text-white font-bold animate-fade-in"
          >
            {s}
            <span
              onClick={(e) => {
                e.stopPropagation();
                remove(s);
              }}
              className="cursor-pointer text-[#FCA311] ml-1 text-sm font-black hover:text-white transition-colors"
            >
              ×
            </span>
          </span>
        ))}
        <div className="relative flex-1 min-w-[140px] h-6 flex items-center">
          {predictedRemainder && (
            <div className="absolute left-1 top-0 bottom-0 flex items-center font-['DM_Sans'] text-sm pointer-events-none whitespace-pre">
              <span className="invisible">{query}</span>
              <span className="text-[#cccccc]">{predictedRemainder}</span>
              <span className="text-[10px] ml-2 bg-[#f2f3f5] px-1.5 py-0.5 rounded text-[#808080] font-bold border border-[#E5E5E5]">
                Tab ⇥
              </span>
            </div>
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selected.length === 0 && !query
                ? "Ketik gejala (cth: Demam)..."
                : ""
            }
            className="absolute left-0 top-0 bottom-0 w-full border-none outline-none font-['DM_Sans'] text-sm text-[#000000] bg-transparent px-1 font-medium placeholder-[#cccccc]"
          />
        </div>
      </div>
    </div>
  );
}

// ─── SKENARIO PERTANYAAN CHATBOT ───
const QUESTIONS = [
  {
    key: "nama",
    botMsg: () =>
      "Halo! Selamat datang di DiagnoKu.\n\nSaya akan membantu menganalisis kondisi kesehatan Anda. Boleh saya tahu nama Anda?",
    type: "text",
    placeholder: "Ketik nama Anda...",
    formatAnswer: (v) => v,
  },
  {
    key: "usia",
    botMsg: (d) =>
      `Senang bertemu dengan Anda, ${d.nama}!\n\nBerapa usia Anda saat ini?`,
    type: "text",
    placeholder: "Contoh: 28",
    formatAnswer: (v) => v + " tahun",
  },
  {
    key: "jenis_kelamin",
    botMsg: () => "Apa jenis kelamin Anda?",
    type: "chips",
    options: ["Laki-laki", "Perempuan"],
    formatAnswer: (v) => v,
  },
  {
    key: "gejala",
    botMsg: () =>
      "Gejala apa saja yang sedang Anda rasakan?\n\nKetik keluhan Anda di bawah ini. Anda bisa menekan tombol Tab ⇥ untuk memilih secara otomatis.",
    type: "symptom_picker",
    formatAnswer: (v) => v.join(", "),
  },
];

// ─── KOMPONEN UI CHAT ───
const BotBubble = ({ text, animate }) => (
  <div
    className={`flex gap-3 max-w-[85%] self-start ${animate ? "animate-slide-up-fade" : ""}`}
  >
    <div className="w-9 h-9 rounded-full bg-[#14213D] flex items-center justify-center shrink-0 mt-1 shadow-sm border border-[#FCA311]/20 overflow-hidden">
      <img
        src="/diagnoku-logo.png"
        alt="Logo DiagnoKu"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4 rounded-[20px] rounded-tl-[4px] bg-white border border-[#E5E5E5] shadow-sm">
      {text.split("\n").map((l, i) =>
        l === "" ? (
          <br key={i} />
        ) : (
          <p
            key={i}
            className="font-['DM_Sans'] text-[14.5px] text-[#333333] m-0 leading-relaxed font-medium"
          >
            {l}
          </p>
        ),
      )}
    </div>
  </div>
);

const UserBubble = ({ text }) => (
  <div className="flex gap-3 max-w-[80%] self-end animate-slide-up-fade">
    <div className="p-4 rounded-[20px] rounded-tr-[4px] bg-[#14213D] text-white font-['DM_Sans'] text-[14.5px] leading-relaxed font-medium shadow-md">
      {text}
    </div>
    <div className="w-9 h-9 rounded-full bg-[#FCA311] text-[#14213D] flex items-center justify-center text-sm font-black shrink-0 mt-1 shadow-sm">
      U
    </div>
  </div>
);

const TypingBubble = () => (
  <div className="flex gap-3 max-w-[85%] self-start animate-fade-in">
    <div className="w-9 h-9 rounded-full bg-[#14213D] flex items-center justify-center shrink-0 mt-1 overflow-hidden">
      <img
        src="/diagnoku-logo.png"
        alt="Logo DiagnoKu"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="px-5 py-4 rounded-[20px] rounded-tl-[4px] bg-white border border-[#E5E5E5] flex gap-1.5 items-center shadow-sm h-[48px]">
      <span
        className="w-2 h-2 rounded-full bg-[#FCA311] animate-bounce-typing"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-[#FCA311] animate-bounce-typing"
        style={{ animationDelay: "200ms" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-[#FCA311] animate-bounce-typing"
        style={{ animationDelay: "400ms" }}
      />
    </div>
  </div>
);

// ─── KOMPONEN: AREA INPUT BAWAH ───
function InputArea({ q, onAnswer, tempVal, setTempVal, symptoms }) {
  if (!q) return null;

  if (q.type === "chips")
    return (
      <div className="flex flex-wrap gap-2.5 p-4 animate-fade-in">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => onAnswer(opt)}
            className="px-5 py-2.5 rounded-full bg-white border-[1.5px] border-[#E5E5E5] font-['DM_Sans'] text-sm font-bold text-[#14213D] cursor-pointer transition-all duration-200 hover:border-[#FCA311] hover:bg-[#ffeec2]/20 hover:text-[#FCA311] hover:-translate-y-0.5 shadow-sm active:scale-95"
          >
            {opt}
          </button>
        ))}
      </div>
    );

  if (q.type === "symptom_picker") {
    const sel = tempVal || [];
    return (
      <div className="p-4 bg-white/50 animate-fade-in flex flex-col gap-3">
        <SymptomPicker value={sel} onChange={setTempVal} symptoms={symptoms} />
        <button
          onClick={() => sel.length > 0 && onAnswer(sel)}
          disabled={sel.length === 0}
          className={`py-3 px-6 rounded-full font-['Nunito'] text-sm font-black tracking-wide transition-all duration-300 w-fit self-end ${sel.length > 0 ? "bg-[#FCA311] text-[#14213D] shadow-md hover:bg-[#e6940d] hover:shadow-lg hover:-translate-y-0.5 active:scale-95" : "bg-[#E5E5E5] text-[#808080] cursor-not-allowed"}`}
        >
          Konfirmasi Gejala ({sel.length}) →
        </button>
      </div>
    );
  }

  if (q.type === "scale") {
    const val = tempVal || 5;
    return (
      <div className="p-4 bg-white/50 animate-fade-in">
        <div className="flex gap-2 flex-wrap mb-4 justify-center md:justify-start">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              onClick={() => setTempVal(n)}
              className={`w-11 h-11 rounded-xl border-2 font-['Nunito'] text-base font-black transition-all duration-200 active:scale-90 ${val === n ? "border-[#14213D] bg-[#14213D] text-[#FCA311] shadow-md scale-110" : "border-[#E5E5E5] bg-white text-[#333333] hover:border-[#FCA311]"}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => onAnswer(val)}
            className="py-3 px-6 rounded-full bg-[#FCA311] text-[#14213D] font-['Nunito'] text-sm font-black tracking-wide shadow-md hover:bg-[#e6940d] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            Pilih Skala {val}/10 →
          </button>
        </div>
      </div>
    );
  }

  if (q.type === "text" || q.type === "text_optional") {
    const isAgeQuestion = q.key === "usia";
    const filteredValue = isAgeQuestion
      ? String(tempVal || "").replace(/[^\d]/g, "")
      : tempVal || "";

    const handleSubmit = () => {
      const rawValue = String(tempVal || "").trim();
      const numericValue = rawValue.replace(/[^\d]/g, "");

      if (isAgeQuestion) {
        if (numericValue) onAnswer(numericValue);
        else if (q.type === "text_optional") onAnswer("");
      } else if (rawValue) {
        onAnswer(rawValue);
      } else if (q.type === "text_optional") onAnswer("");
    };
    return (
      <div className="p-4 bg-white/80 border-t border-[#E5E5E5] flex gap-3 items-center animate-fade-in">
        <input
          value={filteredValue}
          onChange={(e) =>
            setTempVal(
              isAgeQuestion
                ? e.target.value.replace(/[^\d]/g, "")
                : e.target.value,
            )
          }
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={q.placeholder}
          type={isAgeQuestion ? "number" : "text"}
          inputMode={isAgeQuestion ? "numeric" : "text"}
          min={isAgeQuestion ? "0" : undefined}
          max={isAgeQuestion ? "120" : undefined}
          className="flex-1 py-3 px-5 rounded-full border-[1.5px] border-[#E5E5E5] font-['DM_Sans'] text-[14.5px] text-[#000000] outline-none bg-white font-medium focus:border-[#FCA311] focus:shadow-sm transition-all"
        />
        {q.type === "text_optional" && (
          <button
            onClick={() => onAnswer("")}
            className="py-2.5 px-4 rounded-full bg-transparent border border-[#E5E5E5] font-['DM_Sans'] text-xs text-[#666666] font-bold hover:bg-gray-50 hover:text-black transition-colors"
          >
            Lewati
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="w-12 h-12 rounded-full bg-[#14213D] text-[#FCA311] border-none flex items-center justify-center text-xl shrink-0 font-black shadow-md hover:bg-[#0d1629] hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          ↑
        </button>
      </div>
    );
  }
  return null;
}

function FollowUpArea({ symptoms, onSubmit, onSkip, prompt }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  return (
    <div className="p-4 bg-white/90 border-t border-[#E5E5E5] flex flex-col gap-3 animate-fade-in">
      <div>
        <p className="font-['Nunito'] text-sm font-black text-[#14213D] m-0">
          Hasil masih mirip, tambahkan gejala lain
        </p>
        <p className="font-['DM_Sans'] text-[12px] text-[#667085] m-0 mt-1 leading-relaxed">
          {prompt ||
            "Pilih gejala tambahan yang masih Anda rasakan supaya prediksi bisa mengerucut."}
        </p>
      </div>

      <SymptomPicker
        value={selectedSymptoms}
        onChange={setSelectedSymptoms}
        symptoms={symptoms}
      />

      <div className="flex flex-wrap gap-2 justify-end">
        <button
          onClick={onSkip}
          className="py-2.5 px-4 rounded-full bg-transparent border border-[#E5E5E5] font-['DM_Sans'] text-xs text-[#666666] font-bold hover:bg-gray-50 hover:text-black transition-colors"
        >
          Lanjut tanpa tambahan
        </button>
        <button
          onClick={() =>
            selectedSymptoms.length > 0 && onSubmit(selectedSymptoms)
          }
          disabled={selectedSymptoms.length === 0}
          className={`py-2.5 px-5 rounded-full font-['Nunito'] text-sm font-black tracking-wide transition-all duration-300 ${selectedSymptoms.length > 0 ? "bg-[#FCA311] text-[#14213D] shadow-md hover:bg-[#e6940d] hover:shadow-lg hover:-translate-y-0.5 active:scale-95" : "bg-[#E5E5E5] text-[#808080] cursor-not-allowed"}`}
        >
          Tambahkan Gejala ({selectedSymptoms.length})
        </button>
      </div>
    </div>
  );
}

// ????????? KOMPONEN: PANEL HASIL PREDIKSI ?????????
// ─── KOMPONEN: PANEL HASIL PREDIKSI ───
function PredictionPanel({ predictions, loading, onReset }) {
  if (loading)
    return (
      <div className="flex flex-col gap-4 animate-fade-in">
        <h3 className="font-['Nunito'] text-lg font-black text-[#14213D] m-0">
          Sedang Menganalisis...
        </h3>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm animate-pulse"
          >
            <div className="h-10 bg-gray-100 border-b border-gray-200"></div>
            <div className="p-4 flex flex-col gap-3">
              <div className="w-3/5 h-3 rounded-md bg-gray-200"></div>
              <div className="w-full h-2 rounded-full bg-gray-100"></div>
            </div>
          </div>
        ))}
        <p className="font-['DM_Sans'] text-xs text-[#808080] text-center font-bold mt-2">
          Mesin AI sedang memproses data gejala Anda.
        </p>
      </div>
    );

  if (!predictions || predictions.length === 0)
    return (
      <div className="text-center py-12 flex flex-col items-center justify-center h-full opacity-60">
        <div className="text-6xl mb-4 grayscale opacity-50"></div>
        <p className="font-['DM_Sans'] text-sm text-[#808080] leading-relaxed font-bold max-w-[200px]">
          Jawab semua pertanyaan chatbot untuk mendapatkan hasil prediksi medis
          awal Anda di sini.
        </p>
      </div>
    );

  const cfg = [
    {
      accent: "#16a34a",
    },
    {
      accent: "#eab308",
    },
    {
      accent: "#dc2626",
    },
  ];

  return (
    <div className="animate-slide-up-fade">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-['Nunito'] text-lg font-black text-[#14213D] m-0">
          Hasil Analisis
        </h3>
        <button
          onClick={onReset}
          className="bg-white border border-[#E5E5E5] rounded-full py-1.5 px-3 font-['DM_Sans'] text-xs text-[#333333] font-bold hover:bg-gray-50 transition-colors shadow-sm"
        >
          Ulangi Test
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {predictions.map((p, i) => {
          const c = cfg[i] || cfg[2];
          return (
            <div
              key={i}
              className="group overflow-hidden rounded-[18px] border border-[#E5E5E5] bg-white shadow-[0_10px_24px_rgba(20,33,61,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(20,33,61,0.12)]"
            >
              <div className="flex items-stretch">
                <div
                  className="w-3 shrink-0"
                  style={{ backgroundColor: c.accent }}
                  aria-hidden="true"
                />
                <div className="flex-1 px-4 py-4 md:px-5 md:py-5 flex items-center min-h-[84px]">
                  <p className="font-['Nunito'] text-[18px] md:text-[20px] font-black text-[#14213D] m-0 leading-tight">
                    {p.name}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-4 bg-[#fff9f0] border border-[#fde394] rounded-xl text-center shadow-sm">
        <p className="font-['DM_Sans'] text-xs text-[#c77c00] font-bold leading-relaxed m-0">
          Hasil ini murni prediksi kecerdasan buatan. Segera kunjungi klinik
          atau RS terdekat untuk diagnosis pasti dan penanganan medis yang
          tepat.
        </p>
      </div>
    </div>
  );
}

// ─── HALAMAN UTAMA ─── ───
function KonsultasiPages() {
  const [chatLog, setChatLog] = useState([]);
  const [qIndex, setQIndex] = useState(-1);
  const [formData, setFormData] = useState({});
  const [tempVal, setTempVal] = useState(null);
  const [showTyping, setShowTyping] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [loadingPred, setLoadingPred] = useState(false);
  const [done, setDone] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [symptomsList, setSymptomsList] = useState([]);
  const [followUpState, setFollowUpState] = useState(null);
  const [followUpRound, setFollowUpRound] = useState(0);

  // ✅ FIX 1: Inisialisasi langsung dari localStorage di useState (bukan di useEffect)
  const [consultationHistory, setConsultationHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("consultationHistory");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [backupHistoryJson, setBackupHistoryJson] = useState(() => {
    return localStorage.getItem("consultationHistoryJson") || "[]";
  });

  const chatScrollRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatLog, showTyping]);

  useEffect(() => {
    let isMounted = true;

    const loadSymptoms = async () => {
      try {
        const data = await getSymptoms();
        const labels =
          Array.isArray(data?.saran) && data.saran.length > 0
            ? data.saran
            : (data?.gejala || [])
                .map((item) => item.nama)
                .filter(Boolean)
                .sort((a, b) => a.localeCompare(b, "id"));

        if (isMounted && labels.length > 0) {
          setSymptomsList(labels);
        }
      } catch (error) {
        console.warn(
          "Gagal memuat daftar gejala dari backend, memakai cadangan lokal.",
          error,
        );
        if (isMounted) {
          setSymptomsList(DEFAULT_SYMPTOMS);
        }
      }
    };

    loadSymptoms();

    return () => {
      isMounted = false;
    };
  }, []);

  const pushBotMsg = useCallback(
    (msg, delay = 600) =>
      new Promise((res) => {
        setShowTyping(true);
        setTimeout(() => {
          setShowTyping(false);
          setChatLog((prev) => [...prev, { role: "bot", text: msg }]);
          res();
        }, delay);
      }),
    [],
  );

  // ✅ FIX 4: Wrap startConvo dengan useCallback agar bisa masuk dependency array
  const startConvo = useCallback(async () => {
    setQIndex(0);
    await pushBotMsg(QUESTIONS[0].botMsg({}), 800);
  }, [pushBotMsg]);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      const sessionId = Date.now().toString();
      setCurrentSessionId(sessionId);
      startConvo();
    }
  }, [startConvo]);

  const handleAnswer = async (value) => {
    const q = QUESTIONS[qIndex];
    const displayVal = q.formatAnswer(value);
    const newData = { ...formData, [q.key]: value };

    setFormData(newData);
    setTempVal(null);
    setChatLog((prev) => [...prev, { role: "user", text: displayVal }]);

    const next = qIndex + 1;
    if (next < QUESTIONS.length) {
      setQIndex(next);
      await pushBotMsg(QUESTIONS[next].botMsg(newData), 700);
    } else {
      setQIndex(-2);
      setDone(true);
      await pushBotMsg(
        `Terima kasih ${newData.nama}! 🙏 Data Anda sudah kami kumpulkan secara aman. Saya sedang menganalisis pola gejala kesehatan Anda...`,
        800,
      );
      await fetchPredictions(newData);
    }
  };

  // ✅ FIX 3: Hapus parameter `data` yang tidak dipakai
  const fetchPredictions = async (data) => {
    setLoadingPred(true);
    try {
      const result = await predictSymptoms(data.gejala || [], 3);
      const computedPredictions = (result.prediksi || []).map((item) => {
        const confidence = Number.parseFloat(
          String(item.persen_kepercayaan || "")
            .replace("%", "")
            .trim(),
        );
        const level =
          Number.isFinite(confidence) && confidence >= 60
            ? "Tinggi"
            : Number.isFinite(confidence) && confidence >= 30
              ? "Sedang"
              : "Rendah";

        return {
          name: item.penyakit,
          confidence: Number.isFinite(confidence) ? confidence : 0,
          severity: level,
        };
      });

      setPredictions(computedPredictions);

      const topOne = computedPredictions[0]?.confidence ?? 0;
      const topTwo = computedPredictions[1]?.confidence ?? 0;
      const isAmbiguous =
        followUpRound < 2 &&
        computedPredictions.length >= 2 &&
        topOne < 25 &&
        topOne - topTwo < 12;

      if (isAmbiguous) {
        const firstName = computedPredictions[0]?.name || "penyakit pertama";
        const secondName = computedPredictions[1]?.name || "penyakit kedua";
        setFollowUpState({
          prompt: `Hasilnya masih mirip antara ${firstName} dan ${secondName}. Tambahkan gejala lain supaya prediksi lebih mengerucut.`,
        });
        setFollowUpRound((prev) => prev + 1);
        await pushBotMsg(
          `Hasilnya masih mirip antara ${firstName} dan ${secondName}.\n\nTambahkan gejala lain yang masih Anda rasakan supaya saya bisa membedakan keduanya.`,
          500,
        );
        return;
      }

      setFollowUpState(null);
      setFollowUpRound(0);

      const newSession = {
        id: currentSessionId,
        nama: data.nama,
        gejala: data.gejala,
        predictions: computedPredictions,
        aiResult: result,
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [newSession, ...consultationHistory].slice(0, 20);
      localStorage.setItem(
        "consultationHistory",
        JSON.stringify(updatedHistory),
      );
      setConsultationHistory(updatedHistory);

      const parsedBackup = (() => {
        try {
          return JSON.parse(backupHistoryJson);
        } catch {
          return [];
        }
      })();
      const updatedBackup = [newSession, ...parsedBackup].slice(0, 20);
      const jsonString = JSON.stringify(updatedBackup);
      localStorage.setItem("consultationHistoryJson", jsonString);
      setBackupHistoryJson(jsonString);

      await pushBotMsg(
        "Analisis selesai! 🎉\n\nSilakan lihat panel 'Hasil Analisis' di sebelah kanan layar untuk melihat tiga kemungkinan penyakit teratas. Jaga kesehatan dan perbanyak minum air putih ya!",
        400,
      );
    } catch (err) {
      console.error(err);
      await pushBotMsg(
        "Mohon maaf, terjadi kesalahan pada server saat menganalisis data Anda. Silakan coba beberapa saat lagi.",
        400,
      );
    } finally {
      setLoadingPred(false);
    }
  };

  const handleReset = () => {
    setChatLog([]);
    setQIndex(-1);
    setFormData({});
    setTempVal(null);
    setShowTyping(false);
    setPredictions(null);
    setLoadingPred(false);
    setDone(false);
    setShowHistory(false);
    setFollowUpState(null);
    setFollowUpRound(0);
    const sessionId = Date.now().toString();
    setCurrentSessionId(sessionId);
    startedRef.current = false;
    setTimeout(startConvo, 100);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins}m lalu`;
    if (diffHours < 24) return `${diffHours}h lalu`;
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays}h lalu`;
    return date.toLocaleDateString("id-ID", { month: "short", day: "numeric" });
  };

  const formatGejalaText = (gejala) => {
    if (Array.isArray(gejala)) return gejala.join(", ");
    if (typeof gejala === "string") return gejala;
    return "N/A";
  };

  const getGejalaPreview = (gejala) => {
    if (Array.isArray(gejala)) return gejala[0] || "Konsultasi";
    if (typeof gejala === "string") return gejala.split(",")[0] || "Konsultasi";
    return "Konsultasi";
  };

  const loadConsultation = (session) => {
    setChatLog([]);
    setQIndex(-1);
    setFormData({});
    setPredictions(session.predictions);
    setDone(true);
    setShowHistory(false);
    setFollowUpState(null);
    setChatLog([
      { role: "bot", text: `Riwayat: ${session.nama}` },
      {
        role: "bot",
        text: `Gejala yang dilaporkan: ${formatGejalaText(session.gejala)}`,
      },
    ]);
  };

  const deleteConsultation = (sessionId) => {
    const updated = consultationHistory.filter((h) => h.id !== sessionId);
    setConsultationHistory(updated);
    localStorage.setItem("consultationHistory", JSON.stringify(updated));
  };

  const clearVisibleHistory = () => {
    setConsultationHistory([]);
    localStorage.removeItem("consultationHistory");
  };

  const currentQ =
    qIndex >= 0 && qIndex < QUESTIONS.length ? QUESTIONS[qIndex] : null;

  const historyList = consultationHistory.map((session, idx) => ({
    id: session.id,
    title: `${session.nama} - ${getGejalaPreview(session.gejala)}`,
    time: formatTime(session.timestamp),
    active: idx === 0,
  }));

  return (
    <div className="flex-1 bg-[#f8f8f8] p-4 md:p-6 w-full h-[calc(100vh-70px)] overflow-hidden flex flex-col box-border">
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes bounceTyping { 0%, 80%, 100% { transform: scale(0.4); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }
        .animate-slide-up-fade { animation: fadeSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-bounce-typing { animation: bounceTyping 1.2s infinite ease-in-out both; }
        .animate-fade-in { animation: fadeSlideIn 0.3s ease-out forwards; }
        .chat-scroll::-webkit-scrollbar { width: 6px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #cccccc; border-radius: 10px; }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background: #14213D; }
      `}</style>

      <div className="flex flex-1 rounded-3xl overflow-hidden shadow-2xl border border-[#E5E5E5] bg-white h-full max-w-[1300px] mx-auto w-full relative">
        {/* Overlay mobile */}
        {showHistory && (
          <div
            className="lg:hidden absolute inset-0 bg-black/40 z-40"
            onClick={() => setShowHistory(false)}
          ></div>
        )}

        {/* ─── SIDEBAR KIRI ─── */}
        <aside
          className={`${showHistory ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} absolute lg:relative inset-y-0 left-0 z-50 flex flex-col w-[260px] bg-white border-r border-[#E5E5E5] shrink-0 transition-transform duration-300 h-full`}
        >
          <div className="px-5 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-[#fafafa]">
            <span className="font-['Nunito'] text-[16px] font-black text-[#14213D] m-0">
              Riwayat Chat
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="w-8 h-8 rounded-full bg-[#14213D] text-[#FCA311] flex items-center justify-center text-lg font-black hover:bg-[#FCA311] hover:text-[#14213D] transition-colors shadow-sm"
                title="Konsultasi Baru"
              >
                +
              </button>
              <button
                onClick={() => setShowHistory(false)}
                className="lg:hidden w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-black hover:bg-gray-300 transition-colors"
                title="Tutup Riwayat"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 chat-scroll">
            {historyList.length === 0 ? (
              <div className="text-center py-8 text-[#808080]">
                <p className="font-['DM_Sans'] text-sm font-medium m-0">
                  Belum ada riwayat konsultasi
                </p>
              </div>
            ) : (
              historyList.map((h, i) => (
                <div
                  key={h.id}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border group hover:shadow-sm ${h.active ? "bg-[#f8f8f8] border-[#E5E5E5] shadow-sm" : "bg-transparent border-transparent hover:bg-gray-50 hover:border-[#E5E5E5]"}`}
                  onClick={() => loadConsultation(consultationHistory[i])}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-['Nunito'] text-[14px] font-bold text-[#14213D] m-0 mb-1 truncate">
                        {h.title}
                      </p>
                      <p className="font-['DM_Sans'] text-[11px] font-medium text-[#808080] m-0">
                        {h.time}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConsultation(h.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-black hover:bg-red-200 transition-all shrink-0"
                      title="Hapus"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-5 py-4 border-t border-[#E5E5E5] bg-[#fafafa] flex flex-col gap-2">
            <button
              onClick={clearVisibleHistory}
              className="w-full py-3 rounded-full bg-[#14213D] text-[#FCA311] font-['DM_Sans'] text-sm font-black transition-colors hover:bg-[#0f172a] hover:text-white"
            >
              Hapus Riwayat
            </button>
          </div>
        </aside>

        {/* ─── TENGAH: AREA CHAT ─── */}
        <section className="flex-1 flex flex-col border-r border-[#E5E5E5] h-full relative bg-[#fafafa] min-w-[300px]">
          <div className="px-6 py-4 bg-white border-b border-[#E5E5E5] flex items-center justify-between shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHistory(true)}
                className="lg:hidden w-10 h-10 rounded-full bg-white border border-[#E5E5E5] text-[#14213D] flex items-center justify-center text-lg shadow-sm hover:bg-gray-50 transition-colors"
                title="Buka Riwayat"
              >
                ☰
              </button>
              <div className="w-10 h-10 rounded-full bg-[#14213D] flex items-center justify-center shadow-md border-2 border-white relative hidden sm:flex overflow-hidden">
                <img
                  src="/diagnoku-logo.png"
                  alt="Logo DiagnoKu"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h1 className="font-['Nunito'] text-base font-black text-[#14213D] m-0">
                  Asisten Medis
                </h1>
              </div>
            </div>
          </div>

          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5 chat-scroll scroll-smooth bg-[#fafafa]"
          >
            {chatLog.map((m, i) =>
              m.role === "bot" ? (
                <BotBubble
                  key={i}
                  text={m.text}
                  animate={i === chatLog.length - 1}
                />
              ) : (
                <UserBubble key={i} text={m.text} />
              ),
            )}
            {showTyping && <TypingBubble />}
            <div className="h-4 shrink-0"></div>
          </div>

          {!done && !followUpState && (
            <div className="bg-white/90 backdrop-blur-md border-t border-[#E5E5E5] shrink-0 z-10 pb-safe">
              <InputArea
                q={currentQ}
                onAnswer={handleAnswer}
                tempVal={tempVal}
                setTempVal={setTempVal}
                symptoms={symptomsList}
              />
            </div>
          )}

          {followUpState && (
            <div className="bg-white/90 backdrop-blur-md border-t border-[#E5E5E5] shrink-0 z-10 pb-safe">
              <FollowUpArea
                symptoms={symptomsList}
                prompt={followUpState?.prompt}
                onSkip={() => {
                  setFollowUpState(null);
                  setFollowUpRound(0);
                  setDone(true);
                }}
                onSubmit={async (extraSymptoms) => {
                  const mergedSymptoms = Array.from(
                    new Set([...(formData.gejala || []), ...extraSymptoms]),
                  );
                  const updatedData = { ...formData, gejala: mergedSymptoms };
                  setFormData(updatedData);
                  setTempVal(null);
                  setFollowUpState(null);
                  await pushBotMsg(
                    `Baik, saya tambahkan gejala berikut: ${extraSymptoms.join(", ")}.`,
                    400,
                  );
                  await fetchPredictions(updatedData);
                }}
              />
            </div>
          )}
        </section>

        {/* ─── KANAN: PANEL PREDIKSI ─── */}
        <section className="w-[350px] shrink-0 bg-[#f8f8f8] flex flex-col overflow-y-auto chat-scroll h-full hidden lg:flex">
          <div className="p-6 h-full flex flex-col">
            <PredictionPanel
              predictions={predictions}
              loading={loadingPred}
              onReset={handleReset}
            />
          </div>
        </section>

        {/* ─── MOBILE: OVERLAY PREDIKSI ─── */}
        {(done || loadingPred) && !followUpState && (
          <div className="xl:hidden absolute inset-0 z-50 bg-[#f8f8f8] overflow-y-auto animate-fade-in flex flex-col">
            <div className="p-4 bg-white border-b border-[#E5E5E5] flex justify-between items-center sticky top-0 z-10 shadow-sm">
              <h2 className="font-['Nunito'] text-lg font-black text-[#14213D] m-0">
                Laporan Kesehatan
              </h2>
              <button
                onClick={() => setDone(false)}
                className="text-2xl text-[#808080] font-bold p-1"
              >
                ×
              </button>
            </div>
            <div className="p-5">
              <PredictionPanel
                predictions={predictions}
                loading={loadingPred}
                onReset={handleReset}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KonsultasiPages;
