import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingNav from '@/components/FloatingNav';
import { useConference } from '@/context/ConferenceContext';

export default function TravelInstructionsPage() {
  const data = useConference();

  return (
    <>
      <Head>
        <title>{`Travel Instructions – AIPC ${data.meta.year}`}</title>
      </Head>

      <FloatingNav />
      <Header />

      <main className="bg-[#f9fafb] min-h-screen pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 p-8 sm:p-14 shadow-sm">
          {/* Header */}
          <div className="text-center mb-12 border-b border-gray-100 pb-8">
            <span className="text-[#910c0b] text-xs font-black tracking-[0.3em] uppercase mb-2 block">
              LOCATION &amp; TRANSIT
            </span>
            <h1
              className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Travel <span className="text-[#910c0b] italic">Instructions</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
              Welcome to AIPC {data.meta.year} at {data.venue.mainCard.name}, {data.venue.mainCard.address}. Please follow this guide to reach the venue smoothly.
            </p>
          </div>

          {/* Option 1: By Train */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#910c0b] text-white text-xs font-bold px-3 py-1 uppercase">
                Option 1
              </span>
              <h2 className="text-2xl font-bold text-gray-900">By Train &amp; Metro</h2>
            </div>

            <div className="bg-[#fffdfd] border-l-4 border-[#910c0b] p-5 mb-6 text-sm text-gray-700 leading-relaxed">
              <strong>NOTE:</strong> The closest railway station to the venue is <strong>MIRA ROAD</strong>, but outstation trains do not stop here. Preferred outstation arrival stations are:
              <span className="block mt-1 font-semibold text-gray-900">1. Borivali &nbsp;|&nbsp; 2. Thane &nbsp;|&nbsp; 3. Vasai</span>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-100 p-6 bg-gray-50">
                <h3 className="font-bold text-base text-gray-900 mb-2">a. From Borivali Station</h3>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li><strong>Morning / Afternoon:</strong> Take a Western line local train from Borivali towards Virar/Dahanu and get down at Mira Road (next stop).</li>
                  <li><strong>Peak Hours (4 PM to 10 PM):</strong> Local trains heading north are extremely crowded. Avoid carrying luggage on local trains during this window.</li>
                  <li><strong>Alternative:</strong> Take a direct cab (Uber or Ola) or auto-rickshaw from Borivali Station East directly to GCC Hotel &amp; Club (approx. 20–30 mins).</li>
                </ul>
              </div>

              <div className="border border-gray-100 p-6 bg-gray-50">
                <h3 className="font-bold text-base text-gray-900 mb-2">b. From Thane Station</h3>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li><strong>Cab:</strong> Book an Uber or Ola directly from Thane Station (East/West) to GCC Hotel via Ghodbunder Road.</li>
                  <li><strong>AC Bus:</strong> City AC buses run regularly from outside Thane station towards Mira-Bhayandar.</li>
                </ul>
              </div>

              <div className="border border-gray-100 p-6 bg-gray-50">
                <h3 className="font-bold text-base text-gray-900 mb-2">c. Via Other Main Termini (CSMT, LTT, Mumbai Central, Dadar)</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Take the Western line slow or fast local train heading towards Borivali/Bhayandar/Virar and alight at <strong>Mira Road</strong> station. From Mira Road station East, GCC Hotel &amp; Club is a 7–10 minute auto-rickshaw ride.
                </p>
              </div>
            </div>
          </section>

          {/* Option 2: By Flight */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#910c0b] text-white text-xs font-bold px-3 py-1 uppercase">
                Option 2
              </span>
              <h2 className="text-2xl font-bold text-gray-900">By Flight</h2>
            </div>

            <div className="border border-gray-100 p-6 bg-gray-50 space-y-4">
              <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                <div><strong>Road Distance:</strong> ~23 km</div>
                <div><strong>Est. Travel Time:</strong> 1 hr 15 mins (traffic dependent)</div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Arriving at <strong>Chhatrapati Shivaji Maharaj International Airport (BOM)</strong>: You will land at either Terminal 1 (Domestic) or Terminal 2 (International/Domestic).
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>Best Way:</strong> Follow signs for &ldquo;App-Based Taxis&rdquo; at the arrivals level and book an <strong>Uber</strong> or <strong>Ola</strong> cab directly to <em>GCC Hotel and Club, Mira Road East</em>.
              </p>
            </div>
          </section>

          {/* Important Travel Tips */}
          <section className="bg-amber-50/60 border border-amber-200/80 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-circle-info text-[#910c0b]" />
              Important Travel Tips
            </h3>
            <ul className="text-sm text-gray-700 space-y-3">
              <li>
                <strong>Recommended Apps:</strong> Install <strong>m-Indicator</strong> for real-time Mumbai local train schedules and platform numbers, and <strong>Mumbai 1 (Metro)</strong> app for digital Metro tickets.
              </li>
              <li>
                <strong>Avoid Local Train Peak Hours:</strong> Avoid boarding Mumbai suburban trains between 8:00 AM – 11:30 AM (southbound) and 4:30 PM – 9:30 PM (northbound) with heavy luggage.
              </li>
              <li>
                <strong>Check-in:</strong> Registration and check-in desk at GCC Hotel opens at 12:00 PM on Tuesday, Sep 29, 2026.
              </li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
