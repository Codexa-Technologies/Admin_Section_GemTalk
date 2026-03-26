import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicArticleById, getPublicArticles, getPublicFileUrl } from "../services/publicApi";
import defaultPaperImage from "../assets/default-paper.svg";

function ResearchCard({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative w-full overflow-hidden rounded-3xl bg-white text-left shadow-lg transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="h-48 w-full relative">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-150 pointer-events-none">
          <span className="opacity-0 group-hover:opacity-100 bg-white text-[#1e95b5] px-4 py-2 rounded-full font-semibold shadow">View</span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold text-[#1e95b5]">{item.date}</p>
        <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-[#1e95b5]">
          {item.title}
        </h3>
        <span className="absolute bottom-5 right-5 text-sm font-semibold text-[#1e95b5]">
          Read
        </span>
      </div>
    </button>
  );
}

export default function LatestResearch() {
  const [researchItems, setResearchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadResearch = async () => {
      try {
        const response = await getPublicArticles({ limit: 4, type: "research" });
        if (!isMounted) return;
        setResearchItems(response.articles || []);
        setError("");
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load research");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadResearch();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const openResearch = async (id) => {
    if (!id) return;
    try {
      setModalLoading(true);
      setModalError("");
      const response = await getPublicArticleById(id, "research");
      setSelectedResearch(response.data || null);
    } catch (err) {
      setModalError(err?.message || "Failed to load research");
      setSelectedResearch(null);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedResearch(null);
    setModalError("");
    setModalLoading(false);
  };

  const handleDownload = async (url, title) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${title || "research"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setModalError(err?.message || "Download failed");
    }
  };

  return (
    <section className="bg-[#074E67] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Latest <span className="text-[#7fd3e6]">Research</span>
          </h2>
          <Link
            to="/research"
            className="self-start rounded-md border border-[#7fd3e6] px-6 py-3 text-sm font-semibold text-[#7fd3e6] transition-colors hover:bg-[#7fd3e6] hover:text-[#074E67] md:self-auto"
          >
            See More
          </Link>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-[#d8eff5]">Loading research...</p>
        ) : error ? (
          <p className="mt-10 text-sm text-[#ffd7d7]">{error}</p>
        ) : researchItems.length === 0 ? (
          <p className="mt-10 text-sm text-[#d8eff5]">No research found.</p>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {researchItems.map((item) => (
              <ResearchCard
                key={item._id || item.title}
                item={{
                  ...item,
                  image: item.image || defaultPaperImage,
                  date: formatDate(item.publishedDate || item.createdAt),
                }}
                onOpen={() => openResearch(item._id)}
              />
            ))}
          </div>
        )}
      </div>

      {(selectedResearch || modalLoading || modalError) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Research Details</h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {modalLoading ? (
              <div className="px-6 py-8 text-sm text-slate-500">Loading research...</div>
            ) : modalError ? (
              <div className="px-6 py-8 text-sm text-red-500">{modalError}</div>
            ) : selectedResearch ? (
              <div className="px-6 py-6">
                <img
                  src={selectedResearch.image || defaultPaperImage}
                  alt={selectedResearch.title}
                  className="h-72 w-full rounded-2xl object-cover"
                />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#1e95b5]">
                  {formatDate(selectedResearch.publishedDate || selectedResearch.createdAt)}
                </p>
                <h4 className="mt-2 text-2xl font-extrabold text-gray-900">
                  {selectedResearch.title}
                </h4>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  {selectedResearch.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  {selectedResearch.pdf && (
                    <a
                      href={getPublicFileUrl(selectedResearch.pdf)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md bg-[#1e95b5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#167d97]"
                    >
                      View PDF
                    </a>
                  )}
                  {selectedResearch.pdf && selectedResearch.downloadAvailable !== false ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(
                          getPublicFileUrl(selectedResearch.pdf),
                          selectedResearch.title
                        )
                      }
                      className="rounded-md border border-[#1e95b5] px-6 py-3 text-sm font-semibold text-[#1e95b5] transition-colors hover:bg-[#1e95b5] hover:text-white"
                    >
                      Download
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
