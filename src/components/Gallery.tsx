import React, { useState } from 'react';
import { useConference } from '@/context/ConferenceContext';

export default function Gallery() {
  const data = useConference();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const gallery = data.gallery;
  const slides = gallery.slides;

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      id="gallery"
      className="w-full bg-[#0a0a0a] text-white py-24 sm:py-28 relative overflow-hidden flex flex-col items-center"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-[radial-gradient(circle,rgba(128,27,13,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16 sm:mb-20 z-10 px-4">
        <span className="text-[10px] font-black tracking-[0.6em] text-[#801b0d] block mb-2 uppercase opacity-80">
          {gallery.subtitle}
        </span>
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-5"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {gallery.titlePre}
          <span className="text-[#801b0d] italic">
            {gallery.titleSpan}
          </span>
        </h2>
        <div className="h-1 w-10 bg-[#801b0d] mx-auto" />
      </div>

      {/* Carousel Wrapper */}
      <div className="w-full max-w-[1300px] px-4 sm:px-6 relative z-10 overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentSlideIndex * 100}%)`,
          }}
        >
          {slides.map((slide, slideIdx) => (
            <div
              key={slideIdx}
              className="w-full flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 h-auto md:h-[620px]"
            >
              {slide.items.map((item, itemIdx) => {
                let spanClasses = 'col-span-1 row-span-1 h-[180px] md:h-[300px]';
                if (item.className === 'item-1') {
                  spanClasses = 'col-span-2 row-span-1 h-[180px] md:h-[300px]';
                } else if (item.className === 'item-5') {
                  spanClasses = 'col-span-2 row-span-1 h-[180px] md:h-[300px]';
                }

                return (
                  <div
                    key={itemIdx}
                    className={`relative overflow-hidden bg-[#1a1a1a] shadow-xl group cursor-pointer ${spanClasses}`}
                    style={{ borderRadius: 0 }}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 filter grayscale-[20%] brightness-[85%] group-hover:grayscale-0 group-hover:brightness-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity duration-300" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 mt-12">
          <button
            onClick={prevSlide}
            className="w-[55px] h-[55px] rounded-full bg-white/5 hover:bg-[#801b0d] border border-white/10 hover:border-[#801b0d] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(128,27,13,0.4)]"
            aria-label="Previous Slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="w-[55px] h-[55px] rounded-full bg-white/5 hover:bg-[#801b0d] border border-white/10 hover:border-[#801b0d] text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(128,27,13,0.4)]"
            aria-label="Next Slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
