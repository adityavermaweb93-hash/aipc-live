import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useConference } from '@/context/ConferenceContext';

export default function WatchPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const data = useConference();

  return (
    <>
      <Head>
        <title>{`Watch Live – AIPC ${data.meta.year}`}</title>
      </Head>

      <div className="bg-[#09090d] text-white min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-[#131318] border-b border-white/10 px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/assets/AIPC-White-1.png" alt="AIPC" className="h-6 w-auto" />
            </Link>
            <span className="text-xs bg-[#7F0401] px-2.5 py-0.5 rounded text-white font-bold uppercase tracking-wider animate-pulse">
              Live Stream
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 border border-white/20 hover:bg-white/10 transition-colors"
            >
              {chatOpen ? 'Hide Chat' : 'Show Chat'}
            </button>
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-[#7F0401] hover:bg-[#9e0502] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </header>

        {/* Theater stage */}
        <main className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
          {/* Main player */}
          <div className="flex-1 relative bg-black flex items-center justify-center min-h-[500px]">
            <iframe
              className="w-full h-full min-h-[500px] border-none"
              src="https://www.youtube.com/embed/live_stream?channel=EquipIndianChurches&autoplay=1&mute=1"
              title="AIPC 2026 Live Stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />

            {/* Floating HUD */}
            <div className="absolute bottom-6 left-6 z-10 bg-black/80 backdrop-blur-md border border-white/10 p-4 max-w-sm pointer-events-none hidden sm:block">
              <div className="text-xs uppercase tracking-widest text-[#cc0000] font-bold">
                AIPC 2026
              </div>
              <div className="font-serif font-bold text-base text-white mt-1">
                “Living as Exiles” • Expositions in 1 Peter
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                Equip Indian Churches • aipc.live
              </div>
            </div>
          </div>

          {/* Chat Sidepanel */}
          {chatOpen && (
            <aside className="w-full lg:w-80 bg-[#131318] border-l border-white/10 flex flex-col h-[400px] lg:h-auto">
              <div className="p-3 border-b border-white/10 flex items-center justify-between text-xs font-bold uppercase text-gray-300">
                <span>Live Discussion</span>
                <button onClick={() => setChatOpen(false)} className="hover:text-white">
                  ✕
                </button>
              </div>
              <div className="flex-1 p-4 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                <i className="fa-regular fa-comments text-3xl mb-3 text-gray-600" />
                <p>Live stream chat will become active once conference broadcast commences.</p>
              </div>
            </aside>
          )}
        </main>
      </div>
    </>
  );
}
