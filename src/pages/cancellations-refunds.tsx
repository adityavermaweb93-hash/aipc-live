import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingNav from '@/components/FloatingNav';

export default function CancellationPolicy() {
  return (
    <>
      <Head>
        <title>Cancellations &amp; Refunds – AIPC 2026</title>
      </Head>

      <FloatingNav />
      <Header />

      <main className="bg-[#f9fafb] min-h-screen pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 p-8 sm:p-12 shadow-sm">
          <header className="mb-10 text-center border-b border-gray-100 pb-8">
            <span className="text-[#920b0b] text-xs font-black tracking-[0.3em] uppercase mb-2 block">
              POLICY
            </span>
            <h1
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Cancellation Policy – <span className="text-[#920b0b] italic">AIPC</span>
            </h1>
          </header>

          <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
            <p>
              We understand that plans can change unexpectedly. If you need to cancel your conference registration, please follow the procedure below:
            </p>

            <div className="bg-gray-50 border border-gray-200 p-6 space-y-4">
              <h2 className="text-base font-bold text-gray-900">How to Cancel:</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>Write to us:</strong> Send an email to{' '}
                  <a href="mailto:info@aipc.live" className="text-[#920b0b] underline font-medium">
                    info@aipc.live
                  </a>{' '}
                  with your full name, registered email, and transaction/reference number.
                </li>
                <li>
                  <strong>Call Support:</strong> +91 89700 65890, +91 98867 69948
                </li>
              </ul>
            </div>

            <p>
              Refund requests will be reviewed by the organizing committee in accordance with conference policy. Due to pre-booked hotel accommodation and food guarantees, refund amounts depend on the timing of your cancellation request relative to the conference start date.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
