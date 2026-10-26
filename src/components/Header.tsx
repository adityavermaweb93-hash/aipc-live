import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useConference } from '@/context/ConferenceContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const data = useConference();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
      style={{ height: '80px', display: 'flex', alignItems: 'center' }}
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Site Logo */}
        <div className="flex items-center">
          <Link href="/" className="inline-block">
            <img
              src={data.header.logo}
              alt="AIPC White"
              className="h-[30px] sm:h-[30px] max-h-[30px] w-auto object-contain"
              fetchPriority="high"
            />
          </Link>
        </div>

        {/* Right Navigation & CTA */}
        <div className="flex items-center gap-6 sm:gap-8">
          {/* Menu Links */}
          <nav className="hidden md:flex items-center gap-7">
            {data.header.navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-[#e1e8ed] hover:text-[#ff0400] text-[12px] font-bold uppercase tracking-wider transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Donation CTA Button */}
          <div>
            <Link
              href={data.header.donationBtn.href}
              className="inline-block bg-white text-[#7F0401] hover:text-black hover:bg-gray-100 text-[14px] sm:text-[15px] font-medium px-5 py-1.5 transition-all duration-200"
              style={{ borderRadius: '0px' }}
            >
              {data.header.donationBtn.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
