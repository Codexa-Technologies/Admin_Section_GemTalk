import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicArticleById, getPublicArticles } from "../services/publicApi";
import placeholderImage from "../assets/HeroSection1.webp";

function EventCard({ item, onView }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition-transform duration-200 hover:-translate-y-1">
      <div className="h-48 w-full">
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
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
            <button
              type="button"
              onClick={onView}
              className="shrink-0 rounded-xl border border-[#1e95b5] px-4 py-2 text-sm font-semibold text-[#1e95b5] transition-colors hover:bg-[#1e95b5] hover:text-white"
            >
              View
            </button>
          </div>
        )}
        {!item.description && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onView}
              className="inline-flex items-center justify-center rounded-xl border border-[#1e95b5] px-4 py-2 text-sm font-semibold text-[#1e95b5] transition-colors hover:bg-[#1e95b5] hover:text-white"
            >
              View
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LatestEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const response = await getPublicArticles({ limit: 4, type: "event" });
        if (!isMounted) return;
        setEvents(response.articles || []);
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
    <section className="bg-[#074E67] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Latest <span className="text-[#7fd3e6]">Events</span>
          </h2>
          <Link
            to="/events"
            className="self-start rounded-md border border-[#7fd3e6] px-6 py-3 text-sm font-semibold text-[#7fd3e6] transition-colors hover:bg-[#7fd3e6] hover:text-[#074E67] md:self-auto"
          >
            See More
          </Link>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-[#d8eff5]">Loading events...</p>
        ) : error ? (
          <p className="mt-10 text-sm text-[#ffd7d7]">{error}</p>
        ) : events.length === 0 ? (
          <p className="mt-10 text-sm text-[#d8eff5]">No events found.</p>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-4">
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
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
