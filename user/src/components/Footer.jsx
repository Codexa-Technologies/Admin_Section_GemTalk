import { Link } from "react-router-dom";
import logo from "../assets/logo3.png";
import instaOne from "../assets/footer/footer1.webp";
import instaTwo from "../assets/footer/footer2.webp";
import instaThree from "../assets/footer/footer3.webp";
import instaFour from "../assets/footer/footer4.webp";
import instaFive from "../assets/footer/footer5.webp";
import instaSix from "../assets/footer/footer6.webp";

export default function Footer() {
  return (
    <footer className="bg-white py-14">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:gap-16 xl:grid-cols-4 xl:gap-20">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="GemTalk logo" className="h-12 w-auto" />
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-600">
            Explore the world of gems with us. Connect through our social
            channels, find quick links to resources, and get support to make
            your journey effortless.
          </p>
        </div>

        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-900">Services</h4>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li>
              <Link className="transition-colors hover:text-[#1e95b5]" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link
                className="transition-colors hover:text-[#1e95b5]"
                to="/articles"
              >
                Articles
              </Link>
            </li>
            <li>
              <Link
                className="transition-colors hover:text-[#1e95b5]"
                to="/research"
              >
                Research
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-[#1e95b5]" to="/news">
                News
              </Link>
            </li>
            <li>
              <Link
                className="transition-colors hover:text-[#1e95b5]"
                to="/events"
              >
                Events
              </Link>
            </li>
            
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900">Images</h4>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[instaOne, instaTwo, instaThree, instaFour, instaFive, instaSix].map(
              (image, index) => (
                <div
                  key={image}
                  className="overflow-hidden rounded-xl bg-gray-100"
                >
                  <img
                    src={image}
                    alt={`Instagram ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900">Contact</h4>
          <ul className="mt-4 space-y-4 text-sm text-gray-600">
            <li>
              <a
                href="https://wa.me/94775532053"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-[#1e95b5]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e95b5]/10 text-[#1e95b5]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M20.52 3.48A11.78 11.78 0 0 0 12.05 0C5.45 0 .07 5.38.07 11.98c0 2.11.56 4.17 1.62 5.99L0 24l6.18-1.62a11.92 11.92 0 0 0 5.87 1.5h.01c6.6 0 11.98-5.38 11.98-11.98 0-3.2-1.25-6.2-3.52-8.42ZM12.05 21.4h-.01a9.86 9.86 0 0 1-5.02-1.38l-.36-.22-3.67.96.98-3.58-.24-.37a9.87 9.87 0 1 1 18.18-5.13 9.92 9.92 0 0 1-9.86 9.72Zm5.74-7.67c-.31-.16-1.85-.91-2.13-1.01-.29-.1-.5-.16-.71.16-.21.31-.81 1.01-.99 1.22-.18.21-.36.24-.67.08-.31-.16-1.32-.49-2.52-1.57-.93-.83-1.56-1.86-1.74-2.18-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.02-.55-.08-.16-.71-1.7-.98-2.33-.26-.62-.53-.53-.71-.54l-.61-.01c-.21 0-.55.08-.83.39-.29.31-1.1 1.08-1.1 2.63s1.12 3.05 1.28 3.26c.16.21 2.2 3.35 5.33 4.7.74.32 1.32.51 1.77.65.74.24 1.41.2 1.94.12.59-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.28-.21-.59-.36Z" />
                  </svg>
                </span>
                GemTalk
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/share/1Dwz6kW6FX/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-[#1e95b5]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e95b5]/10 text-[#1e95b5]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </span>
                GemTalk
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e95b5]/10 text-[#1e95b5]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M4 4h16v16H4z" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
              </span>
              gemtalk.info@gmail.com
            </li>
          </ul>
        </div>

      </div>

      <div className="mx-auto mt-10 max-w-7xl px-6">
        <p className="text-center text-xs text-gray-500">
          Copyright © 2026 GemTalk. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
