import contactImage from "../assets/helpcenter3.jpeg";

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
            Chat with our team on WhatsApp for quick guidance, curated experiences, or partnership inquiries.  We respond quickly to your questions and help you understand your gemstones with confidence. Share your queries, and our experts will guide you with accurate information, practical advice, and clear answers. You can also connect with industry professionals, gain insights, and explore trusted knowledge to make better decisions in the gem world.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/94766900767"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-40 items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#1da851]"
            >
              WhatsApp Us
            </a>
            <a
              href="https://chat.whatsapp.com/Cxi0VdeZO550xKxj1CxYMt?mode=gi_t"
              className="inline-flex w-40 items-center justify-center gap-2 rounded-md bg-[#006B3C] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#005b34]"
            >
              Group Chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


