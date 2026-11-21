import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export interface EditionItem {
  id: string;
  year: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isActivePublic: boolean;
  themeTitle: string;
  themeSubtitle?: string | null;
  venueCity: string;
  datesDisplay: string;
  registrationCount: number;
  packageCount: number;
  sessionCount: number;
  updatedAt: string;
}

interface EditionsTabProps {
  onSelectEditionToEdit?: (year: string) => void;
  showToast: (type: 'success' | 'error', message: string) => void;
}

export default function EditionsTab({ onSelectEditionToEdit, showToast }: EditionsTabProps) {
  const [editions, setEditions] = useState<EditionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEditionId, setActiveEditionId] = useState<string | null>(null);

  // Modals state
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);
  const [selectedSourceForDuplicate, setSelectedSourceForDuplicate] = useState<EditionItem | null>(null);
  const [dupYear, setDupYear] = useState('');
  const [dupTitle, setDupTitle] = useState('');
  const [dupCity, setDupCity] = useState('');
  const [dupVenue, setDupVenue] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newYear, setNewYear] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCity, setNewCity] = useState('Mumbai');
  const [newVenue, setNewVenue] = useState('GCC Hotel & Club');

  const [actionLoading, setActionLoading] = useState(false);

  const fetchEditions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/editions?t=' + Date.now(), {
        headers: { Authorization: 'Bearer AIPC@2025#Admin' },
      });
      const json = await res.json();
      if (json.success) {
        setEditions(json.editions || []);
        setActiveEditionId(json.activeEditionId || null);
      } else {
        showToast('error', json.error || 'Failed to fetch editions.');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEditions();
  }, []);

  const handleSetActive = async (edition: EditionItem) => {
    if (!confirm(`Are you sure you want to publish AIPC ${edition.year} as the ACTIVE public edition on the live website?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/editions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer AIPC@2025#Admin',
        },
        body: JSON.stringify({
          id: edition.id,
          action: 'setActive',
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', json.message);
        fetchEditions();
      } else {
        showToast('error', json.error || 'Failed to activate edition.');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSourceForDuplicate) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/editions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer AIPC@2025#Admin',
        },
        body: JSON.stringify({
          action: 'duplicate',
          sourceEditionId: selectedSourceForDuplicate.id,
          year: dupYear,
          title: dupTitle || `AIPC ${dupYear}`,
          city: dupCity || 'Mumbai',
          venueName: dupVenue || 'Convention Centre',
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', json.message);
        setIsDuplicateOpen(false);
        fetchEditions();
      } else {
        showToast('error', json.error || 'Failed to duplicate edition.');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/editions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer AIPC@2025#Admin',
        },
        body: JSON.stringify({
          year: newYear,
          title: newTitle || `AIPC ${newYear}`,
          city: newCity,
          venueName: newVenue,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', json.message);
        setIsCreateOpen(false);
        fetchEditions();
      } else {
        showToast('error', json.error || 'Failed to create edition.');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeStatus = async (edition: EditionItem, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/editions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer AIPC@2025#Admin',
        },
        body: JSON.stringify({
          id: edition.id,
          status: newStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', json.message);
        fetchEditions();
      } else {
        showToast('error', json.error);
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 border border-[#c3c4c7] shadow-sm">
        <div>
          <h2 className="text-base font-bold text-[#1d2327]">
            Conference Editions Management
          </h2>
          <p className="text-xs text-[#646970]">
            Manage biennial conference editions (AIPC 2025, 2027, 2029, 2031). Create, duplicate, preview, or publish the active edition with zero downtime.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const nextYr = (new Date().getFullYear() + 2).toString();
              setNewYear(nextYr);
              setNewTitle(`AIPC ${nextYr}`);
              setIsCreateOpen(true);
            }}
            className="px-3.5 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold shadow-sm transition-colors"
          >
            + Create New Edition
          </button>
          <button
            type="button"
            onClick={fetchEditions}
            className="px-3 py-1.5 bg-[#f6f7f7] border border-[#c3c4c7] hover:bg-[#f0f0f1] text-xs font-medium text-[#1d2327]"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Editions Table */}
      <div className="bg-white border border-[#c3c4c7] shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327] font-bold">
              <th className="p-3">Year / Edition</th>
              <th className="p-3">Theme</th>
              <th className="p-3">City &amp; Dates</th>
              <th className="p-3">Status</th>
              <th className="p-3">Delegates</th>
              <th className="p-3">Public Website</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c3c4c7]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-[#646970]">
                  Loading conference editions from PostgreSQL...
                </td>
              </tr>
            ) : editions.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-[#646970]">
                  No conference editions found. Run migration to import existing edition.
                </td>
              </tr>
            ) : (
              editions.map((ed) => (
                <tr
                  key={ed.id}
                  className={`hover:bg-[#f9f9f9] transition-colors ${
                    ed.isActivePublic ? 'bg-[#f0f6fc]' : ''
                  }`}
                >
                  <td className="p-3 font-bold text-[#1d2327]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{ed.year}</span>
                      <span className="text-xs text-gray-500 font-normal">({ed.title})</span>
                      {ed.isActivePublic && (
                        <span className="bg-[#00a32a] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-[#1d2327]">
                    <div className="font-semibold">&ldquo;{ed.themeTitle}&rdquo;</div>
                    {ed.themeSubtitle && (
                      <div className="text-[11px] text-gray-500 italic">{ed.themeSubtitle}</div>
                    )}
                  </td>
                  <td className="p-3 text-[#50575e]">
                    <div className="font-medium text-[#1d2327]">{ed.venueCity}</div>
                    <div className="text-[11px]">{ed.datesDisplay}</div>
                  </td>
                  <td className="p-3">
                    <select
                      value={ed.status}
                      disabled={ed.isActivePublic}
                      onChange={(e) => handleChangeStatus(ed, e.target.value)}
                      className={`text-xs font-semibold px-2 py-0.5 border rounded cursor-pointer ${
                        ed.status === 'PUBLISHED'
                          ? 'bg-green-50 text-green-800 border-green-300'
                          : ed.status === 'DRAFT'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </td>
                  <td className="p-3 text-[#50575e]">
                    <span className="font-bold text-[#1d2327]">{ed.registrationCount}</span> registered
                  </td>
                  <td className="p-3">
                    {ed.isActivePublic ? (
                      <span className="text-[#00a32a] font-bold flex items-center gap-1">
                        ● Live on root (/)
                      </span>
                    ) : (
                      <Link
                        href={`/editions/${ed.year}`}
                        target="_blank"
                        className="text-[#2271b1] hover:underline"
                      >
                        /editions/{ed.year} &nearr;
                      </Link>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Set Active Button */}
                      {!ed.isActivePublic && (
                        <button
                          type="button"
                          onClick={() => handleSetActive(ed)}
                          disabled={actionLoading}
                          className="px-2.5 py-1 bg-[#00a32a] hover:bg-[#008a20] text-white font-semibold text-[11px] rounded shadow-sm"
                          title="Make this the active public edition"
                        >
                          Make Active
                        </button>
                      )}

                      {/* Duplicate Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSourceForDuplicate(ed);
                          const nextYr = (parseInt(ed.year, 10) + 2).toString();
                          setDupYear(isNaN(parseInt(nextYr, 10)) ? '2028' : nextYr);
                          setDupTitle(`AIPC ${nextYr}`);
                          setDupCity(ed.venueCity || 'Mumbai');
                          setDupVenue('Convention Centre');
                          setIsDuplicateOpen(true);
                        }}
                        className="px-2.5 py-1 bg-[#dba617] hover:bg-[#c29314] text-black font-semibold text-[11px] rounded shadow-sm"
                        title="Duplicate reusable setup to a new year"
                      >
                        Duplicate
                      </button>

                      {/* Preview Button */}
                      <Link
                        href={`/preview/${ed.id}`}
                        target="_blank"
                        className="px-2.5 py-1 bg-[#f6f7f7] border border-[#c3c4c7] hover:bg-[#f0f0f1] text-[#1d2327] font-semibold text-[11px] rounded"
                      >
                        Preview
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: DUPLICATE EDITION */}
      {isDuplicateOpen && selectedSourceForDuplicate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 border border-[#c3c4c7] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-[#1d2327]">
                Duplicate AIPC {selectedSourceForDuplicate.year} Setup
              </h3>
              <button
                onClick={() => setIsDuplicateOpen(false)}
                className="text-gray-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#646970]">
              This will copy the section layout, pricing packages, partner ministries, and FAQs from{' '}
              <strong>AIPC {selectedSourceForDuplicate.year}</strong> into a fresh draft edition.
              Historical attendee registrations, contact queries, and payments are <strong>not</strong> copied.
            </p>

            <form onSubmit={handleDuplicate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1d2327] mb-1">New Conference Year *</label>
                <input
                  type="text"
                  required
                  placeholder="2028"
                  value={dupYear}
                  onChange={(e) => {
                    setDupYear(e.target.value);
                    setDupTitle(`AIPC ${e.target.value}`);
                  }}
                  className="w-full bg-white border border-[#8c8f94] p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Edition Title *</label>
                <input
                  type="text"
                  required
                  value={dupTitle}
                  onChange={(e) => setDupTitle(e.target.value)}
                  className="w-full bg-white border border-[#8c8f94] p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">Host City *</label>
                  <input
                    type="text"
                    required
                    value={dupCity}
                    onChange={(e) => setDupCity(e.target.value)}
                    className="w-full bg-white border border-[#8c8f94] p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">Venue Name *</label>
                  <input
                    type="text"
                    required
                    value={dupVenue}
                    onChange={(e) => setDupVenue(e.target.value)}
                    className="w-full bg-white border border-[#8c8f94] p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsDuplicateOpen(false)}
                  className="px-3 py-1.5 bg-[#f6f7f7] border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold"
                >
                  {actionLoading ? 'Duplicating...' : 'Duplicate Edition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW EDITION */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 border border-[#c3c4c7] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-[#1d2327]">
                Create New Conference Edition
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Conference Year *</label>
                <input
                  type="text"
                  required
                  placeholder="2028"
                  value={newYear}
                  onChange={(e) => {
                    setNewYear(e.target.value);
                    setNewTitle(`AIPC ${e.target.value}`);
                  }}
                  className="w-full bg-white border border-[#8c8f94] p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Conference Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-[#8c8f94] p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-white border border-[#8c8f94] p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    className="w-full bg-white border border-[#8c8f94] p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 bg-[#f6f7f7] border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold"
                >
                  {actionLoading ? 'Creating...' : 'Create Draft Edition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
