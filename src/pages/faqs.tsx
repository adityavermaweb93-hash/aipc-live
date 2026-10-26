import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingNav from '@/components/FloatingNav';
import Faq from '@/components/Faq';

export default function FaqsPage() {
  return (
    <>
      <Head>
        <title>Frequently Asked Questions – AIPC 2026</title>
      </Head>

      <FloatingNav />
      <Header />

      <main className="pt-20 bg-black min-h-screen">
        <Faq />
      </main>

      <Footer />
    </>
  );
}
