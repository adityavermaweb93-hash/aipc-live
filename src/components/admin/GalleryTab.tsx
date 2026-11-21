import React, { useState } from 'react';

interface GalleryTabProps {
  data: any;
  setData: (data: any) => void;
  onUpload: (fieldKey: string, callback: (url: string) => void) => void;
  uploadingField: string | null;
}

export default function GalleryTab({ data, setData, onUpload, uploadingField }: GalleryTabProps) {
  const gallery = data.gallery || {
    subtitle: 'HIGHLIGHTS',
    titlePre: 'Glimpses of ',
    titleSpan: 'AIPC',
    slides: [],
  };

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [newPhoto, setNewPhoto] = useState({
    src: '',
    alt: 'AIPC Conference Photo',
    className: 'item-1',
  });

  const updateGallery = (fields: any) => {
    setData({
      ...data,
      gallery: {
        ...gallery,
        ...fields,
      },
    });
  };

  const currentSlide = gallery.slides?.[activeSlideIndex] || { items: [] };

  const handleUpdateItem = (itemIndex: number, fields: any) => {
    const updatedSlides = [...(gallery.slides || [])];
    if (!updatedSlides[activeSlideIndex]) {
      updatedSlides[activeSlideIndex] = { items: [] };
    }
    const updatedItems = [...(updatedSlides[activeSlideIndex].items || [])];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], ...fields };
    updatedSlides[activeSlideIndex].items = updatedItems;
    updateGallery({ slides: updatedSlides });
  };

  const handleRemoveItem = (itemIndex: number) => {
    const updatedSlides = [...(gallery.slides || [])];
    if (!updatedSlides[activeSlideIndex]) return;
    updatedSlides[activeSlideIndex].items = updatedSlides[activeSlideIndex].items.filter(
      (_: any, i: number) => i !== itemIndex
    );
    updateGallery({ slides: updatedSlides });
  };

  const handleAddItem = () => {
    if (!newPhoto.src.trim()) return;
    const updatedSlides = [...(gallery.slides || [])];
    if (!updatedSlides[activeSlideIndex]) {
      updatedSlides[activeSlideIndex] = { items: [] };
    }
    updatedSlides[activeSlideIndex].items = [
      ...(updatedSlides[activeSlideIndex].items || []),
      { ...newPhoto },
    ];
    updateGallery({ slides: updatedSlides });
    setNewPhoto({ src: '', alt: 'AIPC Conference Photo', className: 'item-1' });
  };

  const handleAddSlidePage = () => {
    const updatedSlides = [...(gallery.slides || []), { items: [] }];
    updateGallery({ slides: updatedSlides });
    setActiveSlideIndex(updatedSlides.length - 1);
  };

  return (
    <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-6">
      <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2 flex items-center justify-between">
        <span>Photo Gallery &amp; Conference Highlights</span>
        <span className="text-[11px] font-normal text-gray-500">Manage the dynamic multi-slide masonry photo grid</span>
      </h2>

      {/* Headings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#f8f9fa] border border-[#e2e4e7]">
        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1">
            Section Subtitle
          </label>
          <input
            type="text"
            value={gallery.subtitle || ''}
            onChange={(e) => updateGallery({ subtitle: e.target.value })}
            placeholder="HIGHLIGHTS"
            className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1">
            Title Prefix
          </label>
          <input
            type="text"
            value={gallery.titlePre || ''}
            onChange={(e) => updateGallery({ titlePre: e.target.value })}
            placeholder="Glimpses of "
            className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1">
            Title Span (Red)
          </label>
          <input
            type="text"
            value={gallery.titleSpan || ''}
            onChange={(e) => updateGallery({ titleSpan: e.target.value })}
            placeholder="AIPC"
            className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs font-bold text-[#cc0000]"
          />
        </div>
      </div>

      {/* Slide / Carousel Pages Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700">Gallery Slide Page:</span>
            {(gallery.slides || []).map((_: any, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                className={`text-xs px-3 py-1 font-semibold rounded ${
                  activeSlideIndex === idx
                    ? 'bg-[#2271b1] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                Page {idx + 1} ({gallery.slides[idx]?.items?.length || 0} photos)
              </button>
            ))}
            <button
              type="button"
              onClick={handleAddSlidePage}
              className="text-xs text-[#2271b1] hover:underline font-bold px-2 py-1"
            >
              + Add Slide Page
            </button>
          </div>
          <span className="text-xs text-gray-500">
            {currentSlide.items?.length || 0} photos in Slide {activeSlideIndex + 1}
          </span>
        </div>

        {/* Photos Grid for Active Slide */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(currentSlide.items || []).map((item: any, idx: number) => (
            <div key={idx} className="border border-gray-300 bg-white p-3 rounded shadow-xs space-y-2 relative group">
              <div className="h-32 bg-gray-900 rounded overflow-hidden relative flex items-center justify-center">
                {item.src ? (
                  <img src={item.src} alt={item.alt || ''} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
                <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                  {item.className || 'item-1'}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow"
                >
                  Delete
                </button>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-semibold">Image URL</label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={item.src || ''}
                    onChange={(e) => handleUpdateItem(idx, { src: e.target.value })}
                    className="flex-1 bg-white border border-gray-300 p-1 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onUpload(`gallery_${activeSlideIndex}_${idx}`, (url) => {
                        handleUpdateItem(idx, { src: url });
                      })
                    }
                    className="bg-gray-100 hover:bg-gray-200 border border-gray-300 px-2 py-1 text-[11px] rounded"
                  >
                    📁
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-semibold">Alt Description</label>
                  <input
                    type="text"
                    value={item.alt || ''}
                    onChange={(e) => handleUpdateItem(idx, { alt: e.target.value })}
                    className="w-full bg-white border border-gray-300 p-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-semibold">Grid Slot</label>
                  <select
                    value={item.className || 'item-1'}
                    onChange={(e) => handleUpdateItem(idx, { className: e.target.value })}
                    className="w-full bg-white border border-gray-300 p-1 text-xs"
                  >
                    <option value="item-1">Slot 1 (Wide)</option>
                    <option value="item-2">Slot 2 (Standard)</option>
                    <option value="item-3">Slot 3 (Standard)</option>
                    <option value="item-4">Slot 4 (Tall)</option>
                    <option value="item-5">Slot 5 (Standard)</option>
                    <option value="item-6">Slot 6 (Wide)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Photo to Active Slide */}
        <div className="border border-dashed border-[#2271b1] p-4 bg-[#f0f6fc] rounded space-y-3">
          <h4 className="text-xs font-bold text-[#1d2327] uppercase">+ Add Photo to Slide {activeSlideIndex + 1}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-1 sm:col-span-2">
              <input
                type="text"
                placeholder="Image URL (e.g. /assets/DSCF1193.jpg)"
                value={newPhoto.src}
                onChange={(e) => setNewPhoto({ ...newPhoto, src: e.target.value })}
                className="flex-1 bg-white border border-gray-300 p-1.5 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() =>
                  onUpload('newGalleryPhoto', (url) => {
                    setNewPhoto({ ...newPhoto, src: url });
                  })
                }
                disabled={uploadingField === 'newGalleryPhoto'}
                className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded shrink-0 shadow-xs"
              >
                {uploadingField === 'newGalleryPhoto' ? 'Uploading...' : '📁 Upload File'}
              </button>
            </div>
            <select
              value={newPhoto.className}
              onChange={(e) => setNewPhoto({ ...newPhoto, className: e.target.value })}
              className="bg-white border border-gray-300 p-1.5 text-xs"
            >
              <option value="item-1">Slot 1 (Wide)</option>
              <option value="item-2">Slot 2 (Standard)</option>
              <option value="item-3">Slot 3 (Standard)</option>
              <option value="item-4">Slot 4 (Tall)</option>
              <option value="item-5">Slot 5 (Standard)</option>
              <option value="item-6">Slot 6 (Wide)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Photo Alt Description (e.g. Worship Session)"
              value={newPhoto.alt}
              onChange={(e) => setNewPhoto({ ...newPhoto, alt: e.target.value })}
              className="flex-1 bg-white border border-gray-300 p-1.5 text-xs"
            />
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-4 py-1.5 rounded shadow-xs"
            >
              Insert Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
