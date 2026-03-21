import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { getPublicArticleById, getPublicArticles } from "../services/publicApi";
import placeholderImage from "../assets/HeroSection1.webp";

function NewsCard({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative w-full overflow-hidden rounded-3xl bg-white text-left shadow-lg transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="h-52 w-full">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold text-[#1e95b5]">{item.date}</p>
        <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-[#1e95b5]">
          {item.title}
        </h3>
        {item.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-1">
            {item.description}
          </p>
        )}
        <span className="absolute bottom-5 right-5 text-sm font-semibold text-[#1e95b5]">
          View
        </span>
      </div>
    </button>
  );
}

export default function NewsPage() {
  const PAGE_SIZE = 9;
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalCount: 0 });
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      try {
        setLoading(true);
        const response = await getPublicArticles({ type: "news", page, limit: PAGE_SIZE });
        if (!isMounted) return;
        setNewsItems(response.articles || []);
        setPagination(response.pagination || { totalPages: 1, totalCount: 0 });
        setError("");
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load news");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadNews();
    return () => {
      isMounted = false;
    };
  }, [page]);

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

  const openNews = async (id) => {
    if (!id) return;
    try {
      setModalLoading(true);
      setModalError("");
      const response = await getPublicArticleById(id, "news");
      setSelectedNews(response.data || null);
    } catch (err) {
      setModalError(err?.message || "Failed to load news");
      setSelectedNews(null);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedNews(null);
    setModalError("");
    setModalLoading(false);
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1e95b5]">
              News
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Latest Updates
            </h2>
          </div>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-slate-500">Loading news...</p>
        ) : error ? (
          <p className="mt-10 text-sm text-red-500">{error}</p>
        ) : newsItems.length === 0 ? (
          <p className="mt-10 text-sm text-slate-500">No news found.</p>
        ) : (
          <>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {newsItems.map((item) => (
                <NewsCard
                  key={item._id || item.title}
                  item={{
                    ...item,
                    image: item.image || placeholderImage,
                    date: formatDate(item.publishedDate || item.createdAt),
                  }}
                  onOpen={() => openNews(item._id)}
                />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {(selectedNews || modalLoading || modalError) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">News Details</h3>
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
              <div className="px-6 py-8 text-sm text-slate-500">Loading news...</div>
            ) : modalError ? (
              <div className="px-6 py-8 text-sm text-red-500">{modalError}</div>
            ) : selectedNews ? (
              <div className="px-6 py-6">
                <img
                  src={selectedNews.image || placeholderImage}
                  alt={selectedNews.title}
                  className="h-72 w-full rounded-2xl object-cover"
                />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#1e95b5]">
                  {formatDate(selectedNews.publishedDate || selectedNews.createdAt)}
                </p>
                <h4 className="mt-2 text-2xl font-extrabold text-gray-900">
                  {selectedNews.title}
                </h4>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  {selectedNews.description}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
