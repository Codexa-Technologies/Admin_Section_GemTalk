import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { getPublicArticleById, getPublicArticles, getPublicFileUrl } from "../services/publicApi";
import defaultPaperImage from "../assets/default-paper.svg";

function ArticleCard({ item, onOpen }) {
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
        <div className="mt-2 flex items-center justify-between gap-3">
          {item.description && (
            <p className="flex-1 text-sm text-gray-600 line-clamp-2">
              {item.description}
            </p>
          )}
          <span className="shrink-0 text-sm font-semibold text-[#1e95b5]">
            Read
          </span>
        </div>
      </div>
    </button>
  );
}

export default function ArticlesPage() {
  const PAGE_SIZE = 9;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalCount: 0 });
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadArticles = async () => {
      try {
        setLoading(true);
        const response = await getPublicArticles({ page, limit: PAGE_SIZE, search, type: "article" });
        if (!isMounted) return;
        setArticles(response.articles || []);
        setPagination(response.pagination || { totalPages: 1, totalCount: 0 });
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
  }, [page, search]);

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

  const openArticle = async (id) => {
    if (!id) return;
    try {
      setModalLoading(true);
      setModalError("");
      const response = await getPublicArticleById(id, "article");
      setSelectedArticle(response.data || null);
    } catch (err) {
      setModalError(err?.message || "Failed to load article");
      setSelectedArticle(null);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedArticle(null);
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
      link.download = `${title || "article"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setModalError(err?.message || "Download failed");
    }
  };

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1e95b5]">
              Articles
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Explore All Articles
            </h2>
          </div>
          <div className="w-full md:w-72">
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search articles"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#1e95b5] focus:ring-2 focus:ring-[#1e95b5]/20"
            />
          </div>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-slate-500">Loading articles...</p>
        ) : error ? (
          <p className="mt-10 text-sm text-red-500">{error}</p>
        ) : articles.length === 0 ? (
          <p className="mt-10 text-sm text-slate-500">No articles found.</p>
        ) : (
          <>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((item) => (
                <ArticleCard
                  key={item._id || item.title}
                  item={{
                    ...item,
                    id: item._id,
                    image: item.image || defaultPaperImage,
                    date: formatDate(item.publishedDate || item.createdAt),
                  }}
                  onOpen={() => openArticle(item._id)}
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

      {(selectedArticle || modalLoading || modalError) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Article Details</h3>
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
              <div className="px-6 py-8 text-sm text-slate-500">Loading article...</div>
            ) : modalError ? (
              <div className="px-6 py-8 text-sm text-red-500">{modalError}</div>
            ) : selectedArticle ? (
              <div className="px-6 py-6">
                <img
                  src={selectedArticle.image || defaultPaperImage}
                  alt={selectedArticle.title}
                  className="h-72 w-full rounded-2xl object-cover"
                />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#1e95b5]">
                  {formatDate(selectedArticle.publishedDate || selectedArticle.createdAt)}
                </p>
                <h4 className="mt-2 text-2xl font-extrabold text-gray-900">
                  {selectedArticle.title}
                </h4>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  {selectedArticle.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  {selectedArticle.pdf && (
                    <a
                      href={getPublicFileUrl(selectedArticle.pdf)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md bg-[#1e95b5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#167d97]"
                    >
                      View PDF
                    </a>
                  )}
                  {selectedArticle.pdf && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(
                          getPublicFileUrl(selectedArticle.pdf),
                          selectedArticle.title
                        )
                      }
                      className="rounded-md border border-[#1e95b5] px-6 py-3 text-sm font-semibold text-[#1e95b5] transition-colors hover:bg-[#1e95b5] hover:text-white"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
