import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getActiveEdition } from '@/lib/editionService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

  try {
    const active = await getActiveEdition();
    if (!active) {
      return res.status(200).json({ success: true, announcements: [] });
    }

    const now = new Date();

    const announcements = await prisma.announcement.findMany({
      where: {
        editionId: active.id,
        isPublished: true,
        AND: [
          { OR: [{ publishAt: null }, { publishAt: { lte: now } }] },
          { OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] },
        ],
      },
      orderBy: { sortOrder: 'asc' },
      take: 5,
    });

    return res.status(200).json({
      success: true,
      announcements: announcements.map((a) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        badgeText: a.badgeText || 'Notice',
        actionUrl: a.actionUrl,
        actionLabel: a.actionLabel,
      })),
    });
  } catch (err: any) {
    return res.status(200).json({ success: true, announcements: [] });
  }
}
