import type { NextApiRequest, NextApiResponse } from 'next';
import { resetConferenceData, getConferenceData } from '@/lib/conferenceStore';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const result = resetConferenceData();
  if (result.success) {
    return res.status(200).json({ success: true, data: getConferenceData() });
  } else {
    return res.status(500).json({ success: false, error: result.error });
  }
}
