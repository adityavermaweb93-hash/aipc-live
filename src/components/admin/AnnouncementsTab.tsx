import React, { useState, useEffect } from 'react';

export interface AnnouncementItem {
  id: string;
  editionId?: string | null;
  title: string;
  content: string;
  bannerType: 'info' | 'warning' | 'urgent' | 'success';
  linkUrl?: string | null;
  linkText?: string | null;
  isPublished: boolean;
  createdAt: string;
}

interface AnnouncementsTabProps {
  showToast: (type: 'success' | 'error', message: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  urgent: 'bg-red-100 text-red-800 border-red-300',
  warning: 'bg-amber-100 text-amber-800 border-amber-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300',
  success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

export default function AnnouncementsTab({ showToast }: AnnouncementsTabProps) {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bannerType, setBannerType] = useState<'info' | 'warning' | 'urgent' | 'success'>('info');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/announcements?t=' + Date.now());
      const json = await res.json();
      if (json.success) {
        setAnnouncements(json.announcements || []);
      }
    } catch (e: any) {
      showToast('error', 'Failed to load announcements: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setBannerType('info');
    setLinkUrl('');
    setLinkText('');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: AnnouncementItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setBannerType(item.bannerType);
    setLinkUrl(item.linkUrl || '');
    setLinkText(item.linkText || '');
    setIsPublished(item.isPublished);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      showToast('error', 'Title and message are required.');
      return;
    }

    setActionLoading(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body: any = {
        title,
        content,
        bannerType,
        linkUrl: linkUrl || null,
        linkText: linkText || null,
        isPublished,
      };
      if (editingId) body.id = editingId;

      const res = await fetch('/api/admin/announcements', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', editingId ? 'Announcement updated!' : 'Announcement created and broadcasted!');
        setIsModalOpen(false);
        fetchAnnouncements();
      } else {
        showToast('error', json.error || 'Failed to save announcement.');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const togglePublished = async (item: AnnouncementItem) => {
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          isPublished: !item.isPublished,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', `Announcement is now ${!item.isPublished ? 'Published' : 'Unpublished'}.`);
        fetchAnnouncements();
      }
    } catch (e: any) {
      showToast('error', e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement notice?')) return;
    try {
      const res = await fetch(`/api/admin/announcements?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast('success', 'Announcement notice removed.');
        fetchAnnouncements();
      }
    } catch (e: any) {
      showToast('error', e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c3c4c7] pb-3">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">
            Announcements &amp; Urgent Notices
          </h1>
          <p className="text-xs text-[#646970] mt-0.5">
            Broadcast emergency alerts, early-bird deadline warnings, room availability notices, and news banners on the live site.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="text-xs font-semibold text-white bg-[#2271b1] hover:bg-[#135e96] border border-[#2271b1] rounded px-3 py-1.5 shadow-sm transition-colors flex items-center gap-1.5"
        >
          <span>📢+</span>
          <span>Create Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded overflow-hidden">
        <div className="bg-[#f6f7f7] px-4 py-3 border-b border-[#c3c4c7] flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Notice Broadcasts ({announcements.length})
          </span>
          <span className="text-[11px] text-gray-500">
            Rendered at the very top of the website
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading notices...</div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            <span className="text-3xl block mb-2">📢</span>
            No active announcements. Click &ldquo;Create Announcement&rdquo; to broadcast a notice to attendees.
          </div>
        ) : (
          <div className="divide-y divide-[#c3c4c7]/50">
            {announcements.map((item) => (
              <div key={item.id} className="p-4 hover:bg-[#fafafa] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        TYPE_COLORS[item.bannerType] || 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                    >
                      {item.bannerType}
                    </span>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        item.isPublished
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {item.isPublished ? '● Live on Site' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {item.content}
                  </p>
                  {item.linkUrl && (
                    <div className="text-[11px] text-[#2271b1]">
                      Link: <a href={item.linkUrl} target="_blank" rel="noreferrer" className="underline">{item.linkText || item.linkUrl}</a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => togglePublished(item)}
                    className={`text-xs px-2.5 py-1 rounded border font-semibold ${
                      item.isPublished
                        ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        : 'border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {item.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="text-xs px-2.5 py-1 rounded border border-gray-300 bg-white text-[#2271b1] hover:bg-gray-50 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-xs px-2.5 py-1 rounded border border-red-200 bg-white text-red-600 hover:bg-red-50 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-gray-300 overflow-hidden">
            <div className="bg-[#1d2327] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingId ? 'Edit Announcement' : 'Create New Announcement'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Alert Severity / Banner Style
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { type: 'info', label: 'Info (Standard)', color: 'bg-blue-100 text-blue-800' },
                    { type: 'warning', label: 'Warning (Amber)', color: 'bg-amber-100 text-amber-800' },
                    { type: 'urgent', label: 'Urgent (Red Alert)', color: 'bg-red-100 text-red-800' },
                    { type: 'success', label: 'Success (Green)', color: 'bg-emerald-100 text-emerald-800' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setBannerType(item.type as any)}
                      className={`py-2 px-1 text-center rounded border text-[11px] font-bold ${
                        bannerType === item.type
                          ? 'border-gray-900 ring-2 ring-gray-900 ' + item.color
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quadruple Sharing Rooms Fully Booked"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-[#2271b1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notice Content / Message</label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g. Please note that quadruple sharing is sold out. Triple sharing and twin sharing packages remain available."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-[#2271b1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Action Button Link (Optional)</label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="e.g. /registration-2026"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-[#2271b1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="e.g. Register Triple &rarr;"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-[#2271b1]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-gray-300 text-[#2271b1]"
                  />
                  <span>Publish and broadcast immediately on the website</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold rounded"
                >
                  {actionLoading ? 'Saving...' : editingId ? 'Update Notice' : 'Broadcast Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
