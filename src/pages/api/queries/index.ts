import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getQueriesAsync,
  updateQuery,
  deleteQuery,
  getQueryStats,
} from '@/lib/queriesStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  if (req.method === 'HEAD') {
    return res.status(200).end();
  }

  // GET: Return all queries + stats
  if (req.method === 'GET') {
    const queries = await getQueriesAsync();
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

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE', 'HEAD']);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
