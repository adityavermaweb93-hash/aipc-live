import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import {
  listEditions,
  getActiveEdition,
  getEditionByYearOrSlug,
  setActiveEdition,
  duplicateEdition,
} from '@/lib/editionService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Verify Admin authorization
  const auth = req.headers.authorization;
  if (auth !== 'Bearer AIPC@2025#Admin') {
    return res.status(401).json({ error: 'Unauthorized: valid Admin passkey required.' });
  }

  // 1. GET: List all editions or get single edition details
  if (req.method === 'GET') {
    try {
      const { id, year } = req.query;
      if (id || year) {
        const edition = await getEditionByYearOrSlug((id || year) as string);
        if (!edition) {
          return res.status(404).json({ success: false, error: 'Edition not found.' });
        }
        return res.status(200).json({ success: true, edition });
      }

      const editions = await listEditions();
      const active = await getActiveEdition();
      return res.status(200).json({
        success: true,
        editions,
        activeEditionId: active?.id || null,
        activeEditionYear: active?.year || null,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. POST: Create new edition OR duplicate existing edition
  if (req.method === 'POST') {
    try {
      const { action, sourceEditionId, year, title, city, venueName } = req.body;

      if (!year) {
        return res.status(400).json({ success: false, error: 'Conference year is required.' });
      }

      if (action === 'duplicate') {
        if (!sourceEditionId) {
          return res.status(400).json({ success: false, error: 'sourceEditionId is required to duplicate.' });
        }

        const duplicated = await duplicateEdition(
          sourceEditionId,
          year,
          title || `AIPC ${year}`,
          city || 'Mumbai',
          venueName || 'GCC Hotel & Club'
        );

        return res.status(201).json({
          success: true,
          message: `Edition AIPC ${year} duplicated successfully as Draft!`,
          edition: duplicated,
        });
      }

      // Create new edition from scratch
      const exists = await prisma.conferenceEdition.findUnique({ where: { year } });
      if (exists) {
        return res.status(400).json({ success: false, error: `Edition ${year} already exists.` });
      }

      const created = await prisma.conferenceEdition.create({
        data: {
          year,
          title: title || `AIPC ${year}`,
          slug: year,
          status: 'DRAFT',
          isActivePublic: false,
          themeTitle: 'Theme to be announced',
          themeSubtitle: 'Biblical Expositions',
          startDate: new Date(`${year}-10-01T12:00:00Z`),
          endDate: new Date(`${year}-10-03T15:00:00Z`),
          datesDisplay: `Dates to be announced, ${year}`,
          venueName: venueName || 'Convention Centre',
          venueCity: city || 'Mumbai',
          venueAddress: `${city || 'Mumbai'}, India`,
          targetCountdown: new Date(`${year}-10-01T14:00:00Z`),
          heroPreTitle: 'Organised By Equip Indian Churches',
          heroTagline: 'A Conference for Indian Churches by Indians.',
          sections: {
            create: [
              { sectionKey: 'hero', displayName: 'Hero Banner', sortOrder: 1 },
              { sectionKey: 'about', displayName: 'About Section', sortOrder: 2 },
              { sectionKey: 'theme', displayName: 'Theme & Scripture', sortOrder: 3 },
              { sectionKey: 'speakers', displayName: 'Speakers', sortOrder: 4 },
              { sectionKey: 'schedule', displayName: 'Programme Schedule', sortOrder: 5 },
              { sectionKey: 'pricing', displayName: 'Accommodation', sortOrder: 6 },
              { sectionKey: 'books', displayName: 'Free Books', sortOrder: 7 },
              { sectionKey: 'organisers', displayName: 'Organisers & Partners', sortOrder: 8 },
              { sectionKey: 'gallery', displayName: 'Photo Gallery', sortOrder: 9 },
              { sectionKey: 'venue', displayName: 'Venue & Directions', sortOrder: 10 },
              { sectionKey: 'faq', displayName: 'FAQs', sortOrder: 11 },
              { sectionKey: 'contact', displayName: 'Contact', sortOrder: 12 },
            ],
          },
        },
      });

      return res.status(201).json({
        success: true,
        message: `Draft edition AIPC ${year} created successfully!`,
        edition: created,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 3. PATCH: Switch active edition OR update status
  if (req.method === 'PATCH') {
    try {
      const { id, action, status, updates } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, error: 'Edition ID is required.' });
      }

      if (action === 'setActive') {
        await setActiveEdition(id);
        const updated = await prisma.conferenceEdition.findUnique({ where: { id } });
        return res.status(200).json({
          success: true,
          message: `AIPC ${updated?.year} is now the active published edition on the website!`,
          edition: updated,
        });
      }

      if (status) {
        const updated = await prisma.conferenceEdition.update({
          where: { id },
          data: { status },
        });
        return res.status(200).json({
          success: true,
          message: `Edition status changed to ${status}.`,
          edition: updated,
        });
      }

      if (updates) {
        const updated = await prisma.conferenceEdition.update({
          where: { id },
          data: updates,
        });
        return res.status(200).json({
          success: true,
          message: 'Edition details updated.',
          edition: updated,
        });
      }

      return res.status(400).json({ success: false, error: 'No valid action or status provided.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 4. DELETE: Archive or delete draft edition
  if (req.method === 'DELETE') {
    try {
      const id = (req.query.id as string) || req.body?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Edition ID is required.' });
      }

      const target = await prisma.conferenceEdition.findUnique({
        where: { id },
        include: { _count: { select: { registrations: true } } },
      });

      if (!target) {
        return res.status(404).json({ success: false, error: 'Edition not found.' });
      }

      if (target.isActivePublic) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete or archive the currently active published edition. Activate another edition first.',
        });
      }

      // If it has registrations, archive instead of deleting
      if (target._count.registrations > 0) {
        const archived = await prisma.conferenceEdition.update({
          where: { id },
          data: { status: 'ARCHIVED' },
        });
        return res.status(200).json({
          success: true,
          message: `Edition AIPC ${target.year} has existing registrations and has been archived safely.`,
          edition: archived,
        });
      }

      // Otherwise delete
      await prisma.conferenceEdition.delete({ where: { id } });
      return res.status(200).json({
        success: true,
        message: `Draft edition AIPC ${target.year} deleted.`,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
