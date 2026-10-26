import React from 'react';
import { useConference } from '@/context/ConferenceContext';

export default function Speakers() {
  const { speakers } = useConference();

  return (
    <section
      id="speakers"
      className="bg-black text-white relative overflow-hidden py-24 sm:py-32 px-6 sm:px-10 flex flex-col items-center justify-center text-center min-h-[50vh]"
    >
      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(204,18,18,0.12)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] w-full flex flex-col items-center justify-center flex-grow">
        {/* Pre-heading */}
        <span className="text-[#cc1212] text-[13px] sm:text-[14px] uppercase tracking-[0.5em] font-bold mb-5 block">
          {speakers.preHeading}
        </span>

        {/* Main Heading */}
        <h2
          className="text-white text-[38px] sm:text-[54px] md:text-[72px] font-bold leading-[1.1] mb-0"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-[#cc1212] italic">{speakers.mainHeadingItalic}</span>
          {speakers.mainHeadingRest}
        </h2>

        {/* Divider */}
        <div className="w-[60px] h-[3px] bg-[#cc1212] my-8 rounded-[2px]" />

        {/* Footnote */}
        <p className="w-full text-white/80 text-[12px] sm:text-[14px] md:text-[18px] leading-relaxed font-normal mt-10 sm:mt-14 pt-6 border-t border-white/5 tracking-wide max-w-[1100px]">
          {speakers.footnote}
        </p>
      </div>
    </section>
  );
}
