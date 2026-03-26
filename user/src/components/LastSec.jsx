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

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
];

export default function LastSec() {
  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-extrabold text-gray-900">Find Your Brithstone</h3>
        </div>

        <div className="mt-6">
          <div className="flex gap-4 overflow-x-auto py-4">
            {images.map((src, i) => (
              <div key={i} className="flex-shrink-0 w-64 rounded-lg bg-slate-100">
                <img src={src} alt={`gallery-${i}`} className="h-40 w-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
