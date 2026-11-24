import React from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { getConferenceData } from '@/lib/conferenceStore';
import { useConference } from '@/context/ConferenceContext';
import FloatingNav from '@/components/FloatingNav';
import AnnouncementBanner from '@/components/AnnouncementBanner';
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

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  hero: Hero,
  about: About,
  theme: Theme,
  speakers: Speakers,
  schedule: Schedule,
  pricing: Pricing,
  books: Books,
  organisers: Organisers,
  gallery: Gallery,
  venue: Venue,
  faq: Faq,
  contact: Contact,
};

export default function Home() {
  const data = useConference();

  const sectionsList = Array.isArray(data.sections) && data.sections.length > 0
    ? data.sections
        .filter((s: any) => s.isEnabled)
        .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : null;

  return (
    <>
      <Head>
        <title>{`AIPC ${data.meta.year} – All India Pastors’ Conference`}</title>
        <meta
          name="description"
          content={`All India Pastors' Conference ${data.meta.year} - ${data.hero.subtitlePre}${data.hero.subtitleHighlight}${data.hero.subtitlePost}`}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      {/* Announcement Alert Banner */}
      <AnnouncementBanner />

      {/* Floating Side Nav */}
      <FloatingNav />

      {/* Transparent Header */}
      <Header />

      {/* Main Page Layout */}
      <main id="main">
        {sectionsList ? (
          sectionsList.map((sec: any) => {
            const Comp = SECTION_COMPONENTS[sec.key];
            if (!Comp) return null;
            const visibilityClass = !sec.desktopVisible
              ? 'md:hidden'
              : !sec.mobileVisible
              ? 'hidden md:block'
              : '';
            return (
              <div key={sec.key} className={visibilityClass || undefined}>
                <Comp />
              </div>
            );
          })
        ) : (
          <>
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
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  const data = await getConferenceData(true);
  return {
    props: {
      initialData: data,
    },
  };
};
