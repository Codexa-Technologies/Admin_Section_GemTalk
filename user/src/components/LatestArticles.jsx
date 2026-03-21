import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicArticles } from "../services/publicApi";
import placeholderImage from "../assets/HeroSection1.webp";

function ArticleCard({ item }) {
  return (
    <Link
      to={item.id ? `/articles/${item.id}` : "/articles"}
      className="group relative block overflow-hidden rounded-3xl bg-white shadow-lg transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="h-48 w-full">
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
        <span className="absolute bottom-5 right-5 text-sm font-semibold text-[#1e95b5]">
          Read
        </span>
      </div>
    </Link>
  );
}

export default function LatestArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadArticles = async () => {
      try {
        const response = await getPublicArticles({ limit: 4, type: "article" });
        if (!isMounted) return;
        setArticles(response.articles || []);
        setError("");
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load articles");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadArticles();
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

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Latest <span className="text-[#1e95b5]">Articles</span>
          </h2>
          <Link
            to="/articles"
            className="self-start rounded-md border border-[#1e95b5] px-6 py-3 text-sm font-semibold text-[#1e95b5] transition-colors hover:bg-[#1e95b5] hover:text-white md:self-auto"
          >
            See More
          </Link>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-slate-500">Loading articles...</p>
        ) : error ? (
          <p className="mt-10 text-sm text-red-500">{error}</p>
        ) : articles.length === 0 ? (
          <p className="mt-10 text-sm text-slate-500">No articles found.</p>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {articles.map((item) => (
              <ArticleCard
                key={item._id || item.title}
                item={{
                  ...item,
                  id: item._id,
                  image: item.image || placeholderImage,
                  date: formatDate(item.publishedDate || item.createdAt),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
