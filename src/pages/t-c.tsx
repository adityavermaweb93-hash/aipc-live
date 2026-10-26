import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingNav from '@/components/FloatingNav';

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Conference Terms &amp; Conditions – AIPC 2026</title>
      </Head>

      <FloatingNav />
      <Header />

      <main className="bg-[#f9fafb] min-h-screen pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 p-8 sm:p-12 shadow-sm">
          <header className="mb-10 text-center border-b border-gray-100 pb-8">
            <span className="text-[#920b0b] text-xs font-black tracking-[0.3em] uppercase mb-2 block">
              TERMS OF REGISTRATION
            </span>
            <h1
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Terms &amp; Conditions – <span className="text-[#920b0b] italic">AIPC</span>
            </h1>
          </header>

          <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
            <h2 className="text-base font-bold text-gray-900">AIPC 2026 Conference Terms &amp; Conditions</h2>
            <ul className="space-y-4 list-disc list-inside">
              <li>
                This is a conference for men who are pastors of local churches or who aspire to pastoral ministry.
              </li>
              <li>
                This conference is in English so we expect our participants to be fluent in English.
              </li>
              <li>
                This is a conference by Protestant Evangelicals from the Reformed tradition.
              </li>
              <li>
                We reserve the right to cancel the registration and refund the registration fee if we find any of the information submitted by the registrant is untrue or misleading.
              </li>
              <li>
                Someone from AIPC will contact you within a week to confirm your registration.
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">Clarifications &amp; Inquiries:</h3>
              <p>Email: <a href="mailto:info@aipc.live" className="text-[#920b0b] underline">info@aipc.live</a></p>
              <p>Call Support: +91 98867 69948, +91 89700 65890</p>
              <p className="mt-2 text-xs text-gray-500">If you have any concerns or require clarification, please do not hesitate to contact us.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
