import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem in serverless environments
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { filename, data } = req.body;

    if (!filename || !data) {
      return res.status(400).json({ success: false, error: 'Filename and base64 data are required.' });
    }

    // Strip out base64 prefix if present
    const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Clean filename
    const ext = path.extname(filename) || '.jpg';
    const base = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFilename = `${Date.now()}_${base}${ext}`;
    const filePath = path.join(UPLOAD_DIR, safeFilename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;
    return res.status(200).json({ success: true, url: publicUrl, filename: safeFilename });
  } catch (err: any) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
