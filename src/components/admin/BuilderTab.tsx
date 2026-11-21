import React, { useState, useEffect } from 'react';

export interface SectionConfig {
  id?: string;
  sectionKey: string;
  title: string;
  subtitle?: string | null;
  isEnabled: boolean;
  sortOrder: number;
  desktopVisible: boolean;
  mobileVisible: boolean;
  layoutVariant: string;
}

const SECTION_METADATA: Record<string, { label: string; icon: string; tabId: string; description: string }> = {
  hero: {
    label: 'Hero Banner & Countdown',
    icon: '⚡',
    tabId: 'annual',
    description: 'Main headline, dates, countdown clock, and register CTA.',
  },
  about: {
    label: 'About & Highlights',
    icon: 'ℹ️',
    tabId: 'about',
    description: 'Conference purpose, stats (600+ Men, 25+ States), and photos.',
  },
  theme: {
    label: 'Theme & Scripture Verse',
    icon: '📖',
    tabId: 'theme',
    description: 'Yearly Bible exposition passage, keynote scripture, and theme tags.',
  },
  speakers: {
    label: 'Speakers & Keynotes',
    icon: '🎙️',
    tabId: 'speakers',
    description: 'Conference preachers, keynote designations, and profiles.',
  },
  schedule: {
    label: '3-Day Programme Schedule',
    icon: '⏱️',
    tabId: 'schedule',
    description: 'Daily sessions, keynote timings, meal breaks, and locations.',
  },
  pricing: {
    label: 'Accommodation Packages',
    icon: '🏷️',
    tabId: 'pricing',
    description: 'Room options (Quad, Triple, Twin), rates, and inclusions.',
  },
  books: {
    label: 'Complimentary Books',
    icon: '📚',
    tabId: 'books',
    description: 'Free theological book bundles offered to all attendees.',
  },
  organisers: {
    label: 'Organisers & Partners',
    icon: '🤝',
    tabId: 'organisers',
    description: 'Host ministry (Equip Indian Churches) and Gospel partner ministries.',
  },
  gallery: {
    label: 'Photo Gallery Highlights',
    icon: '🖼️',
    tabId: 'gallery',
    description: 'High-resolution photo slides from previous gatherings.',
  },
  venue: {
    label: 'Venue & Travel Directions',
    icon: '📍',
    tabId: 'venue',
    description: 'Hotel address, Google Maps link, train and flight directions.',
  },
  faq: {
    label: 'Common Questions (FAQ)',
    icon: '❓',
    tabId: 'faq',
    description: 'Two-column accordion answering logistics, language, and guidelines.',
  },
  contact: {
    label: 'Contact & WhatsApp Support',
    icon: '📞',
    tabId: 'contact',
    description: 'Phone numbers, WhatsApp help desk, and enquiry form.',
  },
};

interface BuilderTabProps {
  onNavigateTab: (tabId: string) => void;
  showToast: (type: 'success' | 'error', message: string) => void;
}

export default function BuilderTab({ onNavigateTab, showToast }: BuilderTabProps) {
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [editionId, setEditionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/sections?t=' + Date.now());
      const json = await res.json();
      if (json.success && Array.isArray(json.sections)) {
        setSections(json.sections);
        setEditionId(json.editionId);
      }
    } catch (e: any) {
      showToast('error', 'Failed to load sections: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // Move section Up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sections];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    // update sort orders
    updated.forEach((s, idx) => (s.sortOrder = idx));
    setSections(updated);
  };

  // Move section Down
  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    // update sort orders
    updated.forEach((s, idx) => (s.sortOrder = idx));
    setSections(updated);
  };

  // Toggle field
  const toggleField = (index: number, field: 'isEnabled' | 'desktopVisible' | 'mobileVisible') => {
    const updated = [...sections];
    updated[index][field] = !updated[index][field];
    setSections(updated);
  };

  // Save changes
  const handleSave = async () => {
    if (!editionId) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editionId,
          sections,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', 'Homepage section layout published successfully! Cache revalidated.');
      } else {
        showToast('error', json.error || 'Failed to save section layout.');
      }
    } catch (err: any) {
      showToast('error', 'Save error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* WordPress Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c3c4c7] pb-3">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">
            Homepage Section Builder
          </h1>
          <p className="text-xs text-[#646970] mt-0.5">
            Rearrange homepage section display order, toggle visibility, and configure desktop/mobile presentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSections}
            disabled={isLoading || isSaving}
            className="text-xs font-semibold text-gray-700 bg-white hover:bg-[#f6f7f7] border border-gray-300 rounded px-3 py-1.5 shadow-sm"
          >
            Reset to Server
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="text-xs font-semibold text-white bg-[#2271b1] hover:bg-[#135e96] border border-[#2271b1] rounded px-4 py-1.5 shadow-sm transition-colors flex items-center gap-1.5"
          >
            {isSaving ? (
              <>
                <span className="animate-spin text-sm">↻</span>
                <span>Publishing Layout...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save &amp; Publish Layout</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-[#c3c4c7] p-8 text-center text-sm text-gray-500 rounded">
          Loading homepage section hierarchy...
        </div>
      ) : (
        <div className="bg-white border border-[#c3c4c7] shadow-sm rounded overflow-hidden">
          <div className="bg-[#f6f7f7] px-4 py-3 border-b border-[#c3c4c7] flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Homepage Layout Sequence ({sections.length} Sections)
            </span>
            <span className="text-[11px] text-gray-500">
              Use ▲ / ▼ buttons to change vertical order on the public site
            </span>
          </div>

          <div className="divide-y divide-[#c3c4c7]/50">
            {sections.map((sec, idx) => {
              const meta = SECTION_METADATA[sec.sectionKey] || {
                label: sec.sectionKey.toUpperCase(),
                icon: '📌',
                tabId: 'annual',
                description: 'Content section',
              };

              return (
                <div
                  key={sec.sectionKey}
                  className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    sec.isEnabled ? 'bg-white hover:bg-[#fcfcfc]' : 'bg-gray-50 opacity-60'
                  }`}
                >
                  {/* Left: Reorder Controls + Icon + Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Order Controls */}
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        title="Move Up"
                        className={`w-6 h-6 rounded border flex items-center justify-center text-[10px] font-bold ${
                          idx === 0
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                            : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(idx)}
                        disabled={idx === sections.length - 1}
                        title="Move Down"
                        className={`w-6 h-6 rounded border flex items-center justify-center text-[10px] font-bold ${
                          idx === sections.length - 1
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                            : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        ▼
                      </button>
                    </div>

                    {/* Order Badge */}
                    <span className="w-6 text-center text-xs font-mono font-bold text-gray-400">
                      #{idx + 1}
                    </span>

                    {/* Section Icon & Meta */}
                    <div className="w-9 h-9 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-lg flex-shrink-0">
                      {meta.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {meta.label}
                        </span>
                        {!sec.isEnabled && (
                          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Hidden / Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate max-w-md">
                        {meta.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Visibility Toggles + Edit Content Button */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    {/* Enable/Disable Toggle */}
                    <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sec.isEnabled}
                        onChange={() => toggleField(idx, 'isEnabled')}
                        className="rounded border-gray-300 text-[#2271b1] focus:ring-[#2271b1]"
                      />
                      <span>Active</span>
                    </label>

                    {/* Desktop Visible */}
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sec.desktopVisible}
                        onChange={() => toggleField(idx, 'desktopVisible')}
                        className="rounded border-gray-300 text-[#2271b1] focus:ring-[#2271b1]"
                      />
                      <span>🖥️ Desktop</span>
                    </label>

                    {/* Mobile Visible */}
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sec.mobileVisible}
                        onChange={() => toggleField(idx, 'mobileVisible')}
                        className="rounded border-gray-300 text-[#2271b1] focus:ring-[#2271b1]"
                      />
                      <span>📱 Mobile</span>
                    </label>

                    {/* Jump to edit tab */}
                    <button
                      type="button"
                      onClick={() => onNavigateTab(meta.tabId)}
                      className="text-xs font-semibold text-[#2271b1] hover:text-[#135e96] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded px-2.5 py-1 transition-colors flex items-center gap-1"
                    >
                      <span>✏️</span>
                      <span>Edit Content</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
