import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicArticles } from "../services/publicApi";
import placeholderImage from "../assets/HeroSection1.webp";

function ResearchCard({ item }) {
  return (
    <Link
      to="/research"
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

export default function LatestResearch() {
  const [researchItems, setResearchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
