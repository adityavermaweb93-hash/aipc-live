import React from 'react';
import Link from 'next/link';
import { useConference } from '@/context/ConferenceContext';

export default function Venue() {
  const data = useConference();
  const venue = data.venue;

  return (
    <section
      id="venue"
      className="w-full bg-[#f8f8f8] text-[#1a1a1a] py-20 sm:py-24 px-5 flex flex-col items-center"
    >
      <div className="max-w-[1200px] w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[#7F0401] uppercase tracking-[4px] text-[13px] font-extrabold mb-3 block">
            {venue.subTitle}
          </span>
          <h2
            className="text-[32px] sm:text-[46px] md:text-[57px] font-extrabold text-[#1a1a1a] leading-[1.1] tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {venue.titlePre}
            <span className="text-[#7F0401] italic">{venue.titleSpan}</span>
          </h2>
          <div className="w-10 h-[3px] bg-[#7F0401] mx-auto mt-5" />
        </div>

        {/* Content Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mb-8">
          {/* Main Venue Card */}
          <div
            className="lg:col-span-7 bg-white border border-[#e0e0e0] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col"
            style={{ borderRadius: 0 }}
          >
            <div className="w-full h-[280px] sm:h-[340px] bg-gray-200 overflow-hidden">
              <img
                src={venue.mainCard.image}
                alt={venue.mainCard.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-8 sm:p-10 flex-grow flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-2 tracking-tight">
                {venue.mainCard.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                {venue.mainCard.address}
              </p>
            </div>
          </div>

          {/* Side Support Column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Map Card */}
            <div
              className="bg-white border border-[#e0e0e0] p-8 sm:p-10 text-center flex flex-col items-center justify-center flex-1 shadow-sm"
              style={{ borderRadius: 0 }}
            >
              <div className="text-[#d1d1d1] mb-5">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                {venue.mapCard.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 mb-6">
                {venue.mapCard.subtitle}
              </p>
              <a
                href={venue.mapCard.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#7F0401] hover:text-[#5a0301] font-bold text-sm transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span>{venue.mapCard.linkText}</span>
              </a>
            </div>

            {/* Help Card */}
            <div
              className="bg-white border border-[#e0e0e0] p-8 sm:p-10 flex-1 flex flex-col justify-center shadow-sm"
              style={{ borderRadius: 0 }}
            >
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                {venue.helpCard.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {venue.helpCard.description}
              </p>
              <div>
                <Link
                  href={venue.helpCard.btnUrl}
                  className="inline-block bg-[#7F0401] hover:bg-[#5a0301] text-white text-xs font-extrabold uppercase tracking-wider py-4 px-6 transition-all duration-300"
                  style={{ borderRadius: 0 }}
                >
                  {venue.helpCard.btnText}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Transportation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {venue.transport.map((item, idx) => (
            <Link
              key={idx}
              href={item.url}
              className="group block"
            >
              <div
                className="bg-white border border-[#e0e0e0] p-7 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[#7F0401] group-hover:shadow-md h-full flex flex-col justify-start"
                style={{ borderRadius: 0 }}
              >
                <div className="text-[#7F0401] mb-4">
                  {idx === 0 && (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="4" y="3" width="16" height="18" rx="2" />
                      <line x1="9" y1="7" x2="15" y2="7" />
                      <line x1="9" y1="11" x2="15" y2="11" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                      <path d="M8 21v1" />
                      <path d="M16 21v1" />
                    </svg>
                  )}
                  {idx === 1 && (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
                    </svg>
                  )}
                  {idx === 2 && (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h10" />
                      <circle cx="7" cy="17" r="2" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  )}
                </div>
                <h5 className="text-[16px] font-bold text-gray-900 mb-2">
                  {item.mode}
                </h5>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
