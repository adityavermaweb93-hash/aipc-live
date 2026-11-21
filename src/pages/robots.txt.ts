import { GetServerSideProps } from 'next';

export default function Robots() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=172800');

  const content = `# AIPC Platform Robots Configuration
User-agent: *
Allow: /
Allow: /archive
Allow: /editions/
Disallow: /admin
Disallow: /admin/
Disallow: /preview/
Disallow: /api/

Sitemap: https://aipc.live/sitemap.xml
`;

  res.write(content);
  res.end();

  return { props: {} };
};
