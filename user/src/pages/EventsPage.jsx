import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { getPublicArticles } from "../services/publicApi";
import placeholderImage from "../assets/HeroSection1.webp";

function EventCard({ item }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition-transform duration-200 hover:-translate-y-1">
      <div className="h-52 w-full">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold text-[#1e95b5]">{item.date}</p>
        <h3 className="mt-2 text-lg font-bold text-gray-900">{item.title}</h3>
        {item.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-1">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const PAGE_SIZE = 9;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalCount: 0 });

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await getPublicArticles({ type: "event", page, limit: PAGE_SIZE });
        if (!isMounted) return;
        setEvents(response.articles || []);
        setPagination(response.pagination || { totalPages: 1, totalCount: 0 });
        setError("");
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load events");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadEvents();
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

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1e95b5]">
              Events
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Upcoming Events
            </h2>
          </div>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-slate-500">Loading events...</p>
        ) : error ? (
          <p className="mt-10 text-sm text-red-500">{error}</p>
        ) : events.length === 0 ? (
          <p className="mt-10 text-sm text-slate-500">No events found.</p>
        ) : (
          <>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((item) => (
                <EventCard
                  key={item._id || item.title}
                  item={{
                    ...item,
                    image: item.image || item.images?.[0]?.url || placeholderImage,
                    date: formatDate(item.eventDate || item.publishedDate || item.createdAt),
                  }}
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
    </section>
  );
}
