import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useConference } from '@/context/ConferenceContext';

export default function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const data = useConference();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="snav-overlay"
          onClick={close}
          style={{ display: 'block' }}
        />
      )}

      {/* Floating Button */}
      <button
        className="snav-btn"
        id="snavBtn"
        onClick={toggle}
        aria-label="Toggle Navigation Menu"
      >
        <div className="snav-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="snav-label">Navigation Menu</div>
      </button>

      {/* Navigation Modal */}
      {isOpen && (
        <nav
          className="snav-modal"
          id="snavModal"
          style={{
            display: 'block',
            position: 'fixed',
            ...(typeof window !== 'undefined' && window.innerWidth <= 1024
              ? { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', right: 'auto' }
              : { right: '48px', top: '50%', transform: 'translateY(-50%)', left: 'auto' }),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="snav-modal-head">
            <span>Navigation Menu</span>
            <Link
              href="/registration-2026"
              className="snav-register-btn"
              onClick={close}
            >
              Register
            </Link>
          </div>
          <ul>
            {data.header.floatingMenu.map((item, idx) => (
              <li
                key={idx}
                className={item.mobileOnly ? 'block lg:hidden' : ''}
              >
                <Link href={item.href} onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
