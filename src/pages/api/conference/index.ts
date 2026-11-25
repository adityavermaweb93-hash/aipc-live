import type { NextApiRequest, NextApiResponse } from 'next';
import { getConferenceData, saveConferenceData } from '@/lib/conferenceStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  if (req.method === 'HEAD') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const data = await getConferenceData();
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    const body = req.body;
    if (!body || !body.data) {
      return res.status(400).json({ success: false, error: 'Invalid payload: missing data field' });
    }

    const result = await saveConferenceData(body.data);
    if (result.success) {
      try {
        await res.revalidate('/');
        if (body.data.meta?.year) {
          await res.revalidate(`/editions/${body.data.meta.year}`);
        }
      } catch (_) {}
      return res.status(200).json({ success: true, data: body.data });
    } else {
      return res.status(500).json({ success: false, error: result.error });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'HEAD']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
