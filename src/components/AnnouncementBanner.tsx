import React, { useState, useEffect } from 'react';

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  badgeText?: string | null;
  actionUrl?: string | null;
  actionLabel?: string | null;
}

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcements');
        const json = await res.json();
        if (json.success && Array.isArray(json.announcements) && json.announcements.length > 0) {
          setAnnouncements(json.announcements);
        }
      } catch (e) {}
    };
    fetchAnnouncements();
  }, []);

  if (isDismissed || announcements.length === 0) return null;

  const active = announcements[0];
  const badge = active.badgeText || 'Notice';
  const isUrgent = badge.toLowerCase().includes('urgent');

  return (
    <div
      className={`relative z-[100001] px-4 py-2.5 text-xs border-b shadow-sm transition-all ${
        isUrgent
          ? 'bg-[#801b0d] text-white border-red-900'
          : 'bg-[#1d2327] text-white border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[10px] ${
              isUrgent ? 'bg-red-950 text-red-200' : 'bg-[#dba617] text-black'
            }`}
          >
            {badge}
          </span>
          <span className="font-semibold">{active.title}:</span>
          <span className="opacity-90">{active.content}</span>
          {active.actionUrl && (
            <a
              href={active.actionUrl}
              className="underline font-bold hover:opacity-80 transition-opacity ml-1.5"
            >
              {active.actionLabel || 'Learn More &rarr;'}
            </a>
          )}
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-sm font-bold opacity-75 hover:opacity-100 transition-opacity p-1"
          title="Dismiss notice"
          aria-label="Dismiss notice"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
