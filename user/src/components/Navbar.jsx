import { useState } from "react";
import logo from "../assets/logo.png";

const navLinks = ["Home", "Articles", "Research", "News", "Contact"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  return (
    <nav className="border-b border-gray-100 bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className="h-16 w-auto transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Desktop Links */}
        <ul className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link}>
              <a
                href="#"
                className={`text-gray-800 font-semibold transition-colors duration-200 hover:text-[#1e95b5] ${
                  activeLink === link ? "text-[#1e95b5]" : ""
                }`}
                onClick={() => setActiveLink(link)}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Login Button */}
        <div className="hidden md:flex">
          <button className="rounded-md bg-[#1e95b5] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#167d97] focus:outline-none focus:ring-2 focus:ring-[#1e95b5] focus:ring-opacity-40">
            Login
          </button>
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
            <li key={link}>
              <a
                href="#"
                className={`block py-2 text-gray-800 font-semibold transition-all duration-200 hover:text-[#1e95b5] ${
                  activeLink === link ? "text-[#4a9bb5] font-semibold" : ""
                }`}
                onClick={() => {
                  setActiveLink(link);
                  setMenuOpen(false);
                }}
              >
                {link}
              </a>
            </li>
          ))}
          <li>
            <button className="w-full rounded-md bg-[#1e95b5] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#167d97] focus:outline-none focus:ring-2 focus:ring-[#1e95b5] focus:ring-opacity-40">
              Login
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}
