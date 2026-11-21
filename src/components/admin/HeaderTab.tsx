import React, { useState } from 'react';

interface HeaderTabProps {
  data: any;
  setData: (data: any) => void;
  onUpload: (fieldKey: string, callback: (url: string) => void) => void;
  uploadingField: string | null;
}

export default function HeaderTab({ data, setData, onUpload, uploadingField }: HeaderTabProps) {
  const header = data.header || {
    logo: '/assets/AIPC-White-1.png',
    navLinks: [],
    donationBtn: { label: 'Donation', href: '/Donation' },
    floatingMenu: [],
  };

  const [newNavLink, setNewNavLink] = useState({ label: '', href: '' });
  const [newFloatingItem, setNewFloatingItem] = useState({ label: '', href: '', mobileOnly: false });

  const updateHeader = (fields: any) => {
    setData({
      ...data,
      header: {
        ...header,
        ...fields,
      },
    });
  };

  const handleAddNavLink = () => {
    if (!newNavLink.label.trim() || !newNavLink.href.trim()) return;
    const navLinks = [...(header.navLinks || []), { ...newNavLink }];
    updateHeader({ navLinks });
    setNewNavLink({ label: '', href: '' });
  };

  const handleRemoveNavLink = (index: number) => {
    const navLinks = (header.navLinks || []).filter((_: any, i: number) => i !== index);
    updateHeader({ navLinks });
  };

  const handleAddFloatingItem = () => {
    if (!newFloatingItem.label.trim() || !newFloatingItem.href.trim()) return;
    const floatingMenu = [...(header.floatingMenu || []), { ...newFloatingItem }];
    updateHeader({ floatingMenu });
    setNewFloatingItem({ label: '', href: '', mobileOnly: false });
  };

  const handleRemoveFloatingItem = (index: number) => {
    const floatingMenu = (header.floatingMenu || []).filter((_: any, i: number) => i !== index);
    updateHeader({ floatingMenu });
  };

  return (
    <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-6">
      <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2 flex items-center justify-between">
        <span>Header, Navigation &amp; Donation Controls</span>
        <span className="text-[11px] font-normal text-gray-500">Affects top sticky bar and right floating navigation</span>
      </h2>

      {/* Logo & Donation Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#f8f9fa] border border-[#e2e4e7]">
        {/* Logo Configuration */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#1d2327]">
            Header Logo Image
          </label>
          <div className="flex items-center gap-3">
            <div className="w-24 h-12 bg-[#1d2327] rounded border border-gray-600 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
              {header.logo ? (
                <img src={header.logo} alt="Header Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-[10px] text-gray-400">No Logo</span>
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <input
                type="text"
                value={header.logo || ''}
                onChange={(e) => updateHeader({ logo: e.target.value })}
                placeholder="/assets/AIPC-White-1.png"
                className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs font-mono focus:border-[#2271b1] focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  onUpload('headerLogo', (url) => {
                    updateHeader({ logo: url });
                  })
                }
                disabled={uploadingField === 'headerLogo'}
                className="bg-[#f0f0f1] hover:bg-[#e0e0e1] border border-[#8c8f94] text-[#2c3338] text-xs font-semibold px-2.5 py-1 rounded shadow-xs"
              >
                {uploadingField === 'headerLogo' ? 'Uploading...' : '📁 Upload New Logo'}
              </button>
            </div>
          </div>
        </div>

        {/* Donation Button Settings */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#1d2327]">
            Header CTA Button (Donation / Register)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-semibold text-gray-600 block mb-1">Button Label</span>
              <input
                type="text"
                value={header.donationBtn?.label || ''}
                onChange={(e) =>
                  updateHeader({
                    donationBtn: { ...(header.donationBtn || {}), label: e.target.value },
                  })
                }
                placeholder="Donation"
                className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs focus:border-[#2271b1] focus:outline-none"
              />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-gray-600 block mb-1">Destination URL</span>
              <input
                type="text"
                value={header.donationBtn?.href || ''}
                onChange={(e) =>
                  updateHeader({
                    donationBtn: { ...(header.donationBtn || {}), href: e.target.value },
                  })
                }
                placeholder="/Donation or https://..."
                className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs font-mono focus:border-[#2271b1] focus:outline-none"
              />
            </div>
          </div>
          <p className="text-[11px] text-gray-500">
            Tip: You can point this to your payment gateway or external partner page.
          </p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">
            Main Desktop Header Navigation Links
          </h3>
          <span className="text-xs text-gray-500">{(header.navLinks || []).length} active links</span>
        </div>

        <div className="border border-[#c3c4c7] overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327] font-semibold">
                <th className="p-2 w-12 text-center">#</th>
                <th className="p-2 w-1/3">Link Label</th>
                <th className="p-2">Target Anchor or URL</th>
                <th className="p-2 w-20 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(header.navLinks || []).map((link: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 text-center text-gray-400 font-mono">{idx + 1}</td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={link.label || ''}
                      onChange={(e) => {
                        const updated = [...header.navLinks];
                        updated[idx].label = e.target.value;
                        updateHeader({ navLinks: updated });
                      }}
                      className="w-full bg-white border border-gray-300 p-1 text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={link.href || ''}
                      onChange={(e) => {
                        const updated = [...header.navLinks];
                        updated[idx].href = e.target.value;
                        updateHeader({ navLinks: updated });
                      }}
                      className="w-full bg-white border border-gray-300 p-1 text-xs font-mono"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveNavLink(idx)}
                      className="text-[#d63638] hover:text-[#b32d2e] font-semibold text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add New Link Bar */}
          <div className="bg-[#f8f9fa] p-2.5 border-t border-[#c3c4c7] flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-700">Add Link:</span>
            <input
              type="text"
              placeholder="Label (e.g. SPEAKERS)"
              value={newNavLink.label}
              onChange={(e) => setNewNavLink({ ...newNavLink, label: e.target.value })}
              className="bg-white border border-[#8c8f94] p-1.5 text-xs w-36"
            />
            <input
              type="text"
              placeholder="URL (e.g. #speakers)"
              value={newNavLink.href}
              onChange={(e) => setNewNavLink({ ...newNavLink, href: e.target.value })}
              className="bg-white border border-[#8c8f94] p-1.5 text-xs font-mono flex-1 min-w-[150px]"
            />
            <button
              type="button"
              onClick={handleAddNavLink}
              className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-3 py-1.5 shadow-xs"
            >
              + Add Nav Link
            </button>
          </div>
        </div>
      </div>

      {/* Floating Side Menu (snav-btn) */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">
              Right Floating Slide-out Menu
            </h3>
            <p className="text-[11px] text-gray-500">
              The red tab anchored on the right edge of the screen opening full site navigation.
            </p>
          </div>
          <span className="text-xs text-gray-500">{(header.floatingMenu || []).length} items</span>
        </div>

        <div className="border border-[#c3c4c7] overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327] font-semibold">
                <th className="p-2 w-12 text-center">#</th>
                <th className="p-2 w-1/3">Menu Title</th>
                <th className="p-2">Target Section / Page</th>
                <th className="p-2 w-28 text-center">Mobile Only?</th>
                <th className="p-2 w-20 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(header.floatingMenu || []).map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 text-center text-gray-400 font-mono">{idx + 1}</td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.label || ''}
                      onChange={(e) => {
                        const updated = [...header.floatingMenu];
                        updated[idx].label = e.target.value;
                        updateHeader({ floatingMenu: updated });
                      }}
                      className="w-full bg-white border border-gray-300 p-1 text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.href || ''}
                      onChange={(e) => {
                        const updated = [...header.floatingMenu];
                        updated[idx].href = e.target.value;
                        updateHeader({ floatingMenu: updated });
                      }}
                      className="w-full bg-white border border-gray-300 p-1 text-xs font-mono"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={!!item.mobileOnly}
                      onChange={(e) => {
                        const updated = [...header.floatingMenu];
                        updated[idx].mobileOnly = e.target.checked;
                        updateHeader({ floatingMenu: updated });
                      }}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveFloatingItem(idx)}
                      className="text-[#d63638] hover:text-[#b32d2e] font-semibold text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Floating Item Bar */}
          <div className="bg-[#f8f9fa] p-2.5 border-t border-[#c3c4c7] flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-700">Add Menu Item:</span>
            <input
              type="text"
              placeholder="Title (e.g. Schedule)"
              value={newFloatingItem.label}
              onChange={(e) => setNewFloatingItem({ ...newFloatingItem, label: e.target.value })}
              className="bg-white border border-[#8c8f94] p-1.5 text-xs w-36"
            />
            <input
              type="text"
              placeholder="Target (e.g. #schedule)"
              value={newFloatingItem.href}
              onChange={(e) => setNewFloatingItem({ ...newFloatingItem, href: e.target.value })}
              className="bg-white border border-[#8c8f94] p-1.5 text-xs font-mono flex-1 min-w-[150px]"
            />
            <label className="flex items-center gap-1 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newFloatingItem.mobileOnly}
                onChange={(e) => setNewFloatingItem({ ...newFloatingItem, mobileOnly: e.target.checked })}
              />
              Mobile Only
            </label>
            <button
              type="button"
              onClick={handleAddFloatingItem}
              className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-3 py-1.5 shadow-xs"
            >
              + Add Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
