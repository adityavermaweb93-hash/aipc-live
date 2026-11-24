import React, { useState } from 'react';

interface BrandingTabProps {
  data: any;
  setData: (data: any) => void;
  showToast: (type: 'success' | 'error', message: string) => void;
  onSaveToBackend?: () => void;
}

export default function BrandingTab({
  data,
  setData,
  showToast,
  onSaveToBackend,
}: BrandingTabProps) {
  // Brand acronym (e.g. AIPC -> AIL)
  const currentBrand =
    data.hero?.mainHeading1 || data.meta?.brandAcronym || 'AIPC';
  const currentFullName =
    data.meta?.brandFullName ||
    data.meta?.conferenceTitle ||
    "All India Pastors' Conference";
  const currentYear = data.meta?.year || '2026';
  const currentThemeTitle =
    data.hero?.subtitleHighlight || data.theme?.mainHeadingSpan || 'Exiles';
  const currentThemeSubtitle =
    data.hero?.description || data.theme?.subtitle || 'Expositions in 1 Peter';
  const currentScriptureRef =
    data.theme?.quoteRef || '1 Peter 2:11-12';
  const currentScriptureQuote =
    data.theme?.quoteText ||
    'Beloved, I urge you as sojourners and exiles to abstain from the passions of the flesh, which wage war against your soul.';
  const currentPreTitle =
    data.hero?.preTitle || 'Organised By Equip Indian Churches';
  const currentTagline =
    data.hero?.tagline || 'A Conference for Indian Churches by Indians.';
  const currentForText = data.meta?.forText || 'Men who love the Church';

  const [brandAcronym, setBrandAcronym] = useState(currentBrand);
  const [brandFullName, setBrandFullName] = useState(currentFullName);
  const [year, setYear] = useState(currentYear);
  const [themeTitle, setThemeTitle] = useState(currentThemeTitle);
  const [themeSubtitle, setThemeSubtitle] = useState(currentThemeSubtitle);
  const [scriptureRef, setScriptureRef] = useState(currentScriptureRef);
  const [scriptureQuote, setScriptureQuote] = useState(currentScriptureQuote);
  const [preTitle, setPreTitle] = useState(currentPreTitle);
  const [tagline, setTagline] = useState(currentTagline);
  const [forText, setForText] = useState(currentForText);

  // Quick preset shortcuts
  const applyPreset = (presetAcronym: string, presetName: string) => {
    setBrandAcronym(presetAcronym);
    setBrandFullName(presetName);
    showToast(
      'success',
      `Applied preset: ${presetAcronym} (${presetName}). Click "Apply Main Theme Globally" to confirm.`
    );
  };

  const handleApplyGlobally = () => {
    const updated = {
      ...data,
      meta: {
        ...data.meta,
        year: year.trim(),
        brandAcronym: brandAcronym.trim(),
        brandFullName: brandFullName.trim(),
        forText: forText.trim(),
      },
      hero: {
        ...data.hero,
        mainHeading1: brandAcronym.trim(),
        mainHeading2: year.trim(),
        subtitleHighlight: themeTitle.trim(),
        description: themeSubtitle.trim(),
        preTitle: preTitle.trim(),
        tagline: tagline.trim(),
      },
      theme: {
        ...data.theme,
        mainHeadingSpan: themeTitle.trim(),
        subtitle: themeSubtitle.trim(),
        quoteRef: scriptureRef.trim(),
        quoteText: scriptureQuote.trim(),
      },
      gallery: {
        ...data.gallery,
        titleSpan: brandAcronym.trim(),
      },
      books: {
        ...data.books,
        brandTag: brandAcronym.trim(),
      },
    };

    setData(updated);
    showToast(
      'success',
      `Updated brand to ${brandAcronym.trim()} and theme to "${themeTitle.trim()}". Click Save/Publish to persist.`
    );

    if (onSaveToBackend) {
      setTimeout(() => onSaveToBackend(), 300);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c3c4c7] pb-3">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">
            Main Theme &amp; Branding (e.g. AIPC to AIL)
          </h1>
          <p className="text-xs text-[#646970] mt-0.5">
            Configure the primary conference branding acronym, full title, and core theme applied globally across hero banners, headings, book heritage, and page titles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleApplyGlobally}
          className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold py-1.5 px-4 shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <span>✨</span>
          <span>Apply Main Theme Globally</span>
        </button>
      </div>

      {/* Live Preview Card */}
      <div className="bg-[#111] text-white p-6 border border-[#2c3338] shadow-md rounded">
        <div className="text-[10px] uppercase tracking-widest font-bold text-[#cc0000] mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#cc0000] animate-pulse" />
          <span>Live Hero Branding Preview</span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2 border-t border-white/10">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              {preTitle}
            </div>
            <div
              className="text-4xl sm:text-5xl font-black uppercase text-white tracking-tight"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <span className="text-[#cc0000]">{brandAcronym || 'AIPC'}</span>{' '}
              <span>{year || '2026'}</span>
            </div>
            <div
              className="text-xl sm:text-2xl text-gray-200 mt-2 font-serif"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              “<span className="text-[#cc0000] italic">{themeTitle || 'Theme'}</span>”
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {themeSubtitle || 'Theme Subtitle'} &bull; {scriptureRef}
            </div>
          </div>

          <div className="bg-[#1d2327] p-3.5 border border-[#3c434a] text-xs space-y-1.5 max-w-xs w-full">
            <div className="text-[10px] text-[#72aee6] font-bold uppercase">
              Global Propagation Targets:
            </div>
            <div className="text-gray-300">
              &bull; Hero Main Heading: <strong className="text-white">{brandAcronym} {year}</strong>
            </div>
            <div className="text-gray-300">
              &bull; Book Tag: <strong className="text-white">[{brandAcronym}]</strong>
            </div>
            <div className="text-gray-300">
              &bull; Gallery Header: <strong className="text-white">Glimpses of {brandAcronym}</strong>
            </div>
            <div className="text-gray-300">
              &bull; Page Title: <strong className="text-white">{brandAcronym} {year} &ndash; {brandFullName}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Theme Configuration Form */}
      <div className="bg-white border border-[#c3c4c7] shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2">
            1. Brand Acronym &amp; Conference Identity
          </h2>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Change from <strong>AIPC</strong> (All India Pastors’ Conference) to <strong>AIL</strong> (All India Leaders Conference), or any custom conference brand.
          </p>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-gray-500 font-semibold">Quick Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('AIPC', "All India Pastors' Conference")}
              className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded"
            >
              AIPC (All India Pastors&apos; Conference)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('AIL', 'All India Leaders Conference')}
              className="px-2.5 py-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-[#2271b1] border border-blue-300 rounded"
            >
              AIL (All India Leaders Conference)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('AILC', 'All India Leadership Conference')}
              className="px-2.5 py-1 text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300 rounded"
            >
              AILC (All India Leadership Conference)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                Brand Acronym / Prefix *
              </label>
              <input
                type="text"
                value={brandAcronym}
                onChange={(e) => setBrandAcronym(e.target.value.toUpperCase())}
                placeholder="e.g. AIL or AIPC"
                className="w-full bg-white border border-[#8c8f94] p-2 text-sm font-black tracking-wider text-[#cc0000] focus:border-[#2271b1] focus:outline-none"
              />
              <span className="text-[10px] text-gray-400">
                Shown in massive bold font on the Hero banner &amp; book tabs
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                Full Conference Name *
              </label>
              <input
                type="text"
                value={brandFullName}
                onChange={(e) => setBrandFullName(e.target.value)}
                placeholder="e.g. All India Pastors' Conference or All India Leadership Conference"
                className="w-full bg-white border border-[#8c8f94] p-2 text-xs focus:border-[#2271b1] focus:outline-none"
              />
              <span className="text-[10px] text-gray-400">
                Shown in header metadata, SEO tags, and legal footer
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2">
            2. Conference Edition Year &amp; Target Audience
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
            <div>
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                Conference Year *
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026 or 2027"
                className="w-full bg-white border border-[#8c8f94] p-2 text-xs focus:border-[#2271b1] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                Target Audience (&ldquo;For&rdquo; Bar)
              </label>
              <input
                type="text"
                value={forText}
                onChange={(e) => setForText(e.target.value)}
                placeholder="e.g. Men who love the Church / Pastors &amp; Elders"
                className="w-full bg-white border border-[#8c8f94] p-2 text-xs focus:border-[#2271b1] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2">
            3. Main Conference Theme &amp; Scripture Exposition
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                Theme Title (Bold Italic Highlight) *
              </label>
              <input
                type="text"
                value={themeTitle}
                onChange={(e) => setThemeTitle(e.target.value)}
                placeholder="e.g. Living as Exiles"
                className="w-full bg-white border border-[#8c8f94] p-2 text-xs font-bold text-[#7F0401] focus:border-[#2271b1] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                Theme Subtitle / Book Exposition Tagline *
              </label>
              <input
                type="text"
                value={themeSubtitle}
                onChange={(e) => setThemeSubtitle(e.target.value)}
                placeholder="e.g. Expositions in 1 Peter"
                className="w-full bg-white border border-[#8c8f94] p-2 text-xs focus:border-[#2271b1] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                Theme Scripture Reference
              </label>
              <input
                type="text"
                value={scriptureRef}
                onChange={(e) => setScriptureRef(e.target.value)}
                placeholder="e.g. 1 Peter 2:11-12"
                className="w-full bg-white border border-[#8c8f94] p-2 text-xs font-bold focus:border-[#2271b1] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                Key Scripture Verse Quote Text
              </label>
              <textarea
                rows={3}
                value={scriptureQuote}
                onChange={(e) => setScriptureQuote(e.target.value)}
                placeholder="Quote text from scripture..."
                className="w-full bg-white border border-[#8c8f94] p-2 text-xs font-serif italic focus:border-[#2271b1] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2">
            4. Hero Pre-title &amp; Conference Tagline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                Hero Pre-title (Red pill banner)
              </label>
              <input
                type="text"
                value={preTitle}
                onChange={(e) => setPreTitle(e.target.value)}
                placeholder="e.g. Organised By Equip Indian Churches"
                className="w-full bg-white border border-[#8c8f94] p-2 text-xs focus:border-[#2271b1] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                Conference Motto / Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. A Conference for Indian Churches by Indians."
                className="w-full bg-white border border-[#8c8f94] p-2 text-xs focus:border-[#2271b1] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Applying globally updates all section headers, titles, book tags, and metadata simultaneously.
          </span>
          <button
            type="button"
            onClick={handleApplyGlobally}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold py-2 px-5 shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>✨</span>
            <span>Apply Main Theme Globally</span>
          </button>
        </div>
      </div>
    </div>
  );
}
