# 🩺 **DiagnoKu Data Insight Dashboard**

Aplikasi dashboard analitik interaktif ini menyajikan wawasan komprehensif (*explanatory data analysis*) dari proses pembersihan data medis DiagnoKu. Dashboard ini dirancang sepenuhnya responsif mendukung **Theme Light** maupun **Theme Dark**.

---

## **Struktur Direktori Proyek**

Pastikan semua komponen aset diletakkan dalam satu folder:

```text
Direktori/
│
├── diagnoku.py                # Skrip utama aplikasi Python Streamlit
├── diagnoku-logo's.png        # Berkas aset logo resmi DiagnoKu (Transparan)
├── diagnoku_biner_v5.csv      # Dataset medis final teroptimasi (int8)
├── kamus_gejala_diagnoku.json # Metadata leksikon sinonim gejala (Fase 4)
└── kamus_penyakit_diagnoku.json # Metadata translasi kelas penyakit (Fase 5)
```

---

## **Cara Menjalankan Dashboard**

Jalankan perintah berikut secara berurutan melalui terminal / command promt (CMD):

1. Masuk ke Folder Proyek
```bash
cd path/to/yout/folder/[nama folder]
```

2. Instalasi Library Depedensi
```bash
pip install streamlit pandas matplotlib seaborn wordcloud
```

3. Jalankan Dashboard
```bash
streamlit run diagnoku.py
```

Dashboard akan otomatis terbuka pada peramban web browser di alamat http://localhost:8501.

---

## **Fitur Utama**

1. Ringkasan Eksekutif: Metrik KPI utama integritas data dan tabel kronologi penyusutan noise (data lineage).
2. Analisis Distribusi Penyakit: Diagram horizontal adaptif untuk memantau sebaran frekuensi kelas target.
3. Analisis Karakteristik Gejala: Eksplorasi fitur keluhan paling dominan melalui grafik batang dan Word Cloud.
4. Eksplorasi Pola Klinis: Simulasi interaktif pemetaan profil diagnosis berbasis representasi biner.

---

*Tim Data Scientist: Coding Camp powered by DBS 2026 - Kelompok CC26-PSU200*