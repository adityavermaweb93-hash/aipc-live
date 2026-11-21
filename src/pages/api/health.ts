import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const hasDbUrl = !!process.env.DATABASE_URL;
  const dbHost = process.env.PGHOST || (process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL.replace('postgres://', 'http://').replace('postgresql://', 'http://')).hostname : null);
  
  return res.status(200).json({
    status: 'ok',
    hasDbUrl,
    dbHost,
    hasPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
  });
}
