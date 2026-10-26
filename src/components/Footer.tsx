import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useConference } from '@/context/ConferenceContext';

export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const data = useConference();

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer
        id="footer"
        className="relative bg-black text-[#FAFBFC] py-8 px-4 border-t border-white/10"
        style={{
          backgroundImage: `url('${data.footer.bgImage}')`,
          backgroundPosition: '48% 47%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-center">
          <nav aria-label="Policies">
            <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-7">
              {data.footer.links.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-[#FAFBFC] hover:text-[#b50909] text-[11px] sm:text-[12px] font-bold capitalize tracking-wide transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-4 z-40 bg-white hover:bg-[#7F0401] text-[#7F0401] hover:text-white w-9 h-9 flex items-center justify-center shadow-lg transition-all duration-300"
          style={{ borderRadius: 0 }}
          aria-label="Back to top"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M10,0L9.4,0.6L0.8,9.1l1.2,1.2l7.1-7.1V20h1.7V3.3l7.1,7.1l1.2-1.2l-8.5-8.5L10,0z" />
          </svg>
        </button>
      )}
    </>
  );
}
