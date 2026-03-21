import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicArticles } from "../services/publicApi";
import placeholderImage from "../assets/HeroSection1.webp";

function NewsCard({ item }) {
  return (
    <div className="w-72 shrink-0 overflow-hidden rounded-3xl bg-white shadow-lg">
      <div className="h-32 w-full">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-[#1e95b5]">{item.date}</p>
        <h3 className="mt-2 text-base font-bold text-gray-900">{item.title}</h3>
      </div>
    </div>
  );
}

export default function LatestNews() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  const shouldScroll = displayItems.length >= 5;

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
                  <NewsCard key={`news-${item._id || item.title}`} item={item} />
                ))}
              </div>
              <div className="news-row" aria-hidden="true">
                {displayItems.map((item) => (
                  <NewsCard key={`news-dup-${item._id || item.title}`} item={item} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayItems.map((item) => (
              <NewsCard key={`news-${item._id || item.title}`} item={item} />
            ))}
          </div>
        )}
      </div>
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
