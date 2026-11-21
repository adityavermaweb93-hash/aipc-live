import type { NextApiRequest, NextApiResponse } from 'next';
import { resetConferenceData, getConferenceData } from '@/lib/conferenceStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const result = await resetConferenceData();
  if (result.success) {
    const data = await getConferenceData();
    return res.status(200).json({ success: true, data });
  } else {
    return res.status(500).json({ success: false, error: result.error });
  }
}
