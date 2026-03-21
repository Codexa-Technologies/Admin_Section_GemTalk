import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addAnswer, createQuestion, deleteQuestion, getQuestions } from "../services/questionApi";

export default function FAQ() {
  const [modalOpen, setModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [answerText, setAnswerText] = useState({});
  const [answerError, setAnswerError] = useState("");

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

  useEffect(() => {
    const readAuth = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("userToken")));
    };

    readAuth();
    window.addEventListener("auth-change", readAuth);
    window.addEventListener("storage", readAuth);
    return () => {
      window.removeEventListener("auth-change", readAuth);
      window.removeEventListener("storage", readAuth);
    };
  }, []);

  useEffect(() => {
    const readProfile = () => {
      try {
        const profile = localStorage.getItem("userProfile");
        const parsed = profile ? JSON.parse(profile) : null;
        setCurrentUserId(parsed?.id || null);
      } catch (err) {
        setCurrentUserId(null);
      }
    };

    readProfile();
    window.addEventListener("auth-change", readProfile);
    window.addEventListener("storage", readProfile);
    return () => {
      window.removeEventListener("auth-change", readProfile);
      window.removeEventListener("storage", readProfile);
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

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteQuestion({ id });
      setQuestions((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err?.message || "Failed to delete question");
    }
  };

  const handleAnswerChange = (id, value) => {
    setAnswerText((prev) => ({ ...prev, [id]: value }));
  };

  const handleAnswerSubmit = async (id) => {
    const text = answerText[id];
    if (!text || !text.trim()) return;
    try {
      setAnswerError("");
      const response = await addAnswer({ id, text: text.trim() });
      setQuestions((prev) => prev.map((item) => (item._id === id ? response.data : item)));
      setAnswerText((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      setAnswerError(err?.message || "Failed to add answer");
    }
  };

  const getLatestAnswer = (answers = []) => {
    if (!Array.isArray(answers) || answers.length === 0) return null;
    return answers[answers.length - 1];
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Q & A <span className="text-[#1e95b5]">Section</span>
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/faq"
              className="rounded-md border border-[#1e95b5] px-6 py-3 text-sm font-semibold text-[#1e95b5] transition-colors hover:bg-[#1e95b5] hover:text-white"
            >
              View All
            </Link>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-[#1e95b5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#167d97]"
            >
              <span className="text-lg leading-none">+</span>
              Add Question
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <p className="text-sm font-semibold text-slate-500">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <p className="text-sm font-semibold text-slate-500">No questions</p>
            <p className="mt-2 text-sm text-slate-400">Add your first question</p>
          </div>
        ) : (
          <div className="mt-10">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {questions.slice(0, 4).map((item) => (
                <div
                  key={item._id || item.question}
                  className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
                >
                  <p className="text-sm font-semibold text-gray-900">{item.question}</p>
                  {item.askedBy?.name && (
                    <p className="mt-2 text-xs text-slate-400">Asked by {item.askedBy.name}</p>
                  )}
                  {getLatestAnswer(item.answers) ? (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-gray-700">
                        {getLatestAnswer(item.answers).text}
                      </p>
                      {getLatestAnswer(item.answers).answeredBy?.name && (
                        <p className="mt-2 text-xs text-slate-400">
                          Answered by {getLatestAnswer(item.answers).answeredBy.name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                      <p className="text-sm text-slate-400">No answers yet</p>
                    </div>
                  )}
                  {isLoggedIn ? (
                    <div className="mt-4">
                      <label className="text-sm font-semibold text-gray-700">Your answer</label>
                      <textarea
                        rows={3}
                        value={answerText[item._id] || ""}
                        onChange={(event) => handleAnswerChange(item._id, event.target.value)}
                        placeholder="Write your answer"
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1e95b5] focus:ring-2 focus:ring-[#1e95b5]/20"
                      />
                      {answerError && (
                        <p className="mt-2 text-sm text-red-500">{answerError}</p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <Link
                          to="/faq"
                          className="inline-flex items-center justify-center rounded-xl border border-[#1e95b5] px-4 py-2 text-sm font-semibold text-[#1e95b5] transition-colors hover:bg-[#1e95b5] hover:text-white"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleAnswerSubmit(item._id)}
                          className="rounded-xl bg-[#1e95b5] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#167d97]"
                        >
                          Submit Answer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-400">
                      Log in to answer this question.
                    </p>
                  )}
                  {currentUserId && item.askedBy?._id === currentUserId && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      className="absolute right-4 top-4 rounded-full border border-red-200 p-1 text-red-500 transition-colors hover:bg-red-50"
                      aria-label="Delete question"
                      title="Delete"
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
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
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
