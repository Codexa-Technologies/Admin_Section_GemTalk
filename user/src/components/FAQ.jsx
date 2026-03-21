import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createQuestion, getQuestions } from "../services/questionApi";

export default function FAQ() {
  const [modalOpen, setModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
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

  const closeModal = () => {
    setModalOpen(false);
    setQuestionText("");
  };

  const handleSubmit = async () => {
    if (!questionText.trim()) return;
    try {
      setError("");
      const response = await createQuestion({ question: questionText.trim() });
      setQuestions((prev) => [response.data, ...prev]);
      closeModal();
    } catch (err) {
      setError(err?.message || "Failed to add question");
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Q & A <span className="text-[#1e95b5]">Section</span>
          </h2>
          <Link
            to="/faq"
            className="self-start rounded-md border border-[#1e95b5] px-6 py-3 text-sm font-semibold text-[#1e95b5] transition-colors hover:bg-[#1e95b5] hover:text-white md:self-auto"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <p className="text-sm font-semibold text-slate-500">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <p className="text-sm font-semibold text-slate-500">No questions</p>
            <p className="mt-2 text-sm text-slate-400">Add your first question</p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1e95b5] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#167d97]"
            >
              <span className="text-lg leading-none">+</span>
              Add Question
            </button>
          </div>
        ) : (
          <div className="mt-10">
            <div className="grid gap-4 md:grid-cols-3">
              {questions.slice(0, 6).map((item) => (
                <div
                  key={item._id || item.question}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-gray-900">{item.question}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#1e95b5] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#167d97]"
              >
                <span className="text-lg leading-none">+</span>
                Add Question
              </button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add Question</h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700">Your question</label>
              <textarea
                rows={4}
                value={questionText}
                onChange={(event) => setQuestionText(event.target.value)}
                placeholder="Type your question"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1e95b5] focus:ring-2 focus:ring-[#1e95b5]/20"
              />
            </div>

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-6 w-full rounded-xl bg-[#1e95b5] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#167d97]"
            >
              Submit Question
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
