import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useConference } from '@/context/ConferenceContext';

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const data = useConference();
  const slides = data.about.slides;

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides?.length]);

  return (
    <div id="about" className="w-full bg-black text-white overflow-hidden">
      <section className="flex flex-col lg:flex-row min-h-[70vh] w-full">
        {/* Left: Image Slider */}
        <div className="lg:w-1/2 w-full h-[350px] sm:h-[450px] lg:h-auto min-h-[350px] lg:min-h-[70vh] relative overflow-hidden bg-[#1a1a1a]">
          {slides && slides.map((src, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                idx === currentSlide
                  ? 'opacity-100 scale-105'
                  : 'opacity-0 scale-100 pointer-events-none'
              }`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/40 px-3 py-1.5 rounded-full">
            {slides && slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'bg-[#ff0000] shadow-[0_0_8px_rgba(255,0,0,0.8)]'
                    : 'bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Content Area */}
        <div className="lg:w-1/2 w-full bg-black flex items-center px-6 sm:px-12 lg:px-16 py-16 lg:py-20">
          <div className="max-w-[600px] w-full">
            {/* Pre-title */}
            <p className="text-[#920b0b] text-[11px] sm:text-[12px] uppercase tracking-[0.4em] font-bold mb-6">
              {data.about.preTitle}
            </p>

            {/* Main Heading */}
            <h2
              className="text-white text-[2.2rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.1] mb-7"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {data.about.mainHeadingPre}
              <span className="text-[#920b0b] italic">
                {data.about.mainHeadingSpan}
              </span>
              <br />
              {data.about.mainHeadingPost}
            </h2>

            {/* Body Text */}
            <p className="text-[#b3a5a5] text-[15px] sm:text-[16px] leading-[1.8] font-light mb-6">
              {data.about.p1}
            </p>
            <p className="text-[#b3a5a5] text-[15px] sm:text-[16px] leading-[1.8] font-light mb-8">
              {data.about.p2}
            </p>

            {/* CTA Button */}
            <div className="mb-10">
              <Link
                href={data.about.secureBtnUrl}
                className="inline-block bg-[#920b0b] hover:bg-[#b31010] text-white uppercase text-[11px] sm:text-[12px] font-semibold tracking-[0.25em] py-4 px-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(146,11,11,0.3)]"
                style={{ borderRadius: 0 }}
              >
                {data.about.secureBtnText}
              </Link>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center border-t border-white/10 pt-8 w-full">
              {data.about.stats.map((stat, idx) => (
                <div key={idx} className="relative flex-1 pr-4">
                  <div
                    className="text-[#920b0b] text-[1.8rem] sm:text-[2.2rem] font-bold leading-none mb-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {stat.number}
                  </div>
                  <div className="text-[#8c7e7e] text-[10px] uppercase tracking-[0.2em] font-medium">
                    {stat.label}
                  </div>
                  {idx < data.about.stats.length - 1 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[1px] h-3/4 bg-white/10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
