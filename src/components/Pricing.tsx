import React from 'react';
import Link from 'next/link';
import { useConference } from '@/context/ConferenceContext';

export default function Pricing() {
  const { pricing } = useConference();

  return (
    <div
      id="pricing"
      className="w-full bg-black text-white py-24 sm:py-28 px-5 flex flex-col items-center"
    >
      <div className="max-w-[1240px] w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-[#7F0401] uppercase tracking-[4px] text-[12px] font-bold mb-3 block">
            {pricing.subTitle}
          </span>
          <h2
            className="text-white text-[36px] sm:text-[48px] md:text-[56px] font-extrabold leading-[1.1] tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {pricing.mainHeadingPre}
            <span className="text-[#7F0401] italic">
              {pricing.mainHeadingSpan}
            </span>
          </h2>
          <div className="w-[50px] h-[3px] bg-[#7F0401] mx-auto mt-5" />

          {pricing.earlyBirdNote && (
            <div className="inline-block mt-7 py-3 px-6 bg-[rgba(127,4,1,0.08)] border border-[rgba(127,4,1,0.25)] text-white text-[13px] sm:text-[14px] tracking-wider">
              <strong>{pricing.earlyBirdNote}</strong>
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-7 w-full my-8">
          {pricing.cards.map((card) => {
            const isFeatured = card.featured;

            return (
              <div
                key={card.id}
                className={`relative flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-3 ${
                  isFeatured
                    ? 'bg-white text-[#1a1a1a] border-[3px] border-[#7F0401] shadow-[0_20px_50px_rgba(127,4,1,0.2)] py-16 px-8 sm:px-11'
                    : 'bg-[#F8F6F2] text-[#1a1a1a] border border-[#7F0401]/10 py-16 px-8 sm:px-11 hover:shadow-2xl'
                }`}
                style={{ borderRadius: 0 }}
              >
                {/* Early Bird Badge */}
                {card.badge && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#7F0401] text-white text-[12px] sm:text-[13px] font-black py-3 px-9 uppercase tracking-[3px] shadow-[0_8px_25px_rgba(127,4,1,0.4)] border border-white/10 whitespace-nowrap">
                    {card.badge}
                  </div>
                )}

                {/* Top Icon */}
                <div className="text-[#7F0401] mb-7 mt-2">
                  {card.id === 'quadruple' && (
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  )}
                  {card.id === 'triple' && (
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  )}
                  {card.id !== 'quadruple' && card.id !== 'triple' && (
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
                      <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
                      <path d="M12 4v6" />
                      <path d="M2 18h20" />
                    </svg>
                  )}
                </div>

                {/* Card Title */}
                <h3 className="text-[26px] font-extrabold text-[#1a1a1a] mb-2 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-[11px] uppercase text-gray-500 tracking-[1.5px] font-medium mb-5">
                  {card.occupancy}
                </p>

                {/* Occupancy Icons */}
                <div className="flex gap-2 text-[#7F0401] opacity-85 mb-7">
                  {Array.from({ length: card.guestCount || 2 }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-[18px] h-[18px]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="12" cy="7" r="4" />
                      <path d="M12 13c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z" />
                    </svg>
                  ))}
                </div>

                {/* Price */}
                <div className="mb-7">
                  <div className="text-[54px] sm:text-[56px] font-extrabold text-[#7F0401] leading-none flex items-center justify-center tracking-tight">
                    <span className="text-[34px] font-bold mr-1">₹</span>
                    {card.price}
                  </div>
                  <p className="text-[12px] text-gray-500 lowercase font-medium mt-2">
                    per person
                  </p>
                </div>

                {/* Features List */}
                <ul className="w-full text-left mb-8 border-t border-black/10">
                  {card.features.map((feat, i) => (
                    <li
                      key={i}
                      className="py-3.5 text-[14px] text-gray-700 border-b border-black/5 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-[#7F0401] shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* Register Button */}
                <Link
                  href={card.registerUrl}
                  className={`w-full py-4 text-[13px] font-extrabold uppercase tracking-[2px] transition-all duration-300 block text-center mt-auto ${
                    isFeatured
                      ? 'bg-[#7F0401] hover:bg-black text-white border-2 border-[#7F0401] hover:border-black shadow-md'
                      : 'bg-transparent hover:bg-[#1a1a1a] text-[#1a1a1a] hover:text-white border-2 border-black/10 hover:border-black'
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  Register
                </Link>
              </div>
            );
          })}
        </div>

        {/* Registration Note */}
        {pricing.registrationNote && (
          <div className="max-w-[800px] w-full text-center text-[10px] sm:text-[11px] leading-[2] text-white/85 tracking-[1.2px] p-8 sm:p-10 uppercase mt-12 border border-[#7F0401]/40 bg-[#7F0401]/5 rounded-[4px] whitespace-pre-line">
            {pricing.registrationNote}
          </div>
        )}
      </div>
    </div>
  );
}
