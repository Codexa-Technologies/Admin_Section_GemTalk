import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Articles", to: "/articles" },
  { label: "Research", to: "/research" },
  { label: "News", to: "/news" },
  { label: "Events", to: "/events" },
];

export default function Navbar({ onLoginClick = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const readUser = () => {
      const token = localStorage.getItem("userToken");
      const profile = localStorage.getItem("userProfile");
      if (!token || !profile) {
        setUser(null);
        return;
      }
      try {
        setUser(JSON.parse(profile));
      } catch (error) {
        setUser(null);
      }
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
    <nav className="border-b border-gray-100 bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className="h-16 w-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `text-gray-800 font-semibold transition-colors duration-200 hover:text-[#1e95b5] ${
                    isActive ? "text-[#1e95b5]" : ""
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
              <span className="text-sm font-semibold text-gray-700">
                {user.name || "User"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                title="Logout"
                className="rounded-full border border-[#1e95b5] p-2 text-[#1e95b5] transition-colors duration-200 hover:bg-[#1e95b5] hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
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
              className="rounded-md bg-[#1e95b5] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#167d97] focus:outline-none focus:ring-2 focus:ring-[#1e95b5] focus:ring-opacity-40"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700 hover:text-[#4a9bb5] transition-colors duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`inline-block text-2xl transition-transform duration-300 ${
              menuOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            ☰
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="mt-3 flex flex-col gap-3 px-6 md:hidden">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `block py-2 text-gray-800 font-semibold transition-all duration-200 hover:text-[#1e95b5] ${
                    isActive ? "text-[#4a9bb5] font-semibold" : ""
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li>
            {user ? (
              <div className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-2">
                <span className="text-sm font-semibold text-gray-700">
                  {user.name || "User"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  aria-label="Logout"
                  title="Logout"
                  className="rounded-full border border-[#1e95b5] p-2 text-[#1e95b5] transition-colors duration-200 hover:bg-[#1e95b5] hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onLoginClick?.();
                }}
                className="w-full rounded-md bg-[#1e95b5] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#167d97] focus:outline-none focus:ring-2 focus:ring-[#1e95b5] focus:ring-opacity-40"
              >
                Login
              </button>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
}
