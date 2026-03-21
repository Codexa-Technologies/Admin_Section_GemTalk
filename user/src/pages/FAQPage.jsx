import { useEffect, useState } from "react";
import { getQuestions } from "../services/questionApi";

export default function FAQPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await getQuestions();
        if (!isMounted) return;
        setQuestions(response.data || []);
        setError("");
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load questions");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1e95b5]">
              Q & A
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Q & A <span className="text-[#1e95b5]">Section</span>
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-20 text-center">
            <p className="text-sm font-semibold text-slate-500">Loading questions...</p>
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-dashed border-red-200 bg-red-50 px-6 py-20 text-center">
            <p className="text-sm font-semibold text-red-500">{error}</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-20 text-center">
            <p className="text-sm font-semibold text-slate-500">No questions</p>
            <p className="mt-2 text-sm text-slate-400">Add your first question</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {questions.map((item) => (
              <div
                key={item._id || item.question}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-gray-900">{item.question}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
