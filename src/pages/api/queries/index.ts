import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getQueries,
  updateQuery,
  deleteQuery,
  getQueryStats,
} from '@/lib/queriesStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: Return all queries + stats
  if (req.method === 'GET') {
    const queries = getQueries();
    const stats = getQueryStats();
    return res.status(200).json({ success: true, queries, stats });
  }

  // PATCH: Update query status, reply notes, etc.
  if (req.method === 'PATCH') {
    try {
      const { id, updates } = req.body;
      if (!id || !updates) {
        return res.status(400).json({ success: false, error: 'Query ID and updates are required.' });
      }

      // If marking as replied, auto-set repliedAt timestamp
      if (updates.status === 'replied' && !updates.repliedAt) {
        updates.repliedAt = new Date().toISOString();
      }

      const updated = updateQuery(id, updates);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Query not found' });
      }

      return res.status(200).json({ success: true, query: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // DELETE: Remove query
  if (req.method === 'DELETE') {
    try {
      const id = (req.query.id as string) || req.body?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Query ID is required.' });
      }

      const deleted = deleteQuery(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Query not found' });
      }

      return res.status(200).json({ success: true, message: `Query ${id} deleted.` });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
