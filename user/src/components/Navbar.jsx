import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo3.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Articles", to: "/articles" },
  { label: "Research", to: "/research" },
  { label: "News", to: "/news" },
  { label: "Events", to: "/events" },
  { label: "Q&A", to: "/faq" },
];

export default function Navbar({ onLoginClick = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const readUser = () => {
      const token = localStorage.getItem("userToken");
      const profile = localStorage.getItem("userProfile");
      if (!token || !profile) { setUser(null); return; }
      try { setUser(JSON.parse(profile)); } catch { setUser(null); }
    };
    readUser();
    window.addEventListener("auth-change", readUser);
    window.addEventListener("storage", readUser);
    return () => {
      window.removeEventListener("auth-change", readUser);
      window.removeEventListener("storage", readUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userProfile");
    setUser(null);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100"
        : "bg-white shadow-sm border-b border-gray-100"
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="GemTalk"
            className="h-10 w-auto transition-transform duration-300 hover:scale-110"
          />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1 rounded-full bg-gray-50 border border-gray-200 px-2 py-1.5">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#074E67] to-[#05878A] text-white shadow-sm"
                      : "text-gray-600 hover:text-[#05878A] hover:bg-[#05878A]/8"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
                {user.name || "User"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                title="Logout"
                className="rounded-full border border-gray-200 p-2 text-gray-500 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onLoginClick}
              className="rounded-full bg-gradient-to-r from-[#074E67] to-[#05878A] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-[#074E67] to-[#05878A] text-white"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#05878A]"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-gray-100 pt-3">
            {user ? (
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5">
                <span className="text-sm font-semibold text-gray-700">{user.name || "User"}</span>
                <button
                  type="button"
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="rounded-full border border-gray-200 p-2 text-gray-500 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onLoginClick?.(); }}
                className="w-full rounded-xl bg-gradient-to-r from-[#074E67] to-[#05878A] px-5 py-2.5 text-sm font-bold text-white shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}