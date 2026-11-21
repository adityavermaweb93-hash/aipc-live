import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminSession } from '@/lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAdminSession(req, res);
  session.destroy();
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
}
