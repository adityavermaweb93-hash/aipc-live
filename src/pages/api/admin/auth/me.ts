import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminSession } from '@/lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  const session = await getAdminSession(req, res);

  if (!session.user) {
    return res.status(200).json({
      authenticated: false,
      user: null,
    });
  }

  return res.status(200).json({
    authenticated: true,
    user: session.user,
  });
}
