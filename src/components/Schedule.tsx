import React, { useState } from 'react';
import { useConference } from '@/context/ConferenceContext';

export default function Schedule() {
  const { schedule } = useConference();
  const availableDays = Object.keys(schedule.days) as Array<keyof typeof schedule.days>;
  const [activeDay, setActiveDay] = useState<string>(availableDays[0] || 'day1');

  const currentDayData = schedule.days[activeDay] || schedule.days[availableDays[0]];

  return (
    <div
      id="schedule"
      className="w-full bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] py-16 px-4 sm:px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <span className="text-[10px] font-black tracking-[0.5em] text-[#801b0d] block mb-2 uppercase opacity-80">
            {schedule.subTitle}
          </span>
          <h2
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900 mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {schedule.titlePre}
            <span className="text-[#801b0d] italic">{schedule.titleItalic}</span>
          </h2>
          <div className="h-1 w-10 bg-[#801b0d] mx-auto" />
        </header>

        {/* Day Navigation Tabs */}
        <nav className="mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {availableDays.map((dayKey) => {
              const day = schedule.days[dayKey];
              const isActive = activeDay === dayKey;
              return (
                <button
                  key={dayKey}
                  onClick={() => setActiveDay(dayKey)}
                  className={`flex-1 sm:flex-none text-center py-2.5 px-4 min-w-[100px] transition-all duration-300 ${
                    isActive
                      ? 'bg-[#801b0d] text-white border border-[#801b0d] shadow-[0_6px_15px_rgba(128,27,13,0.2)] -translate-y-0.5'
                      : 'bg-white/60 text-gray-600 border border-black/10 hover:bg-white/80'
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  <span className="text-[9px] block font-bold opacity-60 mb-0.5 uppercase tracking-widest">
                    {day.date}
                  </span>
                  <span className="text-sm sm:text-base font-bold">
                    {day.dayLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Active Day Label */}
        {currentDayData && (
          <div className="mb-8 text-center">
            <h3 className="text-xl sm:text-2xl font-black text-[#801b0d] tracking-tight uppercase">
              {currentDayData.label}
            </h3>
          </div>
        )}

        {/* Schedule Container */}
        <div className="relative max-w-lg mx-auto min-h-[150px]">
          <div className="relative pl-6 sm:pl-8 ml-3 sm:ml-4">
            {/* Timeline Line */}
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-black/10 -translate-x-1/2" />
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#801b0d] -translate-x-1/2" />

            {currentDayData?.events?.map((event, index) => {
              const isSession = event.type === 'session';
              const isBreak = event.type === 'break';

              return (
                <div key={index} className="relative mb-3.5">
                  {/* Diamond Dot */}
                  <div
                    className="w-2 h-2 absolute -left-6 sm:-left-8 top-[20px] -translate-x-1/2 rotate-45 z-10 bg-[#801b0d] border border-[#801b0d] shadow-[0_0_0_4px_rgba(128,27,13,0.08)]"
                    style={{ borderRadius: 0 }}
                  />

                  {/* Glass Card */}
                  <div
                    className={`py-3.5 px-4 sm:px-5 flex justify-between items-center transition-all duration-300 hover:shadow-md ${
                      isSession
                        ? 'bg-white/95 border-l-[3px] border-l-[#801b0d] border border-black/8 shadow-sm'
                        : isBreak
                        ? 'bg-[#fdfbf9]/90 border-l-[3px] border-l-[#c5a059] border border-black/8'
                        : 'bg-white/85 border border-black/8'
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    <div>
                      {isSession && (
                        <span className="text-[10px] font-bold tracking-widest text-[#801b0d] uppercase block mb-0.5 opacity-90">
                          {event.session}
                        </span>
                      )}
                      {isBreak && (
                        <span className="text-[9px] font-bold tracking-widest text-[#c5a059] uppercase block mb-0.5">
                          FELLOWSHIP & BREAK
                        </span>
                      )}
                      <h4
                        className={`text-sm sm:text-base font-bold text-gray-900 tracking-tight leading-snug ${
                          isSession ? 'font-serif' : 'font-sans'
                        }`}
                        style={
                          isSession
                            ? { fontFamily: "'Playfair Display', serif" }
                            : undefined
                        }
                      >
                        {event.title}
                      </h4>
                    </div>

                    <div className="opacity-20 shrink-0 ml-3 text-gray-800">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
