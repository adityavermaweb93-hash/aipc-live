import React, { useState } from 'react';
import { useConference } from '@/context/ConferenceContext';

export default function Books() {
  const { books } = useConference();
  const availableYears = books.years || Object.keys(books.booksData);
  const [activeYear, setActiveYear] = useState(availableYears[0] || '2026');
  const bookList = books.booksData[activeYear] || [];

  return (
    <div
      id="book"
      className="w-full bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] py-16 sm:py-24 px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <span className="text-[10px] font-black tracking-[0.6em] text-[#801b0d] block mb-2 uppercase opacity-80">
            {books.complimentaryLabel}
          </span>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900 mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {books.titlePre}
            <span className="text-[#801b0d] italic">
              {books.titleItalic}
            </span>
          </h2>
          <div className="h-1 w-10 bg-[#801b0d] mx-auto" />
        </header>

        {/* Year Tabs */}
        <nav className="mb-14 sm:mb-16">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3" id="yearTabs">
            {availableYears.map((year) => {
              const isActive = activeYear === year;
              return (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`flex-1 sm:flex-none text-center py-2.5 px-4 min-w-[100px] sm:min-w-[110px] flex flex-col items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-[#801b0d] text-white border border-[#801b0d] shadow-[0_6px_15px_rgba(128,27,13,0.2)] -translate-y-0.5'
                      : 'bg-white/60 text-gray-600 border border-black/10 hover:bg-white/80'
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  <span className="text-[8px] block font-bold opacity-60 mb-0.5 uppercase tracking-widest">
                    AIPC
                  </span>
                  <span className="text-sm sm:text-base font-bold">{year}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Books Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
          {bookList.map((book, idx) => (
            <div
              key={idx}
              className="bg-white p-0 shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-black/5 overflow-hidden transition-all duration-400 ease-out hover:-translate-y-2.5 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(128,27,13,0.15)] hover:border-[#801b0d]/20"
              style={{ borderRadius: 0 }}
            >
              <img
                src={book.img}
                alt="Book Cover"
                className="w-full h-auto aspect-[2/3] object-cover bg-gray-100 block"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
