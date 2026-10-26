import type { NextApiRequest, NextApiResponse } from 'next';
import { createQuery } from '@/lib/queriesStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required fields.',
      });
    }

    const query = createQuery({
      name,
      email,
      phone: phone || '',
      message,
    });

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our team will get back to you shortly.',
      queryId: query.id,
    });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
