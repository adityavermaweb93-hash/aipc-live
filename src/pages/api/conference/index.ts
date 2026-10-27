import type { NextApiRequest, NextApiResponse } from 'next';
import { getConferenceData, saveConferenceData } from '@/lib/conferenceStore';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'GET') {
    const data = getConferenceData();
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    const body = req.body;
    if (!body || !body.data) {
      return res.status(400).json({ success: false, error: 'Invalid payload: missing data field' });
    }

    const result = saveConferenceData(body.data);
    if (result.success) {
      return res.status(200).json({ success: true, data: body.data });
    } else {
      return res.status(500).json({ success: false, error: result.error });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
