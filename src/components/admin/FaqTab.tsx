import React, { useState } from 'react';

interface FaqTabProps {
  data: any;
  setData: (data: any) => void;
}

export default function FaqTab({ data, setData }: FaqTabProps) {
  const faq = data.faq || {
    subTitle: "FAQ'S",
    titlePre: 'Common ',
    titleSpan: 'Questions',
    column1: [],
    column2: [],
    moreFaqsUrl: '/faqs',
  };

  const [newQ1, setNewQ1] = useState({ question: '', answerHtml: '' });
  const [newQ2, setNewQ2] = useState({ question: '', answerHtml: '' });

  const updateFaq = (fields: any) => {
    setData({
      ...data,
      faq: {
        ...faq,
        ...fields,
      },
    });
  };

  const handleAddQ1 = () => {
    if (!newQ1.question.trim()) return;
    const column1 = [...(faq.column1 || []), { ...newQ1 }];
    updateFaq({ column1 });
    setNewQ1({ question: '', answerHtml: '' });
  };

  const handleRemoveQ1 = (index: number) => {
    const column1 = (faq.column1 || []).filter((_: any, i: number) => i !== index);
    updateFaq({ column1 });
  };

  const handleAddQ2 = () => {
    if (!newQ2.question.trim()) return;
    const column2 = [...(faq.column2 || []), { ...newQ2 }];
    updateFaq({ column2 });
    setNewQ2({ question: '', answerHtml: '' });
  };

  const handleRemoveQ2 = (index: number) => {
    const column2 = (faq.column2 || []).filter((_: any, i: number) => i !== index);
    updateFaq({ column2 });
  };

  const handleMoveToCol2 = (index: number) => {
    const item = faq.column1[index];
    const column1 = faq.column1.filter((_: any, i: number) => i !== index);
    const column2 = [...(faq.column2 || []), item];
    updateFaq({ column1, column2 });
  };

  const handleMoveToCol1 = (index: number) => {
    const item = faq.column2[index];
    const column2 = faq.column2.filter((_: any, i: number) => i !== index);
    const column1 = [...(faq.column1 || []), item];
    updateFaq({ column1, column2 });
  };

  return (
    <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-6">
      <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2 flex items-center justify-between">
        <span>Frequently Asked Questions (FAQ) Section</span>
        <span className="text-[11px] font-normal text-gray-500">Edit conference eligibility, lodging, arrival &amp; guidelines</span>
      </h2>

      {/* Headings & More FAQs link */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-[#f8f9fa] border border-[#e2e4e7]">
        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1">
            Section Subtitle
          </label>
          <input
            type="text"
            value={faq.subTitle || ''}
            onChange={(e) => updateFaq({ subTitle: e.target.value })}
            placeholder="FAQ'S"
            className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1">
            Title Prefix
          </label>
          <input
            type="text"
            value={faq.titlePre || ''}
            onChange={(e) => updateFaq({ titlePre: e.target.value })}
            placeholder="Common "
            className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1">
            Title Span (Red)
          </label>
          <input
            type="text"
            value={faq.titleSpan || ''}
            onChange={(e) => updateFaq({ titleSpan: e.target.value })}
            placeholder="Questions"
            className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs font-bold text-[#cc0000]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1d2327] mb-1">
            "More FAQs" Link URL
          </label>
          <input
            type="text"
            value={faq.moreFaqsUrl || ''}
            onChange={(e) => updateFaq({ moreFaqsUrl: e.target.value })}
            placeholder="/faqs"
            className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs font-mono"
          />
        </div>
      </div>

      {/* 2-Column FAQs Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-300 pb-1.5">
            <h3 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">
              Left Column (General &amp; Eligibility)
            </h3>
            <span className="text-xs text-gray-500">{(faq.column1 || []).length} items</span>
          </div>

          <div className="space-y-3">
            {(faq.column1 || []).map((item: any, idx: number) => (
              <div key={idx} className="border border-gray-300 p-3 bg-gray-50 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#801b0d]">Q{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleMoveToCol2(idx)}
                      className="text-gray-500 hover:text-black text-[11px]"
                      title="Move to Column 2"
                    >
                      Move to Right →
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveQ1(idx)}
                      className="text-red-600 hover:text-red-800 text-[11px] font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={item.question || ''}
                  onChange={(e) => {
                    const updated = [...faq.column1];
                    updated[idx].question = e.target.value;
                    updateFaq({ column1: updated });
                  }}
                  placeholder="Question text"
                  className="w-full bg-white border border-gray-300 p-1.5 text-xs font-semibold"
                />
                <textarea
                  rows={3}
                  value={item.answerHtml || ''}
                  onChange={(e) => {
                    const updated = [...faq.column1];
                    updated[idx].answerHtml = e.target.value;
                    updateFaq({ column1: updated });
                  }}
                  placeholder="Answer text or HTML (paragraphs, links)"
                  className="w-full bg-white border border-gray-300 p-1.5 text-xs leading-relaxed"
                />
              </div>
            ))}
          </div>

          {/* Add to Column 1 */}
          <div className="border border-dashed border-gray-400 p-3 bg-[#fcfcfc] rounded space-y-2">
            <span className="text-xs font-bold text-gray-700 block">+ Add Question to Left Column</span>
            <input
              type="text"
              placeholder="Question"
              value={newQ1.question}
              onChange={(e) => setNewQ1({ ...newQ1, question: e.target.value })}
              className="w-full bg-white border border-gray-300 p-1.5 text-xs"
            />
            <textarea
              rows={2}
              placeholder="Answer (supports HTML like <p>, <a>)"
              value={newQ1.answerHtml}
              onChange={(e) => setNewQ1({ ...newQ1, answerHtml: e.target.value })}
              className="w-full bg-white border border-gray-300 p-1.5 text-xs"
            />
            <button
              type="button"
              onClick={handleAddQ1}
              className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-3 py-1 rounded"
            >
              Add to Column 1
            </button>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-300 pb-1.5">
            <h3 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider">
              Right Column (Location, Logistics &amp; Rooms)
            </h3>
            <span className="text-xs text-gray-500">{(faq.column2 || []).length} items</span>
          </div>

          <div className="space-y-3">
            {(faq.column2 || []).map((item: any, idx: number) => (
              <div key={idx} className="border border-gray-300 p-3 bg-gray-50 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#801b0d]">Q{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleMoveToCol1(idx)}
                      className="text-gray-500 hover:text-black text-[11px]"
                      title="Move to Column 1"
                    >
                      ← Move to Left
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveQ2(idx)}
                      className="text-red-600 hover:text-red-800 text-[11px] font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={item.question || ''}
                  onChange={(e) => {
                    const updated = [...faq.column2];
                    updated[idx].question = e.target.value;
                    updateFaq({ column2: updated });
                  }}
                  placeholder="Question text"
                  className="w-full bg-white border border-gray-300 p-1.5 text-xs font-semibold"
                />
                <textarea
                  rows={3}
                  value={item.answerHtml || ''}
                  onChange={(e) => {
                    const updated = [...faq.column2];
                    updated[idx].answerHtml = e.target.value;
                    updateFaq({ column2: updated });
                  }}
                  placeholder="Answer text or HTML (paragraphs, links)"
                  className="w-full bg-white border border-gray-300 p-1.5 text-xs leading-relaxed"
                />
              </div>
            ))}
          </div>

          {/* Add to Column 2 */}
          <div className="border border-dashed border-gray-400 p-3 bg-[#fcfcfc] rounded space-y-2">
            <span className="text-xs font-bold text-gray-700 block">+ Add Question to Right Column</span>
            <input
              type="text"
              placeholder="Question"
              value={newQ2.question}
              onChange={(e) => setNewQ2({ ...newQ2, question: e.target.value })}
              className="w-full bg-white border border-gray-300 p-1.5 text-xs"
            />
            <textarea
              rows={2}
              placeholder="Answer (supports HTML like <p>, <a>)"
              value={newQ2.answerHtml}
              onChange={(e) => setNewQ2({ ...newQ2, answerHtml: e.target.value })}
              className="w-full bg-white border border-gray-300 p-1.5 text-xs"
            />
            <button
              type="button"
              onClick={handleAddQ2}
              className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-3 py-1 rounded"
            >
              Add to Column 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
