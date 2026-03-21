import { useEffect, useMemo, useState } from "react";
import logo from "../assets/logo.png";
import { loginUser, registerUser } from "../services/authApi";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export default function AuthModal({ isOpen, mode, onClose, onModeChange }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLogin = mode === "login";
  const title = useMemo(() => (isLogin ? "Welcome back" : "Create your account"), [isLogin]);

  useEffect(() => {
    if (!isOpen) return;
    setForm(initialForm);
    setError("");
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password || (!isLogin && !form.name)) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = isLogin
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser({ name: form.name, email: form.email, password: form.password });

      if (response?.token) {
        localStorage.setItem("userToken", response.token);
      }
      if (response?.user) {
        localStorage.setItem("userProfile", JSON.stringify(response.user));
      }
      window.dispatchEvent(new Event("auth-change"));

      onClose();
    } catch (err) {
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="GemTalk" className="h-12 w-auto" />
          </div>
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1e95b5]">
              GemTalk
            </p>
            <h3 className="text-xl font-extrabold text-gray-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 flex rounded-full bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => onModeChange("login")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              isLogin ? "bg-white text-[#1e95b5] shadow" : "text-slate-500"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => onModeChange("signup")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              !isLogin ? "bg-white text-[#1e95b5] shadow" : "text-slate-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="text-sm font-semibold text-gray-700">Full name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1e95b5] focus:ring-2 focus:ring-[#1e95b5]/20"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-gray-700">Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1e95b5] focus:ring-2 focus:ring-[#1e95b5]/20"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1e95b5] focus:ring-2 focus:ring-[#1e95b5]/20"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1e95b5] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#167d97] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => onModeChange(isLogin ? "signup" : "login")}
            className="font-semibold text-[#1e95b5]"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
