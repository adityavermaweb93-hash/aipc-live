import React, { useState } from 'react';
import { useConference } from '@/context/ConferenceContext';

export default function Contact() {
  const data = useConference();
  const contact = data.contact;
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    _gotcha: '',
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'idle';
    msg: string;
  }>({ type: 'idle', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData._gotcha) return;

    setIsSubmitting(true);
    setStatus({ type: 'idle', msg: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStatus({
          type: 'success',
          msg: 'Thank you! Your message has been sent successfully. We will respond shortly.',
        });
        setFormData({ name: '', phone: '', email: '', message: '', _gotcha: '' });
      } else {
        setStatus({
          type: 'error',
          msg: json.error || 'Something went wrong. Please try again or reach out on WhatsApp.',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        msg: 'Network error. Please try again or reach out on WhatsApp.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full bg-[#FDFCFB] py-20 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block text-[#800000] text-[11px] font-bold tracking-[0.4em] uppercase mb-4 bg-[#800000]/5 px-4 py-1">
            {contact.badge}
          </span>
          <h2
            className="text-[40px] sm:text-[56px] font-bold text-gray-900 mb-5 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {contact.titlePre}
            <span className="text-[#800000] italic">{contact.titleSpan}</span>
          </h2>
          <div className="w-16 h-1 bg-[#800000] mx-auto" />
        </div>

        {/* Content Columns */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Form */}
          <div
            className="bg-white p-8 md:p-10 shadow-xl shadow-gray-100 border border-gray-100"
            style={{ borderRadius: 0 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="_gotcha"
                style={{ display: 'none' }}
                value={formData._gotcha}
                onChange={(e) =>
                  setFormData({ ...formData, _gotcha: e.target.value })
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-gray-50 text-gray-900 px-5 py-4 border border-gray-100 focus:outline-none focus:border-[#800000] transition-colors placeholder-gray-400 text-sm"
                    style={{ borderRadius: 0 }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 12345 67890"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-gray-50 text-gray-900 px-5 py-4 border border-gray-100 focus:outline-none focus:border-[#800000] transition-colors placeholder-gray-400 text-sm"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-gray-50 text-gray-900 px-5 py-4 border border-gray-100 focus:outline-none focus:border-[#800000] transition-colors placeholder-gray-400 text-sm"
                  style={{ borderRadius: 0 }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  How can we help?
                </label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell us about your inquiry..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-gray-50 text-gray-900 px-5 py-4 border border-gray-100 focus:outline-none focus:border-[#800000] transition-colors placeholder-gray-400 resize-none text-sm"
                  style={{ borderRadius: 0 }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#800000] hover:bg-[#5a0000] text-white text-sm font-bold uppercase tracking-[0.2em] py-5 px-10 shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-75"
                style={{ borderRadius: 0 }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {status.type !== 'idle' && (
                <div
                  className={`p-4 text-sm font-bold border ${
                    status.type === 'success'
                      ? 'bg-green-50 text-green-800 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}
                >
                  {status.msg}
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Contact Info */}
          <div className="lg:pl-6 space-y-10">
            <div>
              <h3
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                We'd Love to <br />
                Hear from You
              </h3>
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                Have questions about the AIPC conference or registration? Our
                team is here to help.
              </p>
            </div>

            <div className="space-y-7">
              {/* Email */}
              <div className="flex items-center gap-5 group">
                <div
                  className="w-14 h-14 bg-white flex items-center justify-center text-[#800000] shadow-sm border border-gray-100 group-hover:bg-[#800000] group-hover:text-white transition-all duration-300"
                  style={{ borderRadius: 0 }}
                >
                  <i className="fa-solid fa-envelope text-xl" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                    Email
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-gray-900 font-bold text-base sm:text-lg group-hover:text-[#800000] transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-5 group">
                <div
                  className="w-14 h-14 bg-white flex items-center justify-center text-[#800000] shadow-sm border border-gray-100 group-hover:bg-[#800000] group-hover:text-white transition-all duration-300"
                  style={{ borderRadius: 0 }}
                >
                  <i className="fa-solid fa-phone text-xl" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                    Phone
                  </p>
                  <p className="text-gray-900 font-bold text-base sm:text-lg group-hover:text-[#800000] transition-colors">
                    {contact.phone}
                  </p>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-5 group">
                <div
                  className="w-14 h-14 bg-white flex items-center justify-center text-[#800000] shadow-sm border border-gray-100 flex-shrink-0 group-hover:bg-[#800000] group-hover:text-white transition-all duration-300"
                  style={{ borderRadius: 0 }}
                >
                  <i className="fa-solid fa-location-dot text-xl" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                    Venue
                  </p>
                  <p className="text-gray-900 font-semibold leading-relaxed whitespace-pre-line text-sm sm:text-base">
                    {contact.venueAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#800000]/5 p-6 border border-[#800000]/10 flex items-center justify-between group hover:bg-[#800000]/10 transition-colors block"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center gap-4">
                <i className="fa-brands fa-whatsapp text-3xl text-[#25D366]" />
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Chat with us
                  </p>
                  <p className="text-xs text-gray-500">
                    Instant support on WhatsApp
                  </p>
                </div>
              </div>
              <span className="text-[#800000] text-sm font-bold flex items-center gap-2">
                Connect
                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
