import streamlit as st
import pandas as pd
import json
import matplotlib.pyplot as plt
import seaborn as sns
from wordcloud import WordCloud
import os
import zipfile  # Ditambahkan untuk menangani dekompresi file dataset besar (>100MB)

# ==============================================================================
# FASE 0: KONFIGURASI JALUR DIREKTORI (PATH) DINAMIS
# ==============================================================================
# Menentukan root folder aktif tempat file diagnoku.py berada
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) if '__file__' in locals() else os.getcwd()

# Definisikan path absolut untuk setiap aset pendukung
favicon_path = os.path.join(BASE_DIR, "diagnoku-logo's.png")
logo_path = os.path.join(BASE_DIR, "diagnoku-logo's.png")
gejala_json_path = os.path.join(BASE_DIR, 'kamus_gejala_diagnoku.json')
penyakit_json_path = os.path.join(BASE_DIR, 'kamus_penyakit_diagnoku.json')

# ==============================================================================
# FASE 0.1: KONFIGURASI HALAMAN GLOBAL & ESTETIKA RESPONSIF TEMA
# ==============================================================================
st.set_page_config(
    page_title="DiagnoKu Data Insight Dashboard",
    page_icon=favicon_path if os.path.exists(favicon_path) else "🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Definisi warna aksen brand utama
ACCENT_ORANGE = "#fba412"
NAVY_LIGHT = "#495d84"

# ------------------------------------------------------------------------------
# CSS KUSTOM UNTUK SIDEBAR, TEXT, & DROPDOWN BORDER #fba412
# ------------------------------------------------------------------------------
st.markdown(f"""
    <style>
    /* 1. Membuat Sidebar Mengikuti Latar Belakang Utama Pilihan User (Light/Dark) */
    [data-testid="stSidebar"] {{
        background-color: var(--background-color) !important;
        border-right: 1px solid rgba(128, 128, 128, 0.3);
    }}
    
    /* 2. Mengunci Semua Komponen Teks di Dalam Sidebar agar Mengikuti Warna Teks Sistem */
    [data-testid="stSidebar"] [data-testid="stMarkdownContainer"] p,
    [data-testid="stSidebar"] h1, 
    [data-testid="stSidebar"] h2,
    [data-testid="stSidebar"] label, 
    [data-testid="stSidebar"] span, 
    [data-testid="stSidebar"] small {{
        color: var(--text-color) !important;
    }}
    
    /* 3. Memaksa Pinggiran Box Dropdown (Selectbox) di Sidebar Menggunakan Warna Kustom #fba412 */
    [data-testid="stSidebar"] div[data-baseweb="select"] {{
        border: 2px solid {ACCENT_ORANGE} !important;
        border-radius: 8px !important;
        background-color: transparent !important;
    }}
    
    /* Memastikan teks opsi di dalam dropdown tetap kontras saat diklik */
    div[data-baseweb="select"] div {{
        color: var(--text-color) !important;
    }}
    
    /* 4. Kartu Metrik KPI Utama yang Responsif Terhadap Perubahan Tema */
    div[data-testid="metric-container"] {{
        background-color: var(--secondary-background-color) !important;
        padding: 15px;
        border-radius: 8px;
        border-left: 5px solid {ACCENT_ORANGE} !important;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }}
    
    div[data-testid="metric-container"] label {{
        color: var(--text-color) !important;
        opacity: 0.8;
    }}
    div[data-testid="metric-container"] div[data-testid="stMetricValue"] {{
        color: var(--text-color) !important;
        font-weight: bold;
    }}
    
    /* 5. Gaya Navigasi Komponen Tab Menu Utama */
    .stTabs [data-baseweb="tab"] {{
        color: var(--text-color);
        opacity: 0.6;
    }}
    .stTabs [aria-selected="true"] {{
        color: var(--text-color) !important;
        font-weight: bold;
        border-bottom-color: {ACCENT_ORANGE} !important;
    }}
    </style>
""", unsafe_allow_html=True)

# ==============================================================================
# FASE 1: CACHING & PEMUATAN DATA/METADATA (FIXED ZIP HANDLING)
# ==============================================================================
@st.cache_data
def load_dataset():
    """Memuat dataset bersih dari kompresi ZIP menggunakan zipfile extractor"""
    file_zip_name = 'diagnoku_biner_v5.zip'
    file_csv_name = 'diagnoku_biner_v5.csv'
    
    path_zip = os.path.join(BASE_DIR, file_zip_name)
    path_csv = os.path.join(BASE_DIR, file_csv_name)

    # 1. Prioritas Utama: Membaca file terkompresi ZIP (Solusi limitasi 100MB GitHub)
    if os.path.exists(path_zip):
        try:
            with zipfile.ZipFile(path_zip, 'r') as z:
                # Cari berkas berformat .csv yang terbungkus di dalam ZIP
                csv_files = [f for f in z.namelist() if f.endswith('.csv')]
                if not csv_files:
                    st.error("Gagal mendeteksi file berformat .csv di dalam paket ZIP!")
                    return None
                
                # Ekstrak aliran data csv pertama secara aman ke memori
                with z.open(csv_files[0]) as f:
                    df = pd.read_csv(f)
                    
            # Optimasi Tipe Data (Downcasting) untuk menghemat RAM instansia Cloud
            cols_biner = df.columns.drop('diseases')
            df[cols_biner] = df[cols_biner].apply(pd.to_numeric, downcast='integer')
            return df
        except Exception as e:
            st.error(f"Terjadi kesalahan saat memproses ekstraksi file ZIP: {e}")
            return None

    # 2. Fallback Cadangan: Membaca file CSV mentah jika masih tersimpan di lokal
    elif os.path.exists(path_csv):
        try:
            df = pd.read_csv(path_csv)
            cols_biner = df.columns.drop('diseases')
            df[cols_biner] = df[cols_biner].apply(pd.to_numeric, downcast='integer')
            return df
        except Exception as e:
            st.error(f"Gagal membaca berkas CSV mentah: {e}")
            return None
    else:
        st.error(f"Gagal menemukan berkas '{file_zip_name}' maupun '{file_csv_name}' di direktori: {BASE_DIR}")
        return None

@st.cache_data
def load_metadata_json(file_path):
    """Memuat berkas kamus metadata JSON secara aman dengan encoding UTF-8"""
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            st.error(f"Error saat membaca metadata JSON pada {file_path}: {e}")
            return {}
    else:
        st.warning(f"Berkas metadata '{os.path.basename(file_path)}' tidak terdeteksi. Sistem menggunakan label default asli.")
        return {}

# Menjalankan pemuatan komponen data ke dalam cache server
df_clean = load_dataset()
kamus_gejala = load_metadata_json(gejala_json_path)
kamus_penyakit = load_metadata_json(penyakit_json_path)

if df_clean is not None:
    gejala_cols = df_clean.columns.drop('diseases')

# ==============================================================================
# FASE 2: SIDEBAR & NAVIGASI HALAMAN
# ==============================================================================
if os.path.exists(logo_path):
    st.sidebar.image(logo_path, use_container_width=True)
else:
    st.sidebar.image("https://img.icons8.com/fluent/96/000000/stethoscope.png", width=80)
    st.sidebar.caption("Menggunakan fallback logo ikon medis (Logo lokal tidak ditemukan).")

st.sidebar.markdown("<h2 style='text-align:center; margin-top:0;'>Analytics Dashboard</h2>", unsafe_allow_html=True)
st.sidebar.markdown("Tim Data Scientist: **CC26-PSU200**")
st.sidebar.markdown("---")

menu = st.sidebar.selectbox(
    "Pilih Menu Navigasi:",
    ["Ringkasan Eksekutif", "Analisis Distribusi Penyakit", "Analisis Karakteristik Gejala", "Eksplorasi Pola Klinis"]
)

st.sidebar.markdown("---")
st.sidebar.info(
    "Dashboard ini menyajikan wawasan interaktif hasil dari proses pembersihan data "
    "ketat (Filter Kasus ≥50, Densitas Keluhan ≥3 Gejala, dan Penghapusan Duplikasi)."
)

# Jika dataset gagal dimuat total, kunci operasi visualisasi di bawahnya
if df_clean is None:
    st.stop()

# ==============================================================================
# MENU 1: RINGKASAN EKSEKUTIF
# ==============================================================================
if menu == "Ringkasan Eksekutif":
    st.title("Ringkasan Eksekutif & Integritas Data")
    st.markdown("### Gambaran Umum Keandalan Informasi Dataset DiagnoKu")
    
    total_baris = len(df_clean)
    total_penyakit = df_clean['diseases'].nunique()
    total_gejala = len(gejala_cols)
    avg_gejala = df_clean[gejala_cols].sum(axis=1).mean()

    col1, col2, col3, col4 = st.columns(4)
    col1.metric(label="Total Sampel Rekam Medis", value=f"{total_baris:,}")
    col2.metric(label="Variasi Kelas Penyakit", value=f"{total_penyakit} Kelas")
    col3.metric(label="Dimensi Fitur Gejala", value=f"{total_gejala} Kolom")
    col4.metric(label="Rata-rata Gejala / Pasien", value=f"{avg_gejala:.2f} Gejala")

    st.markdown("---")
    
    st.markdown("### Kronologi Penyusutan Noise Data (*Data Lineage Summary*)")
    summary_data = {
        "Tahap Pemrosesan Data": [
            "1. Dataset Mentah Awal (Raw)", 
            "2. Eliminasi Duplikasi Identik", 
            "3. Pemangkasan 360 Penyakit Langka (<50 Kasus)", 
            "4. Penyelamatan Fragmentasi Baris (OR Logic)", 
            "5. Dataset Bersih Final (Siap Model)"
        ],
        "Jumlah Baris Tersisa": ["246,945", "189,647", "184,454", "184,454", f"{total_baris:,}"],
        "Variasi Penyakit Unik": ["773 Kelas", "773 Kelas", "413 Kelas", "413 Kelas", f"{total_penyakit} Kelas"],
        "Status Validasi Kualitas": ["Kotor / Redundan", "Bocor Informasi", "Highly Imbalanced", "Sparsity Tinggi", "100% VALID (Nol Duplikat)"]
    }
    st.table(pd.DataFrame(summary_data))
    
    st.info(f"**Kesimpulan Bisnis:** Kami berhasil mereduksi **26,9% noise data** dari dataset awal tanpa mengorbankan variasi penyakit utama. Batas bawah informasi rekam medis pasien kini telah terkunci aman pada standar klinis minimal 3 gejala per baris.")

# ==============================================================================
# MENU 2: ANALISIS DISTRIBUSI PENYAKIT
# ==============================================================================
elif menu == "Analisis Distribusi Penyakit":
    st.title("Analisis Distribusi Kelas Penyakit Target")
    st.markdown("### Eksplorasi Varians Frekuensi Kasus Medis")

    top_n = st.slider("Atur Batas Tampilan Penyakit Teratas (Top N):", min_value=5, max_value=30, value=15)
    disease_counts = df_clean['diseases'].value_counts()
    
    disease_counts_indo = pd.Series(
        disease_counts.values,
        index=[kamus_penyakit.get(x, x).title() for x in disease_counts.index]
    )
    top_n_data = disease_counts_indo.head(top_n)

    plt.close('all')
    fig, ax = plt.subplots(figsize=(10, top_n * 0.4))
    
    sns.barplot(x=top_n_data.values, y=top_n_data.index, color=NAVY_LIGHT, ax=ax)
    
    ax.set_xlabel("Jumlah Kasus Rekam Medis")
    ax.set_ylabel("Nama Penyakit (Terjemahan Bahasa Indonesia)")
    ax.set_title(f"Top {top_n} Distribusi Frekuensi Penyakit Setelah Pembersihan", weight='bold')
    ax.grid(True, linestyle='--', alpha=0.3)
    
    for i, nilai in enumerate(top_n_data.values):
        ax.text(nilai + (nilai * 0.01), i, f'{nilai:,}', va='center', ha='left', fontsize=9, weight='bold')

    st.pyplot(fig, clear_figure=True)

    st.markdown("#### Wawasan Statistik Sentral Penyakit:")
    c1, c2, c3 = st.columns(3)
    c1.warning(f"**Nilai Tengah (Median):** {disease_counts.median():.0f} kasus per penyakit.")
    c2.warning(f"**Rata-rata (Mean):** {disease_counts.mean():.1f} kasus per penyakit.")
    c3.warning(f"**Batas Kasus Minimum:** {disease_counts.min()} kasus (*Epilepsi*).")
    
    st.markdown(
        "> **Alasan Teknis Pembersihan:** Sebaran kelas kini jauh lebih rapat dan stabil. "
        "Memastikan setiap kelas penyakit target memiliki landasan minimal 46-50 kasus menghindarkan "
        "algoritma klasifikasi dari fenomena *underfitting* parah serta bias mayoritas yang menurunkan nilai *Recall*."
    )

# ==============================================================================
# MENU 3: ANALISIS KARAKTERISTIK GEJALA
# ==============================================================================
elif menu == "Analisis Karakteristik Gejala":
    st.title("Analisis Karakteristik Fitur Gejala Medis")
    st.markdown("### Identifikasi Indikator Gejala Paling Dominan dalam Ekosistem Data")

    symptom_sum = df_clean[gejala_cols].sum().sort_values(ascending=False)
    symptom_sum_indo = pd.Series(
        symptom_sum.values,
        index=[kamus_gejala.get(x, [x])[0].title() for x in symptom_sum.index]
    )

    tab1, tab2 = st.tabs(["Top 20 Gejala Terbanyak", "Word Cloud Kepadatan Gejala"])

    with tab1:
        plt.close('all')
        top20_gejala = symptom_sum_indo.head(20)
        fig2, ax2 = plt.subplots(figsize=(10, 7))
        
        sns.barplot(x=top20_gejala.values, y=top20_gejala.index, color=NAVY_LIGHT, ax=ax2)
        ax2.set_xlabel("Frekuensi Kemunculan di Seluruh Sampel")
        ax2.set_title("Top 20 Gejala Medis yang Paling Sering Dikeluhkan", weight='bold')
        ax2.grid(True, linestyle='--', alpha=0.3)
        
        st.pyplot(fig2, clear_figure=True)
        
    with tab2:
        word_freq = symptom_sum_indo.to_dict()
        
        try:
            is_dark_embed = st.get_option("theme.base") == "dark"
        except Exception:
            is_dark_embed = False
            
        bg_wordcloud = "#0e1117" if is_dark_embed else "#ffffff"
        cmap_wordcloud = "YlOrRd" if is_dark_embed else "YlOrBr"
        
        wordcloud = WordCloud(width=900, height=450, background_color=bg_wordcloud, 
                              colormap=cmap_wordcloud).generate_from_frequencies(word_freq)
        
        fig3, ax3 = plt.subplots(figsize=(12, 6))
        ax3.imshow(wordcloud, interpolation='bilinear')
        ax3.axis('off')
        st.pyplot(fig3, clear_figure=True)

    st.markdown("---")
    st.markdown("#### Kesimpulan Karakteristik Fitur:")
    st.write(
        f"Gejala klinis **{symptom_sum_indo.index[0]}** (*{symptom_sum.index[0]}*) menduduki peringkat pertama "
        f"dengan kemunculan sebanyak **{symptom_sum.iloc[0]:,} kali** di seluruh dataset. Gejala-gejala di peringkat teratas ini "
        f"bersifat sebagai *Common Medical Denominators* (gejala generik pembentuk rumpun penyakit) yang membutuhkan kombinasi "
        f"gejala sekunder spesifik agar algoritma Machine Learning mampu menegakkan diferensiasi diagnosis secara akurat."
    )

# ==============================================================================
# MENU 4: EKSPLORASI POLA KLINIS
# ==============================================================================
elif menu == "Eksplorasi Pola Klinis":
    st.title("Eksplorasi Pola Klinis Pasien per Penyakit")
    st.markdown("### Inspeksi Profil Gejala Spesifik Secara Interaktif")

    penyakit_pilihan = st.selectbox(
        "Pilih Jenis Penyakit yang Ingin Diinspeksi Polanya:",
        options=sorted(df_clean['diseases'].unique())
    )

    df_filtered = df_clean[df_clean['diseases'] == penyakit_pilihan]
    symptom_disease = df_filtered[gejala_cols].sum().sort_values(ascending=False)
    symptom_disease_active = symptom_disease[symptom_disease > 0]

    symptom_disease_indo = pd.DataFrame({
        "Nama Fitur Asli (EN)": symptom_disease_active.index,
        "Padanan Bahasa Indonesia": [kamus_gejala.get(x, [x])[0] for x in symptom_disease_active.index],
        "Total Kemunculan Kasus": symptom_disease_active.values,
        "Persentase Kemunculan (%)": (symptom_disease_active.values / len(df_filtered)) * 100
    })

    nama_penyakit_indo = kamus_penyakit.get(penyakit_pilihan, penyakit_pilihan).upper()
    st.info(f"🧬 **Profil Diagnosis:** Penyakit **{penyakit_pilihan.title()}** dirujuk sebagai **{nama_penyakit_indo}** dalam Bahasa Indonesia. Memiliki total **{len(df_filtered)} sampel rekam medis** di dalam database bersih.")

    st.markdown("#### Gejala yang Membentuk Diagnosis Penyakit Ini:")
    st.dataframe(symptom_disease_indo.reset_index(drop=True), use_container_width=True)

    st.markdown(
        "> **Alasan Teknis:** Skema bobot persentase kemunculan gejala inilah yang nantinya "
        "dipelajari dan dikalkulasikan secara matematis oleh fungsi probabilitas Naive Bayes "
        "maupun penentuan pemisahan *node* pohon keputusan (*Decision Tree Split Criterion*) "
        "untuk membedakan satu penyakit dari penyakit lainnya saat masa *inference* di backend aplikasi produksi."
    )