import React, { useState } from 'react';

interface AboutTabProps {
  data: any;
  setData: (data: any) => void;
  onUpload: (fieldKey: string, callback: (url: string) => void) => void;
  uploadingField: string | null;
}

export default function AboutTab({ data, setData, onUpload, uploadingField }: AboutTabProps) {
  const about = data.about || {
    preTitle: 'A Conference for Indian Churches by Indians',
    mainHeadingPre: 'Where Men are ',
    mainHeadingSpan: 'Equipped',
    mainHeadingPost: ' & Renewed',
    p1: '',
    p2: '',
    secureBtnText: 'Secure Your Seat',
    secureBtnUrl: '/registration-2026',
    stats: [],
    slides: [],
  };

  const [newStat, setNewStat] = useState({ number: '', label: '' });
  const [newSlideUrl, setNewSlideUrl] = useState('');

  const updateAbout = (fields: any) => {
    setData({
      ...data,
      about: {
        ...about,
        ...fields,
      },
    });
  };

  const handleAddStat = () => {
    if (!newStat.number.trim() || !newStat.label.trim()) return;
    const stats = [...(about.stats || []), { ...newStat }];
    updateAbout({ stats });
    setNewStat({ number: '', label: '' });
  };

  const handleRemoveStat = (index: number) => {
    const stats = (about.stats || []).filter((_: any, i: number) => i !== index);
    updateAbout({ stats });
  };

  const handleAddSlide = () => {
    if (!newSlideUrl.trim()) return;
    const slides = [...(about.slides || []), newSlideUrl.trim()];
    updateAbout({ slides });
    setNewSlideUrl('');
  };

  const handleRemoveSlide = (index: number) => {
    const slides = (about.slides || []).filter((_: any, i: number) => i !== index);
    updateAbout({ slides });
  };

  return (
    <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-6">
      <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2 flex items-center justify-between">
        <span>About Section, Impact Statistics &amp; Photo Carousel</span>
        <span className="text-[11px] font-normal text-gray-500">The introduction and vision block below the hero banner</span>
      </h2>

      {/* Headings */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1">
            Section Subtitle / Pre-title
          </label>
          <input
            type="text"
            value={about.preTitle || ''}
            onChange={(e) => updateAbout({ preTitle: e.target.value })}
            className="w-full bg-white border border-[#8c8f94] p-2 text-xs focus:border-[#2271b1] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#1d2327] mb-1">
              Heading Prefix
            </label>
            <input
              type="text"
              value={about.mainHeadingPre || ''}
              onChange={(e) => updateAbout({ mainHeadingPre: e.target.value })}
              placeholder="Where Men are "
              className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1d2327] mb-1">
              Highlighted Span (Colored Red)
            </label>
            <input
              type="text"
              value={about.mainHeadingSpan || ''}
              onChange={(e) => updateAbout({ mainHeadingSpan: e.target.value })}
              placeholder="Equipped"
              className="w-full bg-white border border-[#8c8f94] p-2 text-xs font-bold text-[#cc0000]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1d2327] mb-1">
              Heading Postfix
            </label>
            <input
              type="text"
              value={about.mainHeadingPost || ''}
              onChange={(e) => updateAbout({ mainHeadingPost: e.target.value })}
              placeholder=" & Renewed"
              className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Paragraphs */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1">
            Paragraph 1 (Main Purpose)
          </label>
          <textarea
            rows={3}
            value={about.p1 || ''}
            onChange={(e) => updateAbout({ p1: e.target.value })}
            className="w-full bg-white border border-[#8c8f94] p-2 text-xs leading-relaxed focus:border-[#2271b1] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1">
            Paragraph 2 (Organisation &amp; Scope)
          </label>
          <textarea
            rows={3}
            value={about.p2 || ''}
            onChange={(e) => updateAbout({ p2: e.target.value })}
            className="w-full bg-white border border-[#8c8f94] p-2 text-xs leading-relaxed focus:border-[#2271b1] focus:outline-none"
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#f8f9fa] border border-[#e2e4e7]">
        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1">
            About CTA Button Text
          </label>
          <input
            type="text"
            value={about.secureBtnText || ''}
            onChange={(e) => updateAbout({ secureBtnText: e.target.value })}
            placeholder="Secure Your Seat"
            className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1">
            About CTA Target URL
          </label>
          <input
            type="text"
            value={about.secureBtnUrl || ''}
            onChange={(e) => updateAbout({ secureBtnUrl: e.target.value })}
            placeholder="/registration-2026"
            className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs font-mono"
          />
        </div>
      </div>

      {/* Impact Statistics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">
            Key Impact Statistics (Metrics Bar)
          </h3>
          <span className="text-xs text-gray-500">{(about.stats || []).length} stats active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(about.stats || []).map((stat: any, idx: number) => (
            <div key={idx} className="bg-gray-50 border border-gray-300 p-3 relative group">
              <button
                type="button"
                onClick={() => handleRemoveStat(idx)}
                className="absolute top-1.5 right-1.5 text-gray-400 hover:text-red-600 font-bold text-xs"
                title="Remove Stat"
              >
                ✕
              </button>
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase">Number / Metric</span>
                  <input
                    type="text"
                    value={stat.number || ''}
                    onChange={(e) => {
                      const updated = [...about.stats];
                      updated[idx].number = e.target.value;
                      updateAbout({ stats: updated });
                    }}
                    className="w-full bg-white border border-gray-300 p-1 text-sm font-bold text-[#801b0d]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase">Label / Category</span>
                  <input
                    type="text"
                    value={stat.label || ''}
                    onChange={(e) => {
                      const updated = [...about.stats];
                      updated[idx].label = e.target.value;
                      updateAbout({ stats: updated });
                    }}
                    className="w-full bg-white border border-gray-300 p-1 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add New Stat Card */}
          <div className="border border-dashed border-gray-400 p-3 flex flex-col justify-between bg-white">
            <span className="text-[10px] font-bold text-gray-600 uppercase mb-1">+ Add New Metric</span>
            <div className="space-y-1.5 mb-2">
              <input
                type="text"
                placeholder="Number (e.g. 50+)"
                value={newStat.number}
                onChange={(e) => setNewStat({ ...newStat, number: e.target.value })}
                className="w-full border border-gray-300 p-1 text-xs"
              />
              <input
                type="text"
                placeholder="Label (e.g. Speakers)"
                value={newStat.label}
                onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                className="w-full border border-gray-300 p-1 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={handleAddStat}
              className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold py-1 rounded shadow-xs"
            >
              Add Stat
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Photos Slider */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">
              About Section Image Carousel Photos
            </h3>
            <p className="text-[11px] text-gray-500">
              The rotating background slides on the left half of the about section.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpload('aboutSlide', (url) => {
                const slides = [...(about.slides || []), url];
                updateAbout({ slides });
              })
            }
            disabled={uploadingField === 'aboutSlide'}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-3 py-1 rounded shadow-xs"
          >
            {uploadingField === 'aboutSlide' ? 'Uploading...' : '📁 Upload New Slide'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(about.slides || []).map((slideUrl: string, idx: number) => (
            <div key={idx} className="relative group border border-gray-300 bg-black h-28 overflow-hidden rounded">
              <img src={slideUrl} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <button
                type="button"
                onClick={() => handleRemoveSlide(idx)}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm opacity-90 group-hover:opacity-100 font-bold"
                title="Remove slide"
              >
                Delete
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1 text-[9px] text-gray-300 truncate font-mono">
                {slideUrl}
              </div>
            </div>
          ))}
        </div>

        {/* Add URL manual bar */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Or paste an existing image URL (e.g. /assets/...)"
            value={newSlideUrl}
            onChange={(e) => setNewSlideUrl(e.target.value)}
            className="flex-1 bg-white border border-[#8c8f94] p-1.5 text-xs font-mono"
          />
          <button
            type="button"
            onClick={handleAddSlide}
            className="bg-gray-100 hover:bg-gray-200 border border-gray-400 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded"
          >
            Add URL
          </button>
        </div>
      </div>
    </div>
  );
}
