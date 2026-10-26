import React, { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingNav from '@/components/FloatingNav';
import { useConference } from '@/context/ConferenceContext';

export default function Registration() {
  const data = useConference();
  const [selectedPlan, setSelectedPlan] = useState(data.pricing.cards[1]?.id || 'triple');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    street: '',
    street2: '',
    zip: '',
    city: '',
    state: '',
    country: 'India',
    church: '',
    designation: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [createdReg, setCreatedReg] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentPlan = data.pricing.cards.find((c) => c.id === selectedPlan) || data.pricing.cards[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          year: data.meta.year,
          planId: currentPlan?.id || selectedPlan,
          planTitle: currentPlan?.title || 'Triple Sharing',
          amount: currentPlan ? parseInt(currentPlan.price.replace(/,/g, ''), 10) : 5999,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setCreatedReg(json.registration);
        setSubmitted(true);
      } else {
        setErrorMessage(json.error || 'Failed to submit registration. Please try again.');
      }
    } catch {
      setErrorMessage('Network error while processing registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{`Registration ${data.meta.year} – All India Pastors’ Conference`}</title>
      </Head>

      <FloatingNav />
      <Header />

      <main className="bg-[#FAFBFC] min-h-screen pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 border border-gray-100 shadow-md">
          <header className="mb-10 text-center border-b border-gray-100 pb-8">
            <span className="text-[#7F0401] text-xs uppercase tracking-[0.3em] font-extrabold mb-2 block">
              {`AIPC ${data.meta.year}`}
            </span>
            <h1
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Registration <span className="text-[#7F0401] italic">{data.meta.year}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-3">
              {`${data.venue.mainCard.name}, ${data.venue.mainCard.address} | ${data.meta.dates}`}
            </p>
          </header>

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {submitted && createdReg ? (
            <div className="bg-[#fffdfd] border-2 border-[#7F0401]/20 p-8 rounded-lg text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                ✓
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#7F0401] block mb-1">
                  Registration Successful
                </span>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                  Registration ID: <span className="text-[#7F0401] font-mono">{createdReg.id}</span>
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  A confirmation summary has been registered for <strong>{createdReg.firstName} {createdReg.lastName}</strong> ({createdReg.email}).
                </p>
              </div>

              {/* Attendee Details Card */}
              <div className="bg-gray-50 border border-gray-200 p-5 rounded text-left max-w-lg mx-auto space-y-2 text-xs">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 uppercase font-semibold">Selected Tier</span>
                  <span className="font-bold text-gray-900">{createdReg.planTitle}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 uppercase font-semibold">Registration Fee</span>
                  <span className="font-black text-base text-[#7F0401]">₹{createdReg.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 uppercase font-semibold">Church & Designation</span>
                  <span className="font-medium text-gray-800">{createdReg.designation}, {createdReg.church}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 uppercase font-semibold">Location</span>
                  <span className="font-medium text-gray-800">{createdReg.city}, {createdReg.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase font-semibold">Payment Status</span>
                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                    Pending Verification
                  </span>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded text-left text-xs text-blue-900 space-y-1.5 max-w-lg mx-auto">
                <span className="font-bold block uppercase tracking-wide">Next Step: Payment Instructions</span>
                <p>
                  Please transfer <strong>₹{createdReg.amount?.toLocaleString()}</strong> via UPI or NEFT with your Registration ID <strong>{createdReg.id}</strong> in the transfer remarks.
                </p>
                <p className="text-[11px] text-blue-700">
                  Our secretariat will confirm your bed allocation and send the entry badge once the transfer is verified.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-gray-800 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow"
                >
                  🖨️ Print Registration Slip
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setCreatedReg(null);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      age: '',
                      gender: 'Male',
                      street: '',
                      street2: '',
                      zip: '',
                      city: '',
                      state: '',
                      country: 'India',
                      church: '',
                      designation: '',
                    });
                  }}
                  className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded"
                >
                  Register Another Attendee
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Accommodation Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Choose Accommodation Option *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {data.pricing.cards.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-4 border text-center cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? 'border-[#7F0401] bg-[#7F0401]/5 ring-1 ring-[#7F0401]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-sm text-gray-900">{plan.title}</div>
                      <div className="text-lg font-black text-[#7F0401] mt-1">₹{plan.price}</div>
                      <span className="text-[10px] text-gray-500 uppercase">{plan.occupancy || 'per person'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#7F0401]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#7F0401]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#7F0401]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 12345 67890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#7F0401]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#7F0401]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#7F0401]"
                  >
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              {/* Church Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Church Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.church}
                    onChange={(e) => setFormData({ ...formData, church: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#7F0401]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    City / State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#7F0401]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#7F0401] hover:bg-[#5a0000] text-white text-sm font-bold uppercase tracking-[0.2em] py-4 px-8 transition-colors shadow-md ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                style={{ borderRadius: 0 }}
              >
                {isSubmitting ? 'Submitting Registration...' : 'Proceed to Payment & Registration'}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
