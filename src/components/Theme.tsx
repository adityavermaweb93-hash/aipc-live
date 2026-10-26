import React from 'react';
import { useConference } from '@/context/ConferenceContext';

export default function Theme() {
  const { theme } = useConference();

  return (
    <div id="theme" className="w-full bg-[#F7F5F3] text-[#1a1a1a] py-20 px-5">
      <section className="max-w-[1000px] mx-auto flex flex-col items-center justify-center text-center">
        {/* Header */}
        <div className="mb-10 w-full">
          <p className="text-[#920b0b] text-[11px] sm:text-[12px] uppercase tracking-[0.35em] font-extrabold mb-3">
            {theme.preTitle}
          </p>
          <h2
            className="text-[#1a1a1a] text-[2.2rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.1] mb-2 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {theme.mainHeadingPre}
            <span className="text-[#920b0b] italic">{theme.mainHeadingSpan}</span>
            {theme.mainHeadingPost}
          </h2>
          <p className="text-[#8c8c8c] text-[15px] sm:text-[17px] tracking-wide mb-6">
            {theme.subtitle}
          </p>
          <div className="w-10 h-[2px] bg-[#920b0b] mx-auto" />
        </div>

        {/* Content Card */}
        <div
          className="bg-[#0d0d0d] max-w-[900px] w-full p-8 sm:p-12 md:p-14 text-left relative border-t-4 border-[#920b0b]"
          style={{ borderRadius: 0 }}
        >
          {/* Quote Text */}
          <h3
            className="text-white text-[1.3rem] sm:text-[1.6rem] md:text-[1.8rem] italic font-bold leading-snug mb-4 whitespace-pre-line"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {theme.quoteText}
          </h3>

          {/* Reference */}
          <span className="text-[#920b0b] text-[11px] uppercase tracking-[0.15em] font-extrabold block mb-7">
            {theme.quoteRef}
          </span>

          {/* Body */}
          <div className="mb-8 space-y-4 text-[#a0a0a0] text-[14px] sm:text-[15px] leading-relaxed font-normal">
            <p>{theme.p1}</p>
            <p>{theme.p2}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {theme.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[#777777] text-[9px] sm:text-[10px] uppercase font-bold tracking-widest border border-white/10 px-3 py-1.5 transition-colors duration-200 hover:border-[#920b0b] hover:text-white"
                style={{ borderRadius: 0 }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
