# 🩺 DiagnoKu

> **DiagnoKu** adalah aplikasi web berbasis AI untuk memeriksa kemungkinan penyakit berdasarkan gejala yang kamu rasakan. Masukkan gejala → sistem kasih tau **top-3 kemungkinan penyakit** beserta tingkat kepercayaannya.

---

## 🤔 DiagnoKu itu apa?

| | |
|---|---|
| 🩺 **Symptom Checker** | Kamu ketik gejala yang dirasakan, sistem kasih tau kemungkinan penyakitnya |
| 🧠 **Pakai AI** | Bukan aturan manual — model *deep learning* yang sudah dilatih dari data 219 penyakit |
| 🏆 **Top-3 Hasil** | Hasilnya 3 kemungkinan penyakit, diurutkan dari yang paling mirip gejalanya |

---

## 🏗️ Cara Kerja Sistem (Gambaran Besar)

Bayangkan seperti rantai — browser kamu → Back End → AI → Model ML:

```
Browser kamu  →  Back End (Node.js)  →  AI Service (Python)  →  Model ML
  :5173              :3000                    :8000               .keras
```

### Penjelasan tiap bagian:

**🖥️ Front End** (port 5173)
Tampilan website yang kamu lihat dan klik. Dibuat dengan **React + Vite**.

**🔀 Back End** (port 3000)
Jembatan antara website dan AI. Juga bertugas menerjemahkan nama penyakit ke **Bahasa Indonesia**.

**🤖 AI Service** (port 8000)
*Engine* prediksi utama. Menerima daftar gejala, menjalankan model, mengembalikan hasil.

**📦 Model ML**
File `.keras` — hasil training dari **219 kelas penyakit** dan **382 fitur gejala**.

---

## 🛠️ Prasyarat (Wajib Terinstal)

Sebelum mulai, pastikan ini sudah ada di komputermu:

- **Python** versi 3.10 ke atas → [python.org](https://www.python.org/downloads/)
- **Node.js** versi 18 ke atas → [nodejs.org](https://nodejs.org/)
- **Terminal / Command Prompt** (CMD, PowerShell, atau Terminal bawaan VS Code)

Cek apakah sudah terinstal dengan perintah ini:

```bash
python --version
node --version
```

---

## 🚀 Cara Menjalankan

> ⚠️ **Penting:** Buka **3 terminal terpisah** — masing-masing untuk satu service. Ketiga service harus berjalan bersamaan.

---

### Terminal 1 — AI Service (Python) · Jalankan ini PERTAMA

> Harus pertama karena Back End butuh AI Service sudah aktif.

```bash
cd ai_service
pip install -r requirements.txt
uvicorn app:app --reload
```

✅ Tunggu sampai muncul tulisan: `Application startup complete`

---

### Terminal 2 — Back End (Node.js)

```bash
cd back_end
npm install
npm run dev
```

✅ Server berjalan di: `http://localhost:3000`

---

### Terminal 3 — Front End (React)

```bash
cd front_end
npm install
npm run dev
```

✅ Buka browser → **http://localhost:5173**

---

## 🧪 Coba API Langsung (Opsional)

Kalau mau tes AI-nya langsung tanpa buka website, buka browser dan masuk ke:

```
http://localhost:8000/docs
```

Di sana ada halaman interaktif untuk kirim gejala dan lihat hasilnya.

**Contoh kirim gejala:**

```json
POST /predict

{
  "symptoms": ["fever", "cough", "headache"],
  "top_k": 3
}
```

**Contoh hasil yang dikembalikan:**

```json
{
  "predictions": [
    { "rank": 1, "disease": "Influenza", "confidence_pct": "87.21%" },
    { "rank": 2, "disease": "Common Cold", "confidence_pct": "6.54%" },
    { "rank": 3, "disease": "Dengue Fever", "confidence_pct": "3.12%" }
  ]
}
```

---

## 📁 Isi Folder Proyek

```
DiagnoKu/
│
├── ai_service/        ← Engine AI (Python + FastAPI)
├── back_end/          ← Server penghubung (Node.js + Express)
├── front_end/         ← Tampilan website (React + Vite)
├── AI -Diagnoku/      ← Notebook training model
└── DS_DiagnoKu/       ← Dashboard analitik data (Streamlit)
```

---

## ❓ Troubleshooting

**"Module not found" saat pip install**
→ Coba: `pip install -r requirements.txt --break-system-packages`

**"Cannot find module" saat npm install**
→ Pastikan kamu sudah masuk ke folder yang benar dengan `cd nama_folder`

**Website tidak bisa prediksi / error**
→ Pastikan AI Service (terminal 1) dan Back End (terminal 2) sudah berjalan dulu sebelum buka website

**Port sudah dipakai**
→ Matikan aplikasi lain yang memakai port 3000, 5173, atau 8000

---

## ⚠️ Disclaimer

> DiagnoKu **bukan pengganti dokter**. Hasil prediksi hanya bersifat informatif dan edukatif.
> Selalu konsultasikan kondisi kesehatanmu kepada tenaga medis yang berwenang.

---

*Coding Camp powered by DBS 2026 — Kelompok CC26-PSU200*
