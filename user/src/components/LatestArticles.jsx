import articleOne from "../assets/HeroSection1.webp";
import articleTwo from "../assets/HeroSection2.jpg";
import articleThree from "../assets/HeroSection3.jpg";
import articleFour from "../assets/helpcenter.webp";

const articles = [
  {
    title: "Sigiriya: The Lion Rock",
    date: "12 Mar 2026",
    image: articleOne,
  },
  {
    title: "Ella Trails and Tea Estates",
    date: "08 Mar 2026",
    image: articleTwo,
  },
  {
    title: "Kandy Temple Stories",
    date: "02 Mar 2026",
    image: articleThree,
  },
  {
    title: "Ratnapura Gem Trails",
    date: "26 Feb 2026",
    image: articleFour,
  },
];

function ArticleCard({ item }) {
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

export default function LatestArticles() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Latest <span className="text-[#1e95b5]">Articles</span>
          </h2>
          <button className="self-start rounded-md border border-[#1e95b5] px-6 py-3 text-sm font-semibold text-[#1e95b5] transition-colors hover:bg-[#1e95b5] hover:text-white md:self-auto">
            See More
          </button>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-4">
          {articles.map((item) => (
            <ArticleCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
