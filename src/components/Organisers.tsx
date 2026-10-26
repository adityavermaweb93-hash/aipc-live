import React from 'react';
import Link from 'next/link';
import { useConference } from '@/context/ConferenceContext';

export default function Organisers() {
  const data = useConference();
  const organisers = data.organisers;

  return (
    <section className="w-full bg-white text-[#1a1a1a] py-24 px-6 border-b border-black/5">
      <div className="max-w-[1200px] mx-auto">
        {/* Conference Organiser Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#920b0b] text-[11px] uppercase tracking-[0.3em] font-extrabold mb-2 block">
              {organisers.label}
            </span>
            <h2
              className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {organisers.titlePre}
              <em className="text-[#920b0b] not-italic italic">
                {organisers.titleEm}
              </em>
            </h2>
            <div className="w-10 h-[3px] bg-[#920b0b] mx-auto mt-4" />
          </div>

          {/* Organiser Card */}
          <div className="max-w-2xl mx-auto bg-[#FAFBFC] border border-gray-100 p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-24 h-24 shrink-0 bg-white p-3 border border-gray-100 flex items-center justify-center">
              <img
                src={organisers.organiser.logo}
                alt={organisers.organiser.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {organisers.organiser.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {organisers.organiser.description}
              </p>
              <a
                href={organisers.organiser.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#920b0b] hover:text-black font-semibold text-sm underline transition-colors"
              >
                {organisers.organiser.urlDisplay}
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-200/60 my-16 max-w-4xl mx-auto" />

        {/* Partners Section */}
        <div>
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-[#920b0b] text-[11px] uppercase tracking-[0.3em] font-extrabold mb-2 block">
              {organisers.partnersLabel}
            </span>
            <h2
              className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {organisers.partnersTitlePre}
              <em className="text-[#920b0b] not-italic italic">
                {organisers.partnersTitleEm}
              </em>
            </h2>
            <div className="w-10 h-[3px] bg-[#920b0b] mx-auto mb-5" />
            <p className="text-gray-500 text-sm leading-relaxed">
              {organisers.partnersDescription}
            </p>
          </div>

          {/* Partner Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {organisers.partnersList.map((partner, idx) => (
              <div
                key={idx}
                className="bg-[#FAFBFC] border border-gray-100 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-20 h-20 shrink-0 bg-white p-3 border border-gray-100 flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {partner.name}
                  </h3>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#920b0b] text-xs font-semibold block mb-3 hover:underline"
                  >
                    {partner.urlDisplay}
                  </a>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {partner.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Know More Button */}
          <div className="text-center">
            <Link
              href={organisers.knowMoreUrl}
              className="inline-flex items-center gap-2 border border-[#920b0b] text-[#920b0b] hover:bg-[#920b0b] hover:text-white px-8 py-3 text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300"
              style={{ borderRadius: 0 }}
            >
              <span>Know More</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
