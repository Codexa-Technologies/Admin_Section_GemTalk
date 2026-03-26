import img1 from "../assets/lastsec/birth srones-01.jpg";
import img2 from "../assets/lastsec/birth srones-02.jpg";
import img3 from "../assets/lastsec/birth srones-03.jpg";
import img4 from "../assets/lastsec/birth srones-04.jpg";
import img5 from "../assets/lastsec/birth srones-05.jpg";
import img6 from "../assets/lastsec/birth srones-06.jpg";
import img7 from "../assets/lastsec/birth srones-07.jpg";
import img8 from "../assets/lastsec/birth srones-08.jpg";
import img9 from "../assets/lastsec/birth srones-09.jpg";
import img10 from "../assets/lastsec/birth srones-10.jpg";
import img11 from "../assets/lastsec/birth srones-11.jpg";
import img12 from "../assets/lastsec/birth srones-12.jpg";

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12];

export default function LastSec() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Find Your <span className="text-[#1e95b5]">BirthStone</span></h3>
      </div>

      <div className="mt-10 overflow-hidden">
        <div className="lastsec-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="lastsec-row" aria-hidden={copy === 1 ? "true" : undefined}>
              {images.map((src, i) => (
                <div key={i} className="lastsec-card">
                  <img src={src} alt={`birthstone-${i + 1}`} className="h-full w-full object-contain block" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes lastsec-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .lastsec-track {
          display: flex;
          width: max-content;
          animation: lastsec-scroll 120s linear infinite;
          will-change: transform;
        }
        .lastsec-row {
          display: flex;
          gap: 1.5rem;
          padding-right: 1.5rem;
        }
        .lastsec-card {
          flex-shrink: 0;
          width: 220px;
          height: 336px;
          border-radius: 1rem;
          overflow: hidden;
          background: #f1f5f9;
        }
      `}</style>
    </section>
  );
}
