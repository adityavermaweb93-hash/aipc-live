import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingNav from '@/components/FloatingNav';

interface ArchiveEdition {
  id: string;
  year: string;
  title: string;
  slug: string;
  status: string;
  isActivePublic: boolean;
  themeTitle: string;
  themeSubtitle?: string | null;
  themeReference?: string | null;
  venueCity: string;
  venueName: string;
  datesDisplay: string;
  heroBgImageUrl?: string | null;
  registrationCount: number;
}

interface ArchiveProps {
  editions: ArchiveEdition[];
}

export default function ArchivePage({ editions }: ArchiveProps) {
  return (
    <>
      <Head>
        <title>Historical Archives – All India Pastors’ Conference</title>
        <meta
          name="description"
          content="Explore past editions of the All India Pastors' Conference: themes, scriptures, speakers, and historical archives from 2019 to the present."
        />
      </Head>

      <FloatingNav />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
        {/* Hero Section */}
        <div className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center border-b border-white/10">
          <span className="text-[#cc0000] text-xs font-bold tracking-[0.2em] uppercase block mb-3">
            HERITAGE &amp; FELLOWSHIP
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 font-serif">
            Conference <span className="text-[#cc0000] italic">Archives</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            By God&apos;s grace, the All India Pastors&apos; Conference has brought together hundreds of pastors and church leaders from across India to sit under faithful preaching, pray for one another, and build biblical church fellowships.
          </p>
        </div>

        {/* Editions Grid & Timeline */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {editions.map((ed) => (
              <div
                key={ed.id}
                className="bg-[#141414] border border-white/10 rounded-sm overflow-hidden hover:border-[#cc0000] transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Card Header Image / Banner */}
                  <div className="h-44 bg-gradient-to-br from-[#2a0808] to-[#121212] relative overflow-hidden flex items-center justify-center p-6">
                    {ed.heroBgImageUrl ? (
                      <img
                        src={ed.heroBgImageUrl}
                        alt={ed.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : null}
                    <div className="relative z-10 text-center">
                      <span className="text-4xl font-extrabold tracking-tight text-white block">
                        {ed.year}
                      </span>
                      <span className="text-xs uppercase tracking-widest text-[#dba617] font-semibold">
                        {ed.venueCity}
                      </span>
                    </div>

                    {ed.isActivePublic && (
                      <span className="absolute top-3 right-3 bg-[#00a32a] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Active Published
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[11px] font-bold text-[#cc0000] uppercase tracking-wider block mb-1">
                        Theme Expositions
                      </span>
                      <h3 className="text-xl font-bold text-white leading-snug group-hover:text-[#dba617] transition-colors">
                        &ldquo;{ed.themeTitle}&rdquo;
                      </h3>
                      {ed.themeSubtitle && (
                        <p className="text-xs text-gray-400 mt-1 italic">
                          {ed.themeSubtitle}
                        </p>
                      )}
                      {ed.themeReference && (
                        <p className="text-[11px] text-[#dba617] font-mono mt-0.5">
                          {ed.themeReference}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-gray-400 space-y-1.5 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Dates:</span>
                        <span className="text-gray-300 font-medium">{ed.datesDisplay}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Location:</span>
                        <span className="text-gray-300 font-medium">
                          {ed.venueName}, {ed.venueCity}
                        </span>
                      </div>
                      {ed.registrationCount > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Delegates:</span>
                          <span className="text-gray-300 font-medium">
                            {ed.registrationCount}+ Attendees
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 pt-0">
                  <Link
                    href={`/editions/${ed.year}`}
                    className="block w-full text-center bg-white/5 hover:bg-[#cc0000] text-white font-semibold text-xs py-2.5 rounded-sm border border-white/10 hover:border-transparent transition-all"
                  >
                    View Edition Archive &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Historical Books Heritage Section */}
          <div className="mt-20 p-8 bg-[#141414] border border-white/10 text-center rounded-sm">
            <span className="text-xs text-[#cc0000] font-bold tracking-widest uppercase block mb-2">
              MINISTRY RESOURCES
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 font-serif">
              Complimentary Books Heritage (2019 – Present)
            </h2>
            <p className="text-xs text-gray-400 max-w-xl mx-auto mb-6">
              Over the years, hundreds of theological works, study bibles, and pastoral ministry volumes have been gifted to attending pastors to strengthen gospel preaching in local churches.
            </p>
            <Link
              href="/#book"
              className="inline-block bg-[#cc0000] hover:bg-[#aa0000] text-white font-bold text-xs py-2.5 px-6 transition-colors shadow-lg"
            >
              Browse Complimentary Books &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');

  try {
    const records = await prisma.conferenceEdition.findMany({
      orderBy: { year: 'desc' },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    const editions: ArchiveEdition[] = records.map((r) => ({
      id: r.id,
      year: r.year,
      title: r.title,
      slug: r.slug,
      status: r.status,
      isActivePublic: r.isActivePublic,
      themeTitle: r.themeTitle,
      themeSubtitle: r.themeSubtitle,
      themeReference: r.themeReference,
      venueCity: r.venueCity,
      venueName: r.venueName,
      datesDisplay: r.datesDisplay,
      heroBgImageUrl: r.heroBgImageUrl,
      registrationCount: r._count.registrations,
    }));

    return {
      props: {
        editions,
      },
    };
  } catch (err) {
    console.error('Archive page error:', err);
    return {
      props: {
        editions: [],
      },
    };
  }
};
