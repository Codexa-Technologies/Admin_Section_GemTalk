import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublicArticleById, getPublicFileUrl } from "../services/publicApi";
import placeholderImage from "../assets/HeroSection1.webp";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadArticle = async () => {
      try {
        setLoading(true);
        const response = await getPublicArticleById(id, "article");
        if (!isMounted) return;
        setArticle(response.data || null);
        setError("");
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load article");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      loadArticle();
    } else {
      setLoading(false);
      setError("Invalid article");
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

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

  if (loading) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-sm text-slate-500">Loading article...</p>
        </div>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-sm text-red-500">{error || "Article not found."}</p>
          <Link to="/articles" className="mt-4 inline-block text-sm font-semibold text-[#1e95b5]">
            Back to Articles
          </Link>
        </div>
      </section>
    );
  }

  const imageUrl = article.image || placeholderImage;
  const publishedDate = formatDate(article.publishedDate || article.createdAt);
  const pdfUrl = article.pdf ? getPublicFileUrl(article.pdf) : "";

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Link to="/articles" className="text-sm font-semibold text-[#1e95b5]">
          Back to Articles
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-lg">
          <img src={imageUrl} alt={article.title} className="h-80 w-full object-cover" />
          <div className="p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1e95b5]">
              {publishedDate}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-5 text-base leading-7 text-gray-600">
              {article.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {pdfUrl && (
                <button
                  type="button"
                  onClick={() => window.open(pdfUrl, '_blank', 'noopener')}
                  className="rounded-md bg-[#1e95b5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#167d97]"
                >
                  View PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
