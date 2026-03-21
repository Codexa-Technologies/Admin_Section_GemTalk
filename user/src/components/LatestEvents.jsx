import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicArticles } from "../services/publicApi";
import placeholderImage from "../assets/HeroSection1.webp";

function EventCard({ item }) {
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
        <Link
          to="/events"
          className="mt-4 inline-block text-sm font-semibold text-[#1e95b5] transition-colors hover:text-[#167d97]"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

export default function LatestEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
