import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';

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
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

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

    // 1. Upload to persistent Vercel Blob if token available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const mime =
          ext === '.png'
            ? 'image/png'
            : ext === '.webp'
            ? 'image/webp'
            : ext === '.svg'
            ? 'image/svg+xml'
            : 'image/jpeg';

        const blob = await put(`uploads/${safeFilename}`, buffer, {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: mime,
        });

        return res.status(200).json({ success: true, url: blob.url, filename: safeFilename });
      } catch (blobErr: any) {
        console.error('Blob upload error, falling back to local/tmp:', blobErr);
      }
    }

    // 2. Local disk fallback
    const filePath = path.join(UPLOAD_DIR, safeFilename);
    try {
      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/${safeFilename}`;
      return res.status(200).json({ success: true, url: publicUrl, filename: safeFilename });
    } catch (fsErr: any) {
      // In read-only serverless environment (Vercel), store in /tmp or return data URI
      try {
        const tmpPath = path.join('/tmp', safeFilename);
        fs.writeFileSync(tmpPath, buffer);
      } catch (tmpErr) {}
      const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.svg' ? 'image/svg+xml' : 'image/jpeg';
      const dataUri = `data:${mime};base64,${base64Data}`;
      return res.status(200).json({ success: true, url: dataUri, filename: safeFilename });
    }
  } catch (err: any) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
