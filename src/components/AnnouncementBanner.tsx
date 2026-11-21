import React, { useState, useEffect } from 'react';

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  bannerType: 'info' | 'warning' | 'urgent' | 'success';
  linkUrl?: string | null;
  linkText?: string | null;
}

const TYPE_STYLES = {
  urgent: 'bg-red-700 text-white border-red-800',
  warning: 'bg-amber-600 text-black border-amber-700',
  info: 'bg-[#1d2327] text-white border-white/10',
  success: 'bg-emerald-700 text-white border-emerald-800',
};

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
  const style = TYPE_STYLES[active.bannerType] || TYPE_STYLES.info;

  return (
    <div
      className={`relative z-[100001] px-4 py-2 text-xs border-b shadow-sm transition-all ${style}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold uppercase tracking-wider bg-black/20 px-1.5 py-0.5 rounded text-[10px]">
            {active.bannerType === 'urgent' ? '⚠️ URGENT' : '📢 NOTICE'}
          </span>
          <span className="font-semibold">{active.title}:</span>
          <span className="opacity-90">{active.content}</span>
          {active.linkUrl && (
            <a
              href={active.linkUrl}
              className="underline font-bold hover:opacity-80 transition-opacity ml-1"
            >
              {active.linkText || 'Learn More &rarr;'}
            </a>
          )}
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-sm font-bold opacity-75 hover:opacity-100 transition-opacity p-1"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
