import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.81.3 1.6.54 2.36a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.72-1.06a2 2 0 0 1 2.11-.45c.76.24 1.55.42 2.36.54A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              +94 11 2345678
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
                  <path d="M21 10c0 5-9 13-9 13S3 15 3 10a9 9 0 1 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              Colombo, Sri Lanka
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
              info@ceylontours.lk
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
