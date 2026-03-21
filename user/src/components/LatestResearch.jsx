import researchOne from "../assets/helpcenter.webp";
import researchTwo from "../assets/helpCenter2.webp";
import researchThree from "../assets/herosection3.webp";
import researchFour from "../assets/HeroSection1.webp";

const research = [
  {
    title: "Gem Formation Patterns",
    date: "18 Feb 2026",
    image: researchOne,
  },
  {
    title: "Mineral Identification",
    date: "05 Feb 2026",
    image: researchTwo,
  },
  {
    title: "Sri Lankan Sapphire Study",
    date: "29 Jan 2026",
    image: researchThree,
  },
  {
    title: "Cut Quality Metrics",
    date: "22 Jan 2026",
    image: researchFour,
  },
];

function ResearchCard({ item }) {
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
        <button className="mt-4 text-sm font-semibold text-[#1e95b5] transition-colors hover:text-[#167d97]">
          Read More
        </button>
      </div>
    </div>
  );
}

export default function LatestResearch() {
  return (
    <section className="bg-[#074E67] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Latest <span className="text-[#7fd3e6]">Research</span>
          </h2>
          <button className="self-start rounded-md border border-[#7fd3e6] px-6 py-3 text-sm font-semibold text-[#7fd3e6] transition-colors hover:bg-[#7fd3e6] hover:text-[#074E67] md:self-auto">
            See More
          </button>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-4">
          {research.map((item) => (
            <ResearchCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
