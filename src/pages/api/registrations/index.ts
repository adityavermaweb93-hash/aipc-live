import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getRegistrations,
  createRegistration,
  updateRegistration,
  deleteRegistration,
  getRegistrationStats,
} from '@/lib/registrationsStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: List all registrations + metrics
  if (req.method === 'GET') {
    const list = getRegistrations();
    const stats = getRegistrationStats();
    return res.status(200).json({ success: true, registrations: list, stats });
  }

  // POST: Admin manual attendee creation
  if (req.method === 'POST') {
    try {
      const body = req.body;
      if (!body.firstName || !body.email || !body.phone) {
        return res.status(400).json({ success: false, error: 'First name, email, and phone are required.' });
      }

      const created = createRegistration({
        year: body.year || '2026',
        firstName: body.firstName,
        lastName: body.lastName || '',
        email: body.email,
        phone: body.phone,
        age: body.age || '',
        gender: body.gender || 'Male',
        street: body.street || '',
        city: body.city || '',
        state: body.state || '',
        country: body.country || 'India',
        church: body.church || '',
        designation: body.designation || 'Pastor',
        planId: body.planId || 'triple',
        planTitle: body.planTitle || 'Triple Sharing',
        amount: Number(body.amount) || 5999,
        paymentStatus: body.paymentStatus || 'confirmed',
        paymentReference: body.paymentReference || '',
        notes: body.notes || 'Manually entered by admin.',
      });

      return res.status(201).json({ success: true, registration: created });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // PATCH: Update registration (status, payment, notes, etc.)
  if (req.method === 'PATCH') {
    try {
      const { id, updates } = req.body;
      if (!id || !updates) {
        return res.status(400).json({ success: false, error: 'Registration ID and updates are required.' });
      }

      const updated = updateRegistration(id, updates);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Registration not found' });
      }

      return res.status(200).json({ success: true, registration: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // DELETE: Remove registration
  if (req.method === 'DELETE') {
    try {
      const id = req.query.id as string || req.body?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Registration ID is required.' });
      }

      const deleted = deleteRegistration(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Registration not found' });
      }

      return res.status(200).json({ success: true, message: `Registration ${id} deleted.` });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
