import type { NextApiRequest, NextApiResponse } from 'next';
import { createRegistration } from '@/lib/registrationsStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      age,
      gender,
      street,
      street2,
      zip,
      city,
      state,
      country,
      church,
      designation,
      planId,
      planTitle,
      amount,
      year,
    } = req.body;

    if (!firstName || !email || !phone || !city) {
      return res.status(400).json({
        success: false,
        error: 'First name, email, phone number, and city are required fields.',
      });
    }

    const newRegistration = createRegistration({
      year: year || '2026',
      firstName,
      lastName: lastName || '',
      email,
      phone,
      age: age || '',
      gender: gender || 'Male',
      street: street || '',
      street2: street2 || '',
      zip: zip || '',
      city,
      state: state || '',
      country: country || 'India',
      church: church || '',
      designation: designation || 'Pastor',
      planId: planId || 'triple',
      planTitle: planTitle || 'Triple Sharing',
      amount: Number(amount) || 5999,
      paymentStatus: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Registration created successfully',
      registration: newRegistration,
    });
  } catch (err: any) {
    console.error('Registration API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
