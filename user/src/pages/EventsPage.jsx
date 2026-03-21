import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { getPublicArticleById, getPublicArticles } from "../services/publicApi";
import placeholderImage from "../assets/HeroSection1.webp";

function EventCard({ item, onView }) {
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
        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600 line-clamp-1">
            {item.description || ""}
          </p>
          <button
            type="button"
            onClick={onView}
            className="shrink-0 rounded-xl border border-[#1e95b5] px-4 py-2 text-sm font-semibold text-[#1e95b5] transition-colors hover:bg-[#1e95b5] hover:text-white"
          >
            View
          </button>
        </div>
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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await getPublicArticles({
          type: "event",
          page,
          limit: PAGE_SIZE,
          search,
          dateFrom,
          dateTo,
        });
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
  }, [page, search, dateFrom, dateTo]);

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

  const openEvent = async (id) => {
    if (!id) return;
    try {
      setModalLoading(true);
      setModalError("");
      const response = await getPublicArticleById(id, "event");
      setSelectedEvent(response.data || null);
      setActiveImageIndex(0);
    } catch (err) {
      setModalError(err?.message || "Failed to load event");
      setSelectedEvent(null);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setModalError("");
    setModalLoading(false);
  };

  const goPrevImage = (total) => {
    setActiveImageIndex((prev) => (prev - 1 + total) % total);
  };

  const goNextImage = (total) => {
    setActiveImageIndex((prev) => (prev + 1) % total);
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
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search events"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#1e95b5] focus:ring-2 focus:ring-[#1e95b5]/20 md:w-56"
            />
            <div className="flex w-full items-center gap-2 md:w-auto">
              <input
                type="date"
                value={dateFrom}
                onChange={(event) => {
                  setDateFrom(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-[#1e95b5] focus:ring-2 focus:ring-[#1e95b5]/20"
              />
              <span className="text-sm text-slate-400">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(event) => {
                  setDateTo(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-[#1e95b5] focus:ring-2 focus:ring-[#1e95b5]/20"
              />
            </div>
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
                  onView={() => openEvent(item._id)}
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

      {(selectedEvent || modalLoading || modalError) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
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
              <div className="px-6 py-8 text-sm text-slate-500">Loading event...</div>
            ) : modalError ? (
              <div className="px-6 py-8 text-sm text-red-500">{modalError}</div>
            ) : selectedEvent ? (
              <div className="px-6 py-6">
                {Array.isArray(selectedEvent.images) && selectedEvent.images.length > 1 ? (
                  <div className="relative">
                    <img
                      src={selectedEvent.images[activeImageIndex]?.url}
                      alt={selectedEvent.title}
                      className="h-72 w-full rounded-2xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => goPrevImage(selectedEvent.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow-sm transition hover:bg-white"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => goNextImage(selectedEvent.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow-sm transition hover:bg-white"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                    <div className="mt-4 flex justify-center gap-2">
                      {selectedEvent.images.map((img, index) => (
                        <button
                          key={img.publicId || img.url || index}
                          type="button"
                          onClick={() => setActiveImageIndex(index)}
                          className={`h-2.5 w-2.5 rounded-full transition ${
                            index === activeImageIndex ? "bg-[#1e95b5]" : "bg-slate-300"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <img
                    src={selectedEvent.image || selectedEvent.images?.[0]?.url || placeholderImage}
                    alt={selectedEvent.title}
                    className="h-72 w-full rounded-2xl object-cover"
                  />
                )}
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#1e95b5]">
                  {formatDate(selectedEvent.eventDate || selectedEvent.publishedDate || selectedEvent.createdAt)}
                </p>
                <h4 className="mt-2 text-2xl font-extrabold text-gray-900">
                  {selectedEvent.title}
                </h4>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  {selectedEvent.description}
                </p>
                {selectedEvent.location && (
                  <p className="mt-4 text-sm font-semibold text-slate-500">
                    Location: {selectedEvent.location}
                  </p>
                )}

                {Array.isArray(selectedEvent.images) && selectedEvent.images.length > 1 && (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {selectedEvent.images.map((img) => (
                      <img
                        key={img.publicId || img.url}
                        src={img.url}
                        alt={selectedEvent.title}
                        className="h-40 w-full rounded-xl object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
