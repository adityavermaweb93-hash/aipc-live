import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getActiveEdition } from '@/lib/editionService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

  try {
    const active = await getActiveEdition();
    const now = new Date();

    const announcements = await prisma.announcement.findMany({
      where: {
        isPublished: true,
        OR: [
          { editionId: active?.id },
          { editionId: null },
        ],
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return res.status(200).json({ success: true, announcements });
  } catch (err: any) {
    return res.status(200).json({ success: true, announcements: [] });
  }
}
