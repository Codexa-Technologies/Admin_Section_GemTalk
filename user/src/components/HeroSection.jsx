import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImageOne from "../assets/HeroSection1.webp";
import heroImageTwo from "../assets/HeroSection2.jpg";
import heroImageThree from "../assets/HeroSection3.jpg";
import { getPublicArticles } from "../services/publicApi";

export default function HeroSection() {
  const [counts, setCounts] = useState({ articles: 0, research: 0, events: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCounts = async () => {
      try {
        const [articlesRes, researchRes, eventsRes] = await Promise.all([
          getPublicArticles({ limit: 1, type: "article" }),
          getPublicArticles({ limit: 1, type: "research" }),
          getPublicArticles({ limit: 1, type: "event" }),
        ]);

        if (!isMounted) return;
        setCounts({
          articles: articlesRes?.pagination?.totalCount ?? 0,
          research: researchRes?.pagination?.totalCount ?? 0,
          events: eventsRes?.pagination?.totalCount ?? 0,
        });
      } catch (error) {
        if (!isMounted) return;
        setCounts({ articles: 0, research: 0, events: 0 });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCounts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#042d3e] via-[#074E67] to-[#05878A]">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#05878A]/20 blur-3xl" />
        <div className="absolute -bottom-24 left-[20%] h-80 w-80 rounded-full bg-[#074E67]/30 blur-3xl" />
        <div className="absolute top-1/2 right-[10%] h-48 w-48 rounded-full bg-white/5 blur-2xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-20 pt-16 lg:flex-row lg:items-center lg:gap-16">
        {/* Left */}
        <div className="flex-1 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7ef0f2]" />
            Gemology Sri Lanka
          </div>
          <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            The Science Behind{" "}
            <span className="bg-gradient-to-r from-[#7ef0f2] to-[#a8f5e8] bg-clip-text text-transparent">
              Precious Stones
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
            Explore the fascinating science behind precious stones found in Sri Lanka. From deep underground formations shaped by heat and pressure
            to the brilliance revealed through expert cutting, gemology uncovers the natural processes that create these stunning treasures.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/articles"
              className="rounded-full bg-white px-7 py-3 text-sm font-bold text-[#074E67] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              View Articles
            </Link>
            <a
              href="/#help-center"
              className="rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
            >
              Help Center
            </a>
          </div>

          {/* Stats */}
          <div className="mt-10 flex gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm w-fit">
            {[
              { label: "Articles", value: counts.articles },
              { label: "Research", value: counts.research },
              { label: "Events", value: counts.events },
            ].map((stat, i) => (
              <div key={stat.label} className={`px-7 py-4 text-center ${
                i !== 2 ? "border-r border-white/15" : ""
              }`}>
                <p className="text-2xl font-black text-white">{loading ? "--" : stat.value}</p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="hidden sm:block">
              <img
                src={heroImageOne}
                alt="Gemstone"
                className="h-72 w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
            <div className="hidden sm:block">
              <img
                src={heroImageTwo}
                alt="Gemstone research"
                className="h-72 w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
            <div className="col-span-2">
              <img
                src={heroImageThree}
                alt="Gem mining"
                className="h-52 w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}