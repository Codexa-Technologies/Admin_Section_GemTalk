import heroImageOne from "../assets/HeroSection1.webp";
import heroImageTwo from "../assets/HeroSection2.jpg";
import heroImageThree from "../assets/HeroSection3.jpg";

export default function HeroSection() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-16 pt-10 lg:flex-row lg:items-center lg:gap-14">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1e95b5]/30 bg-[#1e95b5]/5 px-3 py-1 text-xs font-semibold text-[#1e95b5]">
              Gemology Sri Lanka
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
              The Science Behind Precious Stones
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
              Explore the fascinating science behind precious stones found in Sri Lanka. From deep underground formations shaped by heat and pressure
              to the brilliance revealed through expert cutting, gemology uncovers the natural processes that create these stunning treasures and their lasting beauty.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <button className="rounded-md bg-[#1e95b5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#167d97]">
                View Articals
              </button>
              <button className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#1e95b5] hover:text-[#1e95b5]">
                Contact Us
              </button>
            </div>

            <div className="mx-auto mt-10 grid w-full max-w-lg grid-cols-3 gap-4 rounded-2xl bg-white px-5 py-4 text-center shadow-lg ring-1 ring-gray-100">
              <div>
                <p className="text-xs font-semibold text-gray-500">Articles</p>
                <p className="text-2xl font-extrabold text-gray-800">120+</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Research</p>
                <p className="text-2xl font-extrabold text-gray-800">45</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Events</p>
                <p className="text-2xl font-extrabold text-gray-800">30</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <img
                  src={heroImageOne}
                  alt="Sri Lanka landscape"
                  className="h-80 w-full rounded-2xl object-cover shadow-md"
                />
              </div>
              <div className="rounded-2xl bg-gray-100 p-1 shadow-md">
                <img
                  src={heroImageTwo}
                  alt="Tea garden"
                  className="h-80 w-full rounded-2xl object-cover"
                />
              </div>
              <div className="col-span-2 rounded-2xl bg-gray-100 p-1 shadow-md">
                <img
                  src={heroImageThree}
                  alt="Gem mining"
                  className="h-56 w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
