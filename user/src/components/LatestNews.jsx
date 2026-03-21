import newsOne from "../assets/HeroSection1.webp";
import newsTwo from "../assets/HeroSection2.jpg";
import newsThree from "../assets/HeroSection3.jpg";
import newsFour from "../assets/helpcenter.webp";
import newsFive from "../assets/helpCenter2.webp";

const newsItems = [
  {
    title: "Gem Expo 2026 Highlights",
    date: "21 Mar 2026",
    image: newsOne,
  },
  {
    title: "New Research Grants Announced",
    date: "18 Mar 2026",
    image: newsTwo,
  },
  {
    title: "Sapphire Market Update",
    date: "15 Mar 2026",
    image: newsThree,
  },
  {
    title: "Field Trip to Ratnapura",
    date: "10 Mar 2026",
    image: newsFour,
  },
  {
    title: "Workshop: Gem Cutting 101",
    date: "06 Mar 2026",
    image: newsFive,
  },
];

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
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Latest <span className="text-[#1e95b5]">News</span>
          </h2>
          <button className="self-start rounded-md border border-[#1e95b5] px-6 py-3 text-sm font-semibold text-[#1e95b5] transition-colors hover:bg-[#1e95b5] hover:text-white md:self-auto">
            See More
          </button>
        </div>

        <div className="mt-10 overflow-hidden pb-4">
          <div className="news-track">
            <div className="news-row">
              {newsItems.map((item) => (
                <NewsCard key={`news-${item.title}`} item={item} />
              ))}
            </div>
            <div className="news-row" aria-hidden="true">
              {newsItems.map((item) => (
                <NewsCard key={`news-dup-${item.title}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

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
    </section>
  );
}
