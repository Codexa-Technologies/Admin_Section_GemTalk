import logo from "../assets/logo.png";
import instaOne from "../assets/HeroSection1.webp";
import instaTwo from "../assets/HeroSection2.jpg";
import instaThree from "../assets/HeroSection3.jpg";
import instaFour from "../assets/helpcenter.webp";
import instaFive from "../assets/helpCenter2.webp";
import instaSix from "../assets/herosection3.webp";

export default function Footer() {
  return (
    <footer className="bg-white py-14">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:gap-16 xl:grid-cols-4 xl:gap-20">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="GemTalk logo" className="h-10 w-auto" />
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-600">
            Explore the world of gems with us. Connect through our social
            channels, find quick links to resources, and get support to make
            your journey effortless.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[#074E67] transition-colors hover:border-[#1e95b5] hover:text-[#1e95b5]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.4V12h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2 .2 2 .2v2.3h-1.1c-1.1 0-1.4.7-1.4 1.4V12h2.4l-.4 2.9h-2v7A10 10 0 0 0 22 12Z" />
              </svg>
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[#074E67] transition-colors hover:border-[#1e95b5] hover:text-[#1e95b5]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M20 5.7c-.6.3-1.2.5-1.9.6.7-.4 1.2-1 1.4-1.7-.6.4-1.3.6-2 .8a3.3 3.3 0 0 0-5.7 3c-2.7-.1-5.1-1.4-6.7-3.5a3.3 3.3 0 0 0 1 4.4c-.5 0-1-.2-1.5-.4 0 1.6 1.1 3 2.6 3.3-.4.1-.8.1-1.2.1-.3 0-.5 0-.8-.1.5 1.4 1.9 2.4 3.6 2.4a6.6 6.6 0 0 1-4.1 1.4c-.3 0-.6 0-.9-.1a9.3 9.3 0 0 0 5 1.5c6 0 9.3-5 9.3-9.3v-.4c.7-.5 1.2-1 1.6-1.6Z" />
              </svg>
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[#074E67] transition-colors hover:border-[#1e95b5] hover:text-[#1e95b5]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm4.8-3.8a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0Z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-900">Services</h4>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li>
              <a className="transition-colors hover:text-[#1e95b5]" href="#">
                Home
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-[#1e95b5]" href="#">
                Articles
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-[#1e95b5]" href="#">
                Research
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-[#1e95b5]" href="#">
                News
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-[#1e95b5]" href="#">
                Contact
              </a>
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
