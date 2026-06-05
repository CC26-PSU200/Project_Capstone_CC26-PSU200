import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <div className="bg-white/85 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-8">
          <div className="navbar-box flex items-center justify-between py-4">
            <div className="logo">
              <h1 className="text-2xl font-black tracking-tight">
                Diagno<span className="text-[#FCA311]">Ku</span>
              </h1>
            </div>
            <div className="menu flex gap-2">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/konsultasi">Konsultasi</NavLink>
              <NavLink to="/artikel">Artikel</NavLink>
              <NavLink to="/tentang">Tentang</NavLink>
              <NavLink to="/faq">FAQ</NavLink>
              <NavLink to="/kontak">Kontak</NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
