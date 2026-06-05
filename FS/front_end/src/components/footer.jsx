import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#4a4a4a] text-white mt-auto pt-16 pb-8 border-t border-[#3a3a3a]">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        {/* Bagian Atas: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Kolom 1: Logo, Deskripsi, dan Sosial Media */}
          <div className="md:col-span-6 lg:col-span-5">
            <div className="logo mb-4">
              <h1 className="text-3xl font-black tracking-tight">
                Diagno<span className="text-[#FCA311]">Ku</span>
              </h1>
            </div>
            <p className="text-white text-[14.5px] leading-[1.7] mb-6 font-medium pr-4">
              Platform konsultasi kesehatan berbasis AI untuk membantu kamu
              mengenali gejala dan mendapatkan informasi awal tentang kondisi
              kesehatanmu.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              {/* GitHub */}
              <a
                href="https://github.com/CC26-PSU200/Project_Capstone_CC26-PSU200.git"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-white text-white hover:border-white hover:text-white hover:-translate-y-1 transition-all duration-300"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 496 512"
                  height="1.2em"
                  width="1.2em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                </svg>
              </a>

              {/* Google Drive */}
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-white text-white hover:border-white hover:text-white hover:-translate-y-1 transition-all duration-300"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  height="1.2em"
                  width="1.2em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M339 314.9L175.4 32h161.2l163.6 282.9H339zm-137.5 23.6L120.9 480h310.5L512 338.5H201.5zM154.1 67.4L0 338.5 80.6 480 237 208.8 154.1 67.4z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Kolom 2: Navigasi */}
          <div className="md:col-span-3 lg:col-span-3 md:pl-8">
            <h3 className="text-white text-[13px] font-bold tracking-[2px] mb-5 uppercase">
              Navigasi
            </h3>
            <ul className="flex flex-col gap-3.5">
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-white text-[15px] font-medium transition-colors duration-200"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/konsultasi"
                  className="text-gray-200 hover:text-[#FCA311] text-[15px] font-medium transition-colors duration-200"
                >
                  Konsultasi
                </Link>
              </li>
              <li>
                <Link
                  to="/artikel"
                  className="text-gray-200 hover:text-[#FCA311] text-[15px] font-medium transition-colors duration-200"
                >
                  Artikel
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Lebih Banyak */}
          <div className="md:col-span-3 lg:col-span-3 md:pl-4 md:mt-9">
            <ul className="flex flex-col gap-3.5">
              <li>
                <Link
                  to="/tentang"
                  className="text-gray-200 hover:text-[#FCA311] text-[15px] font-medium transition-colors duration-200"
                >
                  Tentang
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-200 hover:text-[#FCA311] text-[15px] font-medium transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/kontak"
                  className="text-gray-200 hover:text-[#FCA311] text-[15px] font-medium transition-colors duration-200"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bagian Bawah: Copyright */}
        <div className="border-t border-[#FFFFFF] pt-6 mt-4 flex flex-col items-center justify-center text-center">
          <p className="text-white text-sm font-medium mb-1.5">
            © 2026 DiagnoKu Capstone Project · CC26-PSU200
          </p>
          <p className="text-white text-sm font-medium flex items-center justify-center gap-2">
            <span className="text-white text-lg leading-none">•</span> Coding
            Camp 2026 powered by DBS Foundation · All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
