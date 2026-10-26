import React, { useState } from 'react';
import Link from 'next/link';
import { useConference } from '@/context/ConferenceContext';

export default function Faq() {
  const data = useConference();
  const faq = data.faq;
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggle = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="faq"
      className="w-full bg-black text-white py-20 sm:py-24 px-5 flex flex-col items-center"
    >
      <div className="max-w-[1200px] w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[#7F0401] uppercase tracking-[4px] text-[11px] font-extrabold mb-3 block">
            {faq.subTitle}
          </span>
          <h2
            className="text-[32px] sm:text-[46px] md:text-[57px] font-extrabold text-white leading-[1.1] tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {faq.titlePre}
            <span className="text-[#7F0401] italic">{faq.titleSpan}</span>
          </h2>
          <div className="w-[45px] h-[3px] bg-[#7F0401] mx-auto mt-5" />
        </div>

        {/* FAQ Grid: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-0 w-full items-start">
          {/* Column 1 */}
          <div className="w-full">
            {faq.column1.map((item, idx) => {
              const id = `col1-${idx}`;
              const isOpen = !!openItems[id];

              return (
                <div
                  key={id}
                  className="border-b border-white/10 w-full"
                >
                  <button
                    onClick={() => toggle(id)}
                    className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
                  >
                    <span className="text-[17px] sm:text-[18px] font-bold text-white pr-5 leading-snug group-hover:text-gray-200 transition-colors">
                      {item.question}
                    </span>
                    <span
                      className={`text-[#7F0401] text-2xl font-light transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-45' : 'rotate-0'
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-6 text-[#aaaaaa] text-[14px] sm:text-[15px] leading-relaxed faq-content">
                      <div
                        dangerouslySetInnerHTML={{ __html: item.answerHtml }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Column 2 */}
          <div className="w-full">
            {faq.column2.map((item, idx) => {
              const id = `col2-${idx}`;
              const isOpen = !!openItems[id];

              return (
                <div
                  key={id}
                  className="border-b border-white/10 w-full"
                >
                  <button
                    onClick={() => toggle(id)}
                    className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
                  >
                    <span className="text-[17px] sm:text-[18px] font-bold text-white pr-5 leading-snug group-hover:text-gray-200 transition-colors">
                      {item.question}
                    </span>
                    <span
                      className={`text-[#7F0401] text-2xl font-light transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-45' : 'rotate-0'
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-6 text-[#aaaaaa] text-[14px] sm:text-[15px] leading-relaxed faq-content">
                      <div
                        dangerouslySetInnerHTML={{ __html: item.answerHtml }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* More FAQs Button */}
        <div className="mt-14 text-center">
          <Link
            href={faq.moreFaqsUrl}
            className="inline-block bg-[#7F0401] hover:bg-[#600000] text-white text-[13px] font-extrabold uppercase tracking-[2px] py-4 px-10 border-2 border-[#7F0401] hover:border-[#600000] transition-all duration-300"
            style={{ borderRadius: 0 }}
          >
            More FAQ's
          </Link>
        </div>
      </div>
    </section>
  );
}
