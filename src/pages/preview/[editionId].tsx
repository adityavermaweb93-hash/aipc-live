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

interface PreviewPageProps {
  initialData: any;
  editionTitle: string;
  editionStatus: string;
}

export default function PreviewPage({ editionTitle, editionStatus }: PreviewPageProps) {
  const data = useConference();

  return (
    <>
      <Head>
        <title>{`[PREVIEW MODE] ${editionTitle} – AIPC`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Draft Preview Bar */}
      <div className="bg-[#dba617] text-black text-xs py-2 px-4 sticky top-0 z-[100000] border-b border-black/20 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <span className="bg-black text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase">
            ADMIN PREVIEW MODE ({editionStatus})
          </span>
          <span>
            You are previewing <strong>{editionTitle}</strong> before public release.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="bg-black text-white hover:bg-gray-800 font-bold px-3 py-1 text-xs"
          >
            &larr; Back to Admin Panel
          </Link>
        </div>
      </div>

      <FloatingNav />
      <Header />
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
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  const editionId = params?.editionId as string;

  if (!editionId) {
    return { notFound: true };
  }

  const edition = await getEditionByYearOrSlug(editionId);
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
      editionTitle: edition.title,
      editionStatus: edition.status,
    },
  };
};
