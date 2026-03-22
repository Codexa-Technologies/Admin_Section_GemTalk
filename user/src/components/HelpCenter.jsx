import contactImage from "../assets/cover-03.jpg";

export default function HelpCenter() {
  return (
    <section id="help-center" className="bg-[#074E67] py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 lg:flex-row lg:items-start lg:gap-16">
        <div className="relative flex-1">
          <div className="absolute -bottom-6 -right-6 hidden h-full w-full rounded-[32px] bg-white/15 lg:block" />
          <div className="relative overflow-hidden rounded-[28px] shadow-lg lg:origin-top-left">
            <img
              src={contactImage}
              alt="Contact us"
              className="h-[420px] w-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-[#7fd3e6]">Help Center</p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#e6f7fb] sm:text-4xl">
            Let&apos;s Talk About Your Next Journey
          </h2>
          <p className="mt-4 text-base leading-7 text-[#b8dbe6]">
            Chat with our team on WhatsApp for quick guidance, curated
            experiences, or partnership inquiries. We respond fast and help
            you plan the perfect visit. Share your goals, budget, and preferred
            dates, and we will suggest the best options with clear next steps.
            Our team can also assist with itinerary ideas, travel tips, and
            local recommendations to make your experience smooth and memorable.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="https://wa.me/94775532053"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#1da851]"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
