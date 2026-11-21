import React, { useState } from 'react';

interface MediaTabProps {
  onUpload: (fieldKey: string, callback: (url: string) => void) => void;
  uploadingField: string | null;
  uploadedMedia: { name: string; url: string; time: string }[];
}

export default function MediaTab({ onUpload, uploadingField, uploadedMedia }: MediaTabProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 3000);
  };

  return (
    <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-6">
      <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2 flex items-center justify-between">
        <span>Media Uploader &amp; Asset Library</span>
        <span className="text-[11px] font-normal text-gray-500">Upload conference images and copy their direct URLs</span>
      </h2>

      {/* Main Upload Dropzone */}
      <div className="border-2 border-dashed border-[#2271b1] p-8 text-center bg-[#f0f6fc] rounded space-y-3">
        <div className="text-3xl">📤</div>
        <div>
          <h3 className="text-sm font-bold text-[#1d2327]">Upload New Image or Graphic Asset</h3>
          <p className="text-xs text-gray-600 mt-1">
            Supports PNG, JPG, WebP, SVG (Hero backdrops, book covers, sponsor logos, gallery photos)
          </p>
        </div>
        <button
          type="button"
          onClick={() => onUpload('mediaHub', () => {})}
          disabled={uploadingField === 'mediaHub'}
          className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold py-2 px-5 rounded shadow-sm inline-flex items-center gap-2"
        >
          {uploadingField === 'mediaHub' ? (
            <span>Uploading Asset...</span>
          ) : (
            <>
              <span>📁</span>
              <span>Select File from Computer</span>
            </>
          )}
        </button>
      </div>

      {/* Uploaded Assets In Session */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">
            Uploaded Media Items ({uploadedMedia.length})
          </h3>
          <span className="text-[11px] text-gray-500">Click "Copy URL" to paste into any section or input field</span>
        </div>

        {uploadedMedia.length === 0 ? (
          <div className="border border-gray-200 p-8 text-center bg-gray-50 text-xs text-gray-500 rounded">
            No assets uploaded in this session yet. Use the upload button above to upload files.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedMedia.map((item, idx) => (
              <div key={idx} className="border border-gray-300 bg-white p-3 rounded shadow-xs space-y-2">
                <div className="h-32 bg-gray-900 rounded overflow-hidden flex items-center justify-center p-1">
                  <img src={item.url} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-800 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-gray-400">Uploaded at {item.time}</p>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    readOnly
                    value={item.url}
                    className="flex-1 bg-gray-50 border border-gray-300 p-1 text-[11px] font-mono text-gray-600 truncate"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded shrink-0 transition-colors ${
                      copiedUrl === item.url
                        ? 'bg-green-600 text-white'
                        : 'bg-[#f0f0f1] hover:bg-[#e0e0e1] border border-gray-400 text-gray-800'
                    }`}
                  >
                    {copiedUrl === item.url ? '✓ Copied!' : 'Copy URL'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
