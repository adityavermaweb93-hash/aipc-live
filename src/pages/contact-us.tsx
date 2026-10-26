import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingNav from '@/components/FloatingNav';
import Contact from '@/components/Contact';

export default function ContactUsPage() {
  return (
    <>
      <Head>
        <title>Contact Us – All India Pastors’ Conference</title>
      </Head>

      <FloatingNav />
      <Header />

      <main className="pt-24 bg-[#FDFCFB]">
        <Contact />
      </main>

      <Footer />
    </>
  );
}
