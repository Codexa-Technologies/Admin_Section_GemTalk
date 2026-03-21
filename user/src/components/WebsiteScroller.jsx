import logoOne from "../assets/websites/logo1.jpeg";
import logoTwo from "../assets/websites/logo2.jpeg";
import logoThree from "../assets/websites/logo3.jpeg";
import logoFour from "../assets/websites/logo4.jpeg";
import logoFive from "../assets/websites/logo5.jpeg";
import logoSix from "../assets/websites/logo6.jpeg";

const logos = [logoOne, logoTwo, logoThree, logoFour, logoFive, logoSix];

export default function WebsiteScroller() {
  return (
    <section className="bg-[#074E67] py-14">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Our <span className="text-[#7fd3e6]">Partners</span>
        </h2>
        <div className="mt-8 overflow-hidden pb-4">
          <div className="logo-track">
            <div className="logo-row">
              {logos.map((logo, index) => (
                <div
                  key={`logo-${index}`}
                  className="flex h-28 w-28 items-center justify-center rounded-2xl bg-white shadow-md"
                >
                  <img src={logo} alt={`Partner ${index + 1}`} className="h-14 w-14 object-contain" />
                </div>
              ))}
            </div>
            <div className="logo-row" aria-hidden="true">
              {logos.map((logo, index) => (
                <div
                  key={`logo-dup-${index}`}
                  className="flex h-28 w-28 items-center justify-center rounded-2xl bg-white shadow-md"
                >
                  <img src={logo} alt={`Partner ${index + 1}`} className="h-14 w-14 object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes logo-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .logo-track {
          display: flex;
          width: max-content;
          animation: logo-scroll 30s linear infinite;
          will-change: transform;
        }
        .logo-row {
          display: flex;
          gap: 1.5rem;
          padding-right: 1.5rem;
        }
      `}</style>
    </section>
  );
}
