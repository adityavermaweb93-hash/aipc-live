import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import { getEditionByYearOrSlug, formatEditionToConferenceData } from '@/lib/editionService';
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

interface EditionPageProps {
  initialData: any;
  year: string;
  isArchive: boolean;
}

export default function EditionPage({ year, isArchive }: EditionPageProps) {
  const data = useConference();

  return (
    <>
      <Head>
        <title>{`AIPC ${year} – All India Pastors’ Conference`}</title>
        <meta
          name="description"
          content={`All India Pastors' Conference ${year} – ${data.hero.subtitlePre}${data.hero.subtitleHighlight}${data.hero.subtitlePost}`}
        />
      </Head>

      {/* Top Banner when viewing historical or non-default editions */}
      <div className="bg-[#1d2327] text-white text-xs py-2.5 px-4 sticky top-0 z-[100000] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-[#dba617] text-black font-bold px-2 py-0.5 rounded text-[10px] uppercase">
            {isArchive ? 'Historical Archive' : 'Conference Edition'}
          </span>
          <span>
            You are viewing the archived archive for <strong>AIPC {year}</strong>.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/archive"
            className="text-gray-300 hover:text-white underline text-xs"
          >
            All Archives
          </Link>
          <Link
            href="/"
            className="bg-[#cc0000] hover:bg-[#aa0000] text-white font-bold px-3 py-1 text-xs transition-colors"
          >
            Current AIPC Website &rarr;
          </Link>
        </div>
      </div>

      {/* Floating Side Nav */}
      <FloatingNav />

      {/* Transparent Header */}
      <Header />

      {/* Main Page Layout */}
      <main id="main">
        <Hero />
        <About />
        <Theme />
        <Speakers />
        <Schedule />
        <Pricing />
        <Books />
        <Organisers />
        <Gallery />
        <Venue />
        <Faq />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  const year = params?.year as string;

  if (!year) {
    return { notFound: true };
  }

  const edition = await getEditionByYearOrSlug(year);
  if (!edition) {
    return { notFound: true };
  }

  const formatted = formatEditionToConferenceData(edition);
  if (!formatted) {
    return { notFound: true };
  }

  return {
    props: {
      initialData: formatted,
      year: edition.year,
      isArchive: !edition.isActivePublic,
    },
  };
};
