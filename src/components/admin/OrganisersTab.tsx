import React, { useState } from 'react';

interface OrganisersTabProps {
  data: any;
  setData: (data: any) => void;
  onUpload: (fieldKey: string, callback: (url: string) => void) => void;
  uploadingField: string | null;
}

export default function OrganisersTab({ data, setData, onUpload, uploadingField }: OrganisersTabProps) {
  const organisers = data.organisers || {
    label: 'ORGANISED BY',
    titlePre: 'Conference ',
    titleEm: 'Organiser',
    organiser: {
      name: 'Equip Indian Churches',
      logo: '/assets/EIC_Favicon.png',
      description: '',
      websiteUrl: 'https://equipindianchurches.com',
    },
    partnersLabel: 'COLLABORATION',
    partnersTitlePre: 'Our ',
    partnersTitleEm: 'Partners',
    partnersDescription: '',
    partnersList: [],
    knowMoreUrl: '/partners',
  };

  const [newPartner, setNewPartner] = useState({
    name: '',
    logo: '',
    url: '',
    desc: '',
  });

  const updateOrganisers = (fields: any) => {
    setData({
      ...data,
      organisers: {
        ...organisers,
        ...fields,
      },
    });
  };

  const handleAddPartner = () => {
    if (!newPartner.name.trim()) return;
    const partnersList = [...(organisers.partnersList || []), { ...newPartner }];
    updateOrganisers({ partnersList });
    setNewPartner({ name: '', logo: '', url: '', desc: '' });
  };

  const handleRemovePartner = (index: number) => {
    const partnersList = (organisers.partnersList || []).filter((_: any, i: number) => i !== index);
    updateOrganisers({ partnersList });
  };

  return (
    <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-6">
      <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2 flex items-center justify-between">
        <span>Conference Organisers &amp; Partner Ministries</span>
        <span className="text-[11px] font-normal text-gray-500">Manage Equip Indian Churches details and ministry partners</span>
      </h2>

      {/* Main Conference Organiser */}
      <div className="border border-[#c3c4c7] p-4 bg-[#f8f9fa] space-y-4">
        <div className="flex items-center justify-between border-b border-gray-300 pb-2">
          <h3 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">
            Main Conference Organiser
          </h3>
          <span className="text-[11px] text-[#2271b1] font-semibold">Primary Host Entity</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#1d2327] mb-1">
              Badge Label
            </label>
            <input
              type="text"
              value={organisers.label || ''}
              onChange={(e) => updateOrganisers({ label: e.target.value })}
              placeholder="ORGANISED BY"
              className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1d2327] mb-1">
              Title Prefix
            </label>
            <input
              type="text"
              value={organisers.titlePre || ''}
              onChange={(e) => updateOrganisers({ titlePre: e.target.value })}
              placeholder="Conference "
              className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1d2327] mb-1">
              Title Highlight (Italic/Emphasized)
            </label>
            <input
              type="text"
              value={organisers.titleEm || ''}
              onChange={(e) => updateOrganisers({ titleEm: e.target.value })}
              placeholder="Organiser"
              className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs font-bold text-[#801b0d]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                Organiser Name
              </label>
              <input
                type="text"
                value={organisers.organiser?.name || ''}
                onChange={(e) =>
                  updateOrganisers({
                    organiser: { ...(organisers.organiser || {}), name: e.target.value },
                  })
                }
                className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                Official Website URL
              </label>
              <input
                type="text"
                value={organisers.organiser?.websiteUrl || organisers.knowMoreUrl || ''}
                onChange={(e) => {
                  updateOrganisers({
                    knowMoreUrl: e.target.value,
                    organiser: { ...(organisers.organiser || {}), websiteUrl: e.target.value },
                  });
                }}
                className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1d2327] mb-1">
              Organiser Logo
            </label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white border border-gray-400 p-1 flex items-center justify-center rounded shrink-0">
                {organisers.organiser?.logo ? (
                  <img src={organisers.organiser.logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-[10px] text-gray-400">No Logo</span>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  type="text"
                  value={organisers.organiser?.logo || ''}
                  onChange={(e) =>
                    updateOrganisers({
                      organiser: { ...(organisers.organiser || {}), logo: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() =>
                    onUpload('organiserLogo', (url) => {
                      updateOrganisers({
                        organiser: { ...(organisers.organiser || {}), logo: url },
                      });
                    })
                  }
                  disabled={uploadingField === 'organiserLogo'}
                  className="bg-[#f0f0f1] hover:bg-[#e0e0e1] border border-[#8c8f94] text-xs font-semibold px-2.5 py-1 rounded"
                >
                  {uploadingField === 'organiserLogo' ? 'Uploading...' : '📁 Upload Logo'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1">
            Organiser Description (Ministry Mission)
          </label>
          <textarea
            rows={3}
            value={organisers.organiser?.description || ''}
            onChange={(e) =>
              updateOrganisers({
                organiser: { ...(organisers.organiser || {}), description: e.target.value },
              })
            }
            className="w-full bg-white border border-[#8c8f94] p-2 text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* Partner Ministries */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">
              Partner Ministries &amp; Organizations
            </h3>
            <p className="text-[11px] text-gray-500">
              Displayed in the partners showcase (e.g. For The Truth, Truth:78)
            </p>
          </div>
          <span className="text-xs text-gray-500">{(organisers.partnersList || []).length} partners</span>
        </div>

        {/* Existing Partners Grid */}
        <div className="space-y-3">
          {(organisers.partnersList || []).map((partner: any, idx: number) => (
            <div key={idx} className="border border-gray-300 p-4 bg-[#fcfcfc] rounded space-y-3 relative group">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-[#1d2327]">Partner #{idx + 1}: {partner.name || 'Untitled'}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePartner(idx)}
                  className="text-red-600 hover:text-red-800 text-xs font-bold"
                >
                  ✕ Remove Partner
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={partner.name || ''}
                    onChange={(e) => {
                      const updated = [...organisers.partnersList];
                      updated[idx].name = e.target.value;
                      updateOrganisers({ partnersList: updated });
                    }}
                    className="w-full bg-white border border-gray-300 p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={partner.url || ''}
                    onChange={(e) => {
                      const updated = [...organisers.partnersList];
                      updated[idx].url = e.target.value;
                      updateOrganisers({ partnersList: updated });
                    }}
                    className="w-full bg-white border border-gray-300 p-1.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Logo URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={partner.logo || ''}
                      onChange={(e) => {
                        const updated = [...organisers.partnersList];
                        updated[idx].logo = e.target.value;
                        updateOrganisers({ partnersList: updated });
                      }}
                      className="flex-1 bg-white border border-gray-300 p-1.5 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        onUpload(`partner_${idx}`, (url) => {
                          const updated = [...organisers.partnersList];
                          updated[idx].logo = url;
                          updateOrganisers({ partnersList: updated });
                        })
                      }
                      className="bg-gray-100 hover:bg-gray-200 border border-gray-400 px-2 py-1 text-[11px] font-semibold rounded shrink-0"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={partner.desc || ''}
                  onChange={(e) => {
                    const updated = [...organisers.partnersList];
                    updated[idx].desc = e.target.value;
                    updateOrganisers({ partnersList: updated });
                  }}
                  className="w-full bg-white border border-gray-300 p-1.5 text-xs"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add New Partner Form */}
        <div className="border border-dashed border-gray-400 p-4 bg-[#f9fafb] space-y-3">
          <h4 className="text-xs font-bold text-gray-800 uppercase">+ Add New Partner Ministry</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Partner Name (e.g. Crossway)"
              value={newPartner.name}
              onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
              className="bg-white border border-gray-300 p-1.5 text-xs"
            />
            <input
              type="text"
              placeholder="Website URL (https://...)"
              value={newPartner.url}
              onChange={(e) => setNewPartner({ ...newPartner, url: e.target.value })}
              className="bg-white border border-gray-300 p-1.5 text-xs font-mono"
            />
            <input
              type="text"
              placeholder="Logo Image URL"
              value={newPartner.logo}
              onChange={(e) => setNewPartner({ ...newPartner, logo: e.target.value })}
              className="bg-white border border-gray-300 p-1.5 text-xs font-mono"
            />
          </div>
          <input
            type="text"
            placeholder="Brief ministry summary or description"
            value={newPartner.desc}
            onChange={(e) => setNewPartner({ ...newPartner, desc: e.target.value })}
            className="w-full bg-white border border-gray-300 p-1.5 text-xs"
          />
          <button
            type="button"
            onClick={handleAddPartner}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-4 py-1.5 rounded shadow-xs"
          >
            Add Partner to Directory
          </button>
        </div>
      </div>
    </div>
  );
}
