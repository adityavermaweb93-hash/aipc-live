import { GetServerSideProps } from 'next';
import prisma from '@/lib/prisma';

export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');

  const baseUrl = 'https://aipc.live';

  let editions: { year: string; updatedAt: Date }[] = [];
  try {
    editions = await prisma.conferenceEdition.findMany({
      where: { status: { in: ['PUBLISHED', 'ARCHIVED'] } },
      select: { year: true, updatedAt: true },
    });
  } catch (e) {}

  const staticPages = [
    '',
    '/archive',
    '/partners',
    '/faqs',
    '/contact-us',
    '/privacy-policy',
    '/t-c',
    '/cancellations-refunds',
    '/travel-instruction',
  ];

  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map((path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${path === '' ? 'daily' : 'monthly'}</changefreq>
    <priority>${path === '' ? '1.0' : '0.7'}</priority>
  </url>`)
    .join('')}
  ${editions
    .map(
      (ed) => `
  <url>
    <loc>${baseUrl}/editions/${ed.year}</loc>
    <lastmod>${new Date(ed.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  res.write(xml);
  res.end();

  return { props: {} };
};
