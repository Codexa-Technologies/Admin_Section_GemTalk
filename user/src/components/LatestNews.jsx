import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicArticles, getPublicArticleById } from "../services/publicApi";
import placeholderImage from "../assets/HeroSection1.webp";

function NewsCard({ item, onView }) {
  return (
    <button
      type="button"
      onClick={onView}
      className="group relative w-72 shrink-0 overflow-hidden rounded-3xl bg-white shadow-lg transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="h-32 w-full relative">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-150 pointer-events-none">
          <span className="opacity-0 group-hover:opacity-100 bg-white text-[#1e95b5] px-4 py-2 rounded-full font-semibold shadow">View</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-[#1e95b5]">{item.date}</p>
        <h3 className="mt-2 text-base font-bold text-gray-900">{item.title}</h3>
      </div>
    </button>
  );
}

export default function LatestNews() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      try {
        const response = await getPublicArticles({ limit: 8, type: "news" });
        if (!isMounted) return;
        setNewsItems(response.articles || []);
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

  const displayItems = newsItems.map((item) => ({
    ...item,
    image: item.image || placeholderImage,
    date: formatDate(item.publishedDate || item.createdAt),
  }));
  const shouldScroll = displayItems.length >= 4;

  const openNews = async (id) => {
    if (!id) return;
    try {
      setModalLoading(true);
      setModalError("");
      setIsDescriptionExpanded(false);
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
    setIsDescriptionExpanded(false);
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Latest <span className="text-[#1e95b5]">News</span>
          </h2>
          <Link
            to="/news"
            className="self-start rounded-md border border-[#1e95b5] px-6 py-3 text-sm font-semibold text-[#1e95b5] transition-colors hover:bg-[#1e95b5] hover:text-white md:self-auto"
          >
            See More
          </Link>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-slate-500">Loading news...</p>
        ) : error ? (
          <p className="mt-10 text-sm text-red-500">{error}</p>
        ) : displayItems.length === 0 ? (
          <p className="mt-10 text-sm text-slate-500">No news found.</p>
        ) : shouldScroll ? (
          <div className="mt-10 overflow-hidden pb-4">
            <div className="news-track">
              <div className="news-row">
                {displayItems.map((item) => (
                  <NewsCard
                    key={`news-${item._id || item.title}`}
                    item={item}
                    onView={() => openNews(item._id)}
                  />
                ))}
              </div>
              <div className="news-row" aria-hidden="true">
                {displayItems.map((item) => (
                  <NewsCard
                    key={`news-dup-${item._id || item.title}`}
                    item={item}
                    onView={() => openNews(item._id)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {displayItems.map((item) => (
              <NewsCard
                key={`news-${item._id || item.title}`}
                item={item}
                onView={() => openNews(item._id)}
              />
            ))}
          </div>
        )}
      </div>
      {(selectedNews || modalLoading || modalError) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-3xl bg-white shadow-xl flex flex-col">
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
            <div className="flex-1 overflow-y-auto">
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
                  <p
                    className={`mt-4 text-base leading-7 text-gray-600 whitespace-pre-line ${
                      isDescriptionExpanded ? "" : "line-clamp-5"
                    }`}
                  >
                    {selectedNews.description}
                  </p>
                  {selectedNews.description && selectedNews.description.length > 400 && (
                    <button
                      type="button"
                      onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                      className="mt-2 text-sm font-semibold text-[#1e95b5] hover:underline"
                    >
                      {isDescriptionExpanded ? "See less" : "See more"}
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {shouldScroll && (
        <style>{`
          @keyframes news-scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .news-track {
            display: flex;
            width: max-content;
            animation: news-scroll 30s linear infinite;
            will-change: transform;
          }
          .news-row {
            display: flex;
            gap: 1.5rem;
            padding-right: 1.5rem;
          }
        `}</style>
      )}
    </section>
  );
}
