import React from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { getConferenceData } from '@/lib/conferenceStore';
import { useConference } from '@/context/ConferenceContext';
import FloatingNav from '@/components/FloatingNav';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Theme from '@/components/Theme';
import Speakers from '@/components/Speakers';
import Schedule from '@/components/Schedule';
import Pricing from '@/components/Pricing';
import Books from '@/components/Books';
import Organisers from '@/components/Organisers';
import Gallery from '@/components/Gallery';
import Venue from '@/components/Venue';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const data = useConference();

  return (
    <>
      <Head>
        <title>{`AIPC ${data.meta.year} – All India Pastors’ Conference`}</title>
        <meta
          name="description"
          content={`All India Pastors' Conference ${data.meta.year} - ${data.hero.subtitlePre}${data.hero.subtitleHighlight}${data.hero.subtitlePost}`}
        />
      </Head>

      {/* Floating Side Nav */}
      <FloatingNav />

      {/* Transparent Header */}
      <Header />

      {/* Main Page Layout */}
      <main id="main">
        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

        {/* Theme Section */}
        <Theme />

        {/* Speakers Section */}
        <Speakers />

        {/* Schedule Section */}
        <Schedule />

        {/* Accommodation / Pricing Section */}
        <Pricing />

        {/* Free Books Section */}
        <Books />

        {/* Organisers & Partners Section */}
        <Organisers />

        {/* Gallery Section */}
        <Gallery />

        {/* Venue Section */}
        <Venue />

        {/* FAQ Section */}
        <Faq />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  const data = getConferenceData();
  return {
    props: {
      initialData: data,
    },
  };
};
