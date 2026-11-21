import React, { useState } from 'react';

interface FooterTabProps {
  data: any;
  setData: (data: any) => void;
  onUpload: (fieldKey: string, callback: (url: string) => void) => void;
  uploadingField: string | null;
}

export default function FooterTab({ data, setData, onUpload, uploadingField }: FooterTabProps) {
  const footer = data.footer || {
    bgImage: '/assets/red-grunge.svg',
    links: [],
  };

  const [newLink, setNewLink] = useState({ label: '', href: '' });

  const updateFooter = (fields: any) => {
    setData({
      ...data,
      footer: {
        ...footer,
        ...fields,
      },
    });
  };

  const handleAddLink = () => {
    if (!newLink.label.trim() || !newLink.href.trim()) return;
    const links = [...(footer.links || []), { ...newLink }];
    updateFooter({ links });
    setNewLink({ label: '', href: '' });
  };

  const handleRemoveLink = (index: number) => {
    const links = (footer.links || []).filter((_: any, i: number) => i !== index);
    updateFooter({ links });
  };

  return (
    <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-6">
      <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2 flex items-center justify-between">
        <span>Footer &amp; Legal Policies Configuration</span>
        <span className="text-[11px] font-normal text-gray-500">Manage bottom copyright banner, grunge backdrop &amp; legal links</span>
      </h2>

      {/* Background Graphic */}
      <div className="p-4 bg-[#f8f9fa] border border-[#e2e4e7] space-y-3">
        <label className="block text-xs font-bold text-[#1d2327]">
          Footer Background Texture / Image
        </label>
        <div className="flex items-center gap-3">
          <div className="w-20 h-14 bg-black rounded border border-gray-600 flex items-center justify-center p-1 shrink-0 overflow-hidden">
            {footer.bgImage ? (
              <img src={footer.bgImage} alt="Footer BG" className="max-h-full max-w-full object-cover" />
            ) : (
              <span className="text-[10px] text-gray-400">None</span>
            )}
          </div>
          <div className="flex-1 space-y-1.5">
            <input
              type="text"
              value={footer.bgImage || ''}
              onChange={(e) => updateFooter({ bgImage: e.target.value })}
              placeholder="/assets/red-grunge.svg"
              className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() =>
                onUpload('footerBg', (url) => {
                  updateFooter({ bgImage: url });
                })
              }
              disabled={uploadingField === 'footerBg'}
              className="bg-[#f0f0f1] hover:bg-[#e0e0e1] border border-[#8c8f94] text-xs font-semibold px-2.5 py-1 rounded"
            >
              {uploadingField === 'footerBg' ? 'Uploading...' : '📁 Upload Background SVG / Texture'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Navigation & Policy Links */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">
            Footer Quick Links &amp; Compliance Pages
          </h3>
          <span className="text-xs text-gray-500">{(footer.links || []).length} links</span>
        </div>

        <div className="border border-[#c3c4c7] overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327] font-semibold">
                <th className="p-2 w-12 text-center">#</th>
                <th className="p-2 w-1/3">Policy / Link Name</th>
                <th className="p-2">Target URL</th>
                <th className="p-2 w-20 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(footer.links || []).map((link: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 text-center text-gray-400 font-mono">{idx + 1}</td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={link.label || ''}
                      onChange={(e) => {
                        const updated = [...footer.links];
                        updated[idx].label = e.target.value;
                        updateFooter({ links: updated });
                      }}
                      className="w-full bg-white border border-gray-300 p-1 text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={link.href || ''}
                      onChange={(e) => {
                        const updated = [...footer.links];
                        updated[idx].href = e.target.value;
                        updateFooter({ links: updated });
                      }}
                      className="w-full bg-white border border-gray-300 p-1 text-xs font-mono"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(idx)}
                      className="text-[#d63638] hover:text-[#b32d2e] font-semibold text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Footer Link Bar */}
          <div className="bg-[#f8f9fa] p-2.5 border-t border-[#c3c4c7] flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-700">Add Link:</span>
            <input
              type="text"
              placeholder="Link Title (e.g. Code of Conduct)"
              value={newLink.label}
              onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
              className="bg-white border border-[#8c8f94] p-1.5 text-xs w-44"
            />
            <input
              type="text"
              placeholder="URL (e.g. /conduct)"
              value={newLink.href}
              onChange={(e) => setNewLink({ ...newLink, href: e.target.value })}
              className="bg-white border border-[#8c8f94] p-1.5 text-xs font-mono flex-1 min-w-[150px]"
            />
            <button
              type="button"
              onClick={handleAddLink}
              className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-3 py-1.5 shadow-xs"
            >
              + Add Footer Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
