import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useConference } from '@/context/ConferenceContext';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const data = useConference();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-end overflow-hidden bg-[#0a0a0a] z-10 pt-20">
      {/* Background with Parallax */}
      <div
        className="absolute inset-[-5%] z-[1] bg-cover bg-center bg-no-repeat transition-opacity duration-1000 opacity-100"
        style={{
          backgroundImage: `url('${data.hero.bgImage}')`,
          transform: `translate3d(0, ${scrollY * 0.25}px, 0)`,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-r from-[#0a0505f5] via-[#0a0505cc] to-[#0a05054d] md:bg-gradient-to-r max-md:bg-gradient-to-b max-md:from-[#0a0505e6] max-md:to-[#0a0505b3]" />

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 pb-16 sm:pb-24 pt-24 sm:pt-32 flex flex-col justify-end min-h-screen">
        <div className="max-w-[1100px]">
          {/* Pre-title */}
          <p className="text-[#cc0000] text-[11px] sm:text-[12px] uppercase tracking-[0.4em] font-extrabold mb-5 flex items-center max-md:justify-center">
            <span className="hidden md:inline-block w-10 h-[3px] bg-[#cc0000] mr-4" />
            {data.hero.preTitle}
          </p>

          {/* Main Title Bebas Neue */}
          <h1
            className="text-white uppercase font-bold tracking-[0.03em] mb-3 leading-[0.88] drop-shadow-[0_15px_45px_rgba(0,0,0,0.8)] max-md:text-center"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(64px, 13vw, 140px)',
            }}
          >
            {data.hero.mainHeading1}
            <span
              className="inline-block rounded-full ml-1 align-baseline bg-[#920b0b] shadow-[0_0_5px_rgba(255,0,0,0.1)]"
              style={{ width: '0.12em', height: '0.12em' }}
            />
            <br />
            {data.meta.year || data.hero.mainHeading2}
          </h1>

          {/* Subtitle Playfair */}
          <p
            className="text-white mt-6 mb-1 text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem] drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)] max-md:text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {data.hero.subtitlePre}
            <span className="text-[#cc0000] italic">
              {data.hero.subtitleHighlight}
            </span>
            {data.hero.subtitlePost}
          </p>

          {/* Description */}
          <p className="text-white/90 text-[1.1rem] sm:text-[1.3rem] tracking-wide font-normal max-w-[600px] leading-relaxed max-md:text-center max-md:mx-auto">
            {data.hero.description}
          </p>
          <p className="text-white/80 text-[0.95rem] sm:text-[1rem] mt-1 max-md:text-center">
            {data.hero.tagline}
          </p>
        </div>

        {/* Footer info & CTA buttons */}
        <div className="mt-12 sm:mt-16 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
            {/* Info Bar */}
            <div className="hidden sm:flex items-center gap-10">
              <div>
                <div className="text-[10px] sm:text-[11px] text-[#cc0000] uppercase tracking-[0.25em] font-bold mb-1">
                  Dates
                </div>
                <div className="text-white/90 text-sm sm:text-base font-medium">
                  {data.meta.dates}
                </div>
              </div>
              <div className="w-[1px] h-8 bg-white/15" />
              <div>
                <div className="text-[10px] sm:text-[11px] text-[#cc0000] uppercase tracking-[0.25em] font-bold mb-1">
                  Venue
                </div>
                <div className="text-white/90 text-sm sm:text-base font-medium">
                  {data.meta.venueShort}
                </div>
              </div>
              <div className="w-[1px] h-8 bg-white/15" />
              <div>
                <div className="text-[10px] sm:text-[11px] text-[#cc0000] uppercase tracking-[0.25em] font-bold mb-1">
                  For
                </div>
                <div className="text-white/90 text-sm sm:text-base font-medium">
                  {data.meta.forText}
                </div>
              </div>
            </div>

            {/* Buttons Group */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <Link
                href={data.hero.registerBtnUrl}
                className="w-full sm:w-auto text-center bg-[#cc0000] hover:bg-white text-white hover:text-black uppercase text-[12px] font-extrabold tracking-[0.25em] py-4 px-9 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(204,0,0,0.4)]"
                style={{ borderRadius: 0 }}
              >
                {data.hero.registerBtnText}
              </Link>
              <Link
                href={data.hero.learnMoreBtnUrl}
                className="w-full sm:w-auto text-center border-[1.5px] border-white/50 hover:bg-white text-white hover:text-black uppercase text-[12px] font-extrabold tracking-[0.25em] py-4 px-9 transition-all duration-300 hover:-translate-y-1"
                style={{ borderRadius: 0 }}
              >
                {data.hero.learnMoreBtnText}
              </Link>
            </div>
          </div>

          {/* Language Disclaimer */}
          <p className="mt-8 text-[10px] sm:text-[11px] text-white/60 tracking-wider uppercase font-medium max-w-[850px] leading-relaxed max-md:text-center max-md:mx-auto whitespace-pre-line">
            {data.meta.englishDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
