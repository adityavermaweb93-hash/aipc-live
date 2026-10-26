import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingNav from '@/components/FloatingNav';
import { useConference } from '@/context/ConferenceContext';

const partnerList = [
  {
    name: 'For The Truth',
    logo: '/assets/cropped-for-social-media-icon-1.png',
    url: 'https://forthetruth.in',
    urlDisplay: 'forthetruth.in',
    desc: 'A publishing ministry that exists to print, publish and distribute resources for the church in India and abroad.',
  },
  {
    name: 'Solas Theological Seminary',
    logo: '/assets/EIC_Favicon.png',
    url: 'https://solassem转变.org',
    urlDisplay: 'solas.edu.in',
    desc: 'Equipping pastors and leaders with sound biblical doctrine, expository preaching tools, and pastoral care.',
  },
  {
    name: 'Truth:78',
    logo: '/assets/Transparent_Truth78_Logo.avif',
    url: 'https://truth78.org',
    urlDisplay: 'truth78.org',
    desc: 'A ministry focused on helping the next generation know, honor, and treasure God, setting their hope in Christ alone.',
  },
  {
    name: 'Alethia Publications',
    logo: '/assets/cropped-for-social-media-icon-1.png',
    url: '#',
    urlDisplay: 'alethiapublications.com',
    desc: 'Translating and publishing solid theological literature for Indian languages and vernacular ministry contexts.',
  },
  {
    name: 'Alabaster Soul Care',
    logo: '/assets/EIC_Favicon.png',
    url: '#',
    urlDisplay: 'alabastersoulcare.org',
    desc: 'Biblical counseling and member care ministry providing pastoral care and emotional renewal for gospel workers.',
  },
];

export default function Partners() {
  const data = useConference();

  return (
    <>
      <Head>
        <title>{`Organisers & Partners – AIPC ${data.meta.year}`}</title>
      </Head>

      <FloatingNav />
      <Header />

      <main className="bg-white min-h-screen pt-28 pb-24 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto">
          {/* Organiser Section */}
          <section className="mb-20 text-center">
            <span className="text-[#920b0b] text-[11px] uppercase tracking-[0.3em] font-extrabold mb-2 block">
              ORGANISED BY
            </span>
            <h1
              className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Conference <em className="text-[#920b0b] not-italic italic">Organiser</em>
            </h1>
            <div className="w-12 h-1 bg-[#920b0b] mx-auto mb-10" />

            <div className="max-w-2xl mx-auto bg-[#FAFBFC] border border-gray-100 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="w-24 h-24 shrink-0 bg-white p-3 border border-gray-100 flex items-center justify-center">
                <img
                  src="/assets/EIC_Favicon.png"
                  alt="Equip Indian Churches"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Equip Indian Churches</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Equip Indian Churches is a ministry where several pastors have partnered together with a desire to help provide direction and momentum to Biblical gospel growth.
                </p>
                <a
                  href="https://equipindianchurches.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#920b0b] hover:text-black font-semibold text-sm underline"
                >
                  equipindianchurches.com
                </a>
              </div>
            </div>
          </section>

          {/* Partners Section */}
          <section>
            <div className="text-center mb-12">
              <span className="text-[#920b0b] text-[11px] uppercase tracking-[0.3em] font-extrabold mb-2 block">
                PARTNERSHIPS
              </span>
              <h2
                className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Our <em className="text-[#920b0b] not-italic italic">Partners</em>
              </h2>
              <div className="w-12 h-1 bg-[#920b0b] mx-auto mb-6" />
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                We are grateful to partner with ministries that share our desire to serve the church and see the Gospel faithfully proclaimed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partnerList.map((partner, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAFBFC] border border-gray-100 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-20 shrink-0 bg-white p-3 border border-gray-100 flex items-center justify-center">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{partner.name}</h3>
                    {partner.url !== '#' && (
                      <a
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#920b0b] text-xs font-semibold block mb-3 hover:underline"
                      >
                        {partner.urlDisplay}
                      </a>
                    )}
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{partner.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
