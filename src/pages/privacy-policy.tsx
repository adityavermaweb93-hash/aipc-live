import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingNav from '@/components/FloatingNav';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy – AIPC 2026</title>
      </Head>

      <FloatingNav />
      <Header />

      <main className="bg-[#f9fafb] min-h-screen pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 p-8 sm:p-12 shadow-sm">
          <header className="mb-10 text-center border-b border-gray-100 pb-8">
            <span className="text-[#920b0b] text-xs font-black tracking-[0.3em] uppercase mb-2 block">
              PRIVACY &amp; DATA
            </span>
            <h1
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Privacy Policy – <span className="text-[#920b0b] italic">AIPC</span>
            </h1>
          </header>

          <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
            <h2 className="text-base font-bold text-gray-900">Who We Are</h2>
            <p>
              All India Pastors’ Conference (&ldquo;AIPC&rdquo;) has created its privacy statement in order to show its commitment to data privacy. Our website address is: <a href="https://aipc.live" className="text-[#920b0b] underline">https://aipc.live</a>.
            </p>

            <h2 className="text-base font-bold text-gray-900">Information We Collect</h2>
            <p>
              When participants register for the conference, subscribe to updates, or reach out via our contact form, we collect personal information such as full name, email address, phone number, address, and church affiliation. This information is used strictly to communicate conference logistical details, verify eligibility, confirm room accommodations, and provide relevant theological ministry resources.
            </p>

            <h2 className="text-base font-bold text-gray-900">Cookies &amp; Analytics</h2>
            <p>
              Our website may utilize standard session cookies to enhance navigation and measure aggregated anonymous site performance. No personal tracking data is sold or leased to third-party commercial vendors.
            </p>

            <h2 className="text-base font-bold text-gray-900">Data Security</h2>
            <p>
              We implement appropriate physical, technical, and managerial safeguards to protect your personal information against unauthorized disclosure, alteration, or misuse.
            </p>

            <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500">
              For any questions or data update requests, please write to us at <a href="mailto:info@aipc.live" className="text-[#920b0b] underline">info@aipc.live</a>.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
