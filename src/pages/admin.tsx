import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import { getConferenceData } from '@/lib/conferenceStore';
import { getRegistrations, RegistrationRecord } from '@/lib/registrationsStore';
import { getQueries, ContactQuery } from '@/lib/queriesStore';
import { useConferenceContext } from '@/context/ConferenceContext';

interface AdminDashboardProps {
  initialData: any;
  initialRegistrations: RegistrationRecord[];
  initialQueries: ContactQuery[];
}

export default function AdminDashboard({
  initialData,
  initialRegistrations,
  initialQueries,
}: AdminDashboardProps) {
  const { setData: setGlobalData } = useConferenceContext();
  const [data, setData] = useState(initialData);

  // Registrations & Queries State
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(initialRegistrations);
  const [queries, setQueries] = useState<ContactQuery[]>(initialQueries);

  // Active Tab / WordPress Menu Item
  const [activeTab, setActiveTab] = useState<
    | 'registrations'
    | 'queries'
    | 'annual'
    | 'venue'
    | 'theme'
    | 'speakers'
    | 'schedule'
    | 'pricing'
    | 'books'
    | 'contact'
    | 'json'
  >('registrations');

  const [activeScheduleDay, setActiveScheduleDay] = useState<'day1' | 'day2' | 'day3'>('day1');
  const [activeBookYear, setActiveBookYear] = useState<string>(data.meta?.year || '2026');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search & Filter States
  const [regSearch, setRegSearch] = useState('');
  const [regPlanFilter, setRegPlanFilter] = useState('all');
  const [regStatusFilter, setRegStatusFilter] = useState('all');

  const [querySearch, setQuerySearch] = useState('');
  const [queryStatusFilter, setQueryStatusFilter] = useState('all');

  // Modals
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);
  const [isAddRegOpen, setIsAddRegOpen] = useState(false);
  const [selectedQueryForReply, setSelectedQueryForReply] = useState<ContactQuery | null>(null);
  const [replyNoteText, setReplyNoteText] = useState('');

  // New Attendee Form State
  const [newAttendee, setNewAttendee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '35',
    gender: 'Male',
    street: '',
    city: '',
    state: '',
    church: '',
    designation: 'Pastor',
    planId: 'triple',
    planTitle: 'Triple Sharing',
    amount: 5999,
    paymentStatus: 'confirmed' as const,
    paymentReference: '',
    notes: '',
  });

  // Status & Notifications
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState(JSON.stringify(initialData, null, 2));

  const showToast = (type: 'success' | 'error', message: string) => {
    setSaveToast({ type, message });
    setTimeout(() => setSaveToast(null), 5000);
  };

  // Refresh registrations
  const refreshRegistrations = async () => {
    try {
      const res = await fetch('/api/registrations');
      const json = await res.json();
      if (json.success) {
        setRegistrations(json.registrations);
      }
    } catch (err: any) {
      console.error('Failed to refresh registrations:', err);
    }
  };

  // Refresh queries
  const refreshQueries = async () => {
    try {
      const res = await fetch('/api/queries');
      const json = await res.json();
      if (json.success) {
        setQueries(json.queries);
      }
    } catch (err: any) {
      console.error('Failed to refresh queries:', err);
    }
  };

  // Update Registration Status
  const handleUpdateRegStatus = async (id: string, newStatus: 'confirmed' | 'pending' | 'cancelled') => {
    try {
      const res = await fetch('/api/registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { paymentStatus: newStatus } }),
      });
      const json = await res.json();
      if (json.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, paymentStatus: newStatus } : r))
        );
        showToast('success', `Registration ${id} marked as ${newStatus}.`);
      } else {
        showToast('error', json.error || 'Failed to update status');
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Save Attendee Notes
  const handleSaveRegDetails = async () => {
    if (!selectedReg) return;
    try {
      const res = await fetch('/api/registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedReg.id,
          updates: {
            notes: selectedReg.notes,
            paymentReference: selectedReg.paymentReference,
            paymentStatus: selectedReg.paymentStatus,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === selectedReg.id ? json.registration : r))
        );
        setSelectedReg(null);
        showToast('success', `Details for ${json.registration.firstName} updated.`);
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Delete Registration
  const handleDeleteReg = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete registration for ${name} (${id})?`)) return;
    try {
      const res = await fetch(`/api/registrations?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setRegistrations((prev) => prev.filter((r) => r.id !== id));
        showToast('success', `Registration ${id} deleted.`);
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Add Attendee Manually
  const handleCreateAttendee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAttendee,
          year: data.meta.year,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setRegistrations((prev) => [json.registration, ...prev]);
        setIsAddRegOpen(false);
        showToast('success', `Attendee ${json.registration.firstName} registered (#${json.registration.id})!`);
        setNewAttendee({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          age: '35',
          gender: 'Male',
          street: '',
          city: '',
          state: '',
          church: '',
          designation: 'Pastor',
          planId: 'triple',
          planTitle: 'Triple Sharing',
          amount: 5999,
          paymentStatus: 'confirmed',
          paymentReference: '',
          notes: '',
        });
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Export Attendees to CSV
  const handleExportCSV = () => {
    const headers = [
      'Registration ID',
      'Year',
      'Registered At',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Designation',
      'Church Name',
      'City',
      'State',
      'Accommodation Plan',
      'Amount (INR)',
      'Payment Status',
      'Payment Reference',
      'Notes',
    ];

    const rows = registrations.map((r) => [
      `"${r.id}"`,
      `"${r.year}"`,
      `"${new Date(r.createdAt).toLocaleString()}"`,
      `"${r.firstName}"`,
      `"${r.lastName}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.designation}"`,
      `"${r.church}"`,
      `"${r.city}"`,
      `"${r.state}"`,
      `"${r.planTitle}"`,
      `"${r.amount}"`,
      `"${r.paymentStatus}"`,
      `"${r.paymentReference || ''}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aipc-${data.meta.year}-attendees-list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Query Reply Note
  const handleSaveQueryReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQueryForReply) return;

    try {
      const res = await fetch('/api/queries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedQueryForReply.id,
          updates: {
            status: 'replied',
            replyNotes: replyNoteText,
            repliedBy: 'AIPC Secretariat',
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setQueries((prev) =>
          prev.map((q) => (q.id === selectedQueryForReply.id ? json.query : q))
        );
        setSelectedQueryForReply(null);
        setReplyNoteText('');
        showToast('success', `Query ${json.query.id} marked as replied with note saved.`);
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Toggle Query Status
  const handleToggleQueryStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'replied' ? 'pending' : 'replied';
    try {
      const res = await fetch('/api/queries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          updates: { status: nextStatus },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setQueries((prev) =>
          prev.map((q) => (q.id === id ? json.query : q))
        );
        showToast('success', `Query ${id} marked as ${nextStatus}.`);
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Delete Query
  const handleDeleteQuery = async (id: string, name: string) => {
    if (!confirm(`Delete inquiry from ${name} (${id})?`)) return;
    try {
      const res = await fetch(`/api/queries?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setQueries((prev) => prev.filter((q) => q.id !== id));
        showToast('success', `Query ${id} deleted.`);
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // File upload helper
  const handleFileUpload = (fieldKey: string, callback: (url: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingField(fieldKey);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, data: base64 }),
          });
          const json = await res.json();
          if (json.success && json.url) {
            callback(json.url);
            showToast('success', `Image uploaded successfully: ${file.name}`);
          } else {
            showToast('error', `Upload failed: ${json.error || 'Unknown error'}`);
          }
        } catch (err: any) {
          showToast('error', `Upload error: ${err.message}`);
        } finally {
          setUploadingField(null);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // Save Conference Settings to backend API
  const handleSaveToBackend = async (dataToSave = data) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/conference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataToSave }),
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setJsonText(JSON.stringify(result.data, null, 2));
        setGlobalData(result.data);
        showToast('success', 'Conference settings published and saved to backend store!');
      } else {
        showToast('error', `Save failed: ${result.error || 'Server error'}`);
      }
    } catch (err: any) {
      showToast('error', `Save error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all conference configuration back to initial defaults?')) {
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/conference/reset', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setJsonText(JSON.stringify(result.data, null, 2));
        setGlobalData(result.data);
        showToast('success', 'All conference data has been reset to defaults.');
      } else {
        showToast('error', `Reset failed: ${result.error}`);
      }
    } catch (err: any) {
      showToast('error', `Reset error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Annual Switcher
  const handleStartNextYearEdition = () => {
    const currentYear = parseInt(data.meta.year || '2026', 10);
    const nextYear = (isNaN(currentYear) ? 2026 : currentYear + 1).toString();
    const city = prompt(`Enter City for AIPC ${nextYear}:`, 'Mumbai') || 'Mumbai';
    const venueName = prompt(`Enter Venue Name for AIPC ${nextYear}:`, `${city} Convention Centre`) || `${city} Convention Centre`;

    const updated = {
      ...data,
      meta: {
        ...data.meta,
        year: nextYear,
        dates: `Dates to be announced, ${nextYear}`,
        targetDate: `October 01, ${nextYear} 12:00:00`,
        venueShort: `${venueName}, ${city}`,
      },
      hero: {
        ...data.hero,
        mainHeading2: nextYear,
        tagline: `A Conference for Indian Churches by Indians (${nextYear}).`,
      },
      theme: {
        ...data.theme,
        preTitle: `Conference Theme ${nextYear}`,
      },
      venue: {
        ...data.venue,
        mainCard: {
          ...data.venue.mainCard,
          name: venueName,
          address: `${venueName}, ${city}, India`,
        },
        mapCard: {
          ...data.venue.mapCard,
          title: venueName,
          subtitle: city,
        },
      },
      books: {
        ...data.books,
        years: [nextYear, ...data.books.years.filter((y: string) => y !== nextYear)],
        booksData: {
          ...data.books.booksData,
          [nextYear]: data.books.booksData[nextYear] || [],
        },
      },
    };

    setData(updated);
    setActiveBookYear(nextYear);
    handleSaveToBackend(updated);
    showToast('success', `Configured AIPC ${nextYear} in ${city}! Review and update dates & details.`);
  };

  // Filtered lists
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      !regSearch ||
      r.firstName.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.lastName.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.phone.includes(regSearch) ||
      r.church.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.city.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.id.toLowerCase().includes(regSearch.toLowerCase());

    const matchesPlan = regPlanFilter === 'all' || r.planId === regPlanFilter;
    const matchesStatus = regStatusFilter === 'all' || r.paymentStatus === regStatusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const filteredQueries = queries.filter((q) => {
    const matchesSearch =
      !querySearch ||
      q.name.toLowerCase().includes(querySearch.toLowerCase()) ||
      q.email.toLowerCase().includes(querySearch.toLowerCase()) ||
      q.phone.includes(querySearch) ||
      q.message.toLowerCase().includes(querySearch.toLowerCase()) ||
      q.id.toLowerCase().includes(querySearch.toLowerCase());

    const matchesStatus = queryStatusFilter === 'all' || q.status === queryStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalAttendees = registrations.length;
  const confirmedAttendees = registrations.filter((r) => r.paymentStatus === 'confirmed').length;
  const pendingAttendees = registrations.filter((r) => r.paymentStatus === 'pending').length;
  const totalRevenue = registrations
    .filter((r) => r.paymentStatus === 'confirmed')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const pendingQueriesCount = queries.filter((q) => q.status === 'pending').length;

  return (
    <>
      <Head>
        <title>AIPC Administration &lsaquo; All India Pastors&rsquo; Conference</title>
      </Head>

      {/* WordPress Admin Shell (Edge-to-Edge, Flush Left & Full Width) */}
      <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] font-sans flex flex-col antialiased">
        {/* ======================================================== */}
        {/* 1. WORDPRESS TOP ADMIN BAR (#wpadminbar) */}
        {/* ======================================================== */}
        <header
          id="wpadminbar"
          className="h-10 bg-[#1d2327] text-[#c3c4c7] border-b border-[#2c3338] px-3 sm:px-4 flex items-center justify-between z-50 sticky top-0 left-0 right-0 w-full select-none"
        >
          {/* Left: Site Icon, Title, Quick Links */}
          <div className="flex items-center gap-4 text-xs">
            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:text-[#72aee6] text-sm focus:outline-none"
              title="Toggle Menu"
            >
              ☰
            </button>

            {/* AIPC Wp-style Logo */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 font-bold text-white hover:text-[#72aee6] transition-colors"
            >
              <span className="w-5 h-5 bg-[#7F0401] rounded-sm text-white flex items-center justify-center font-black text-[11px] leading-none shadow-sm">
                W
              </span>
              <span className="hidden sm:inline">AIPC {data.meta.year}</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-[#c3c4c7] hover:text-[#72aee6] transition-colors"
              title="View Public Site"
            >
              <span>🏠</span>
              <span>Visit Site ↗</span>
            </Link>

            {/* Quick New Attendee Button */}
            <button
              onClick={() => setIsAddRegOpen(true)}
              className="hidden md:flex items-center gap-1 text-[#c3c4c7] hover:text-white px-2 py-0.5 rounded hover:bg-[#2c3338] transition-colors"
            >
              <span>+</span>
              <span>New Attendee</span>
            </button>

            {/* Inquiries Notification */}
            <button
              onClick={() => setActiveTab('queries')}
              className="flex items-center gap-1 text-[#c3c4c7] hover:text-white px-2 py-0.5 rounded hover:bg-[#2c3338] transition-colors"
            >
              <span>💬</span>
              <span className="hidden sm:inline">Inquiries</span>
              {pendingQueriesCount > 0 && (
                <span className="bg-[#d63638] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingQueriesCount}
                </span>
              )}
            </button>
          </div>

          {/* Right: Publish action, Edition badge, Howdy */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => handleSaveToBackend()}
              disabled={isSaving}
              className={`bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-3 py-1 rounded shadow-sm flex items-center gap-1.5 transition-colors ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Save Config</span>
                </>
              )}
            </button>

            <span className="hidden lg:inline-block text-[#8c8f94] border-l border-[#2c3338] pl-3">
              Edition: <strong className="text-white">{data.meta.year}</strong> ({data.venue.mainCard.name})
            </span>

            <span className="text-[#c3c4c7] hidden sm:inline border-l border-[#2c3338] pl-3">
              Howdy, <strong className="text-white">Admin</strong> 👤
            </span>
          </div>
        </header>

        {/* Global Toast */}
        {saveToast && (
          <div
            className={`py-2 px-6 text-xs font-semibold text-center sticky top-10 z-40 transition-all shadow-md ${
              saveToast.type === 'success'
                ? 'bg-[#00a32a] text-white'
                : 'bg-[#d63638] text-white'
            }`}
          >
            {saveToast.message}
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. BODY LAYOUT: FLUSH-LEFT SIDEBAR + FULL-WIDTH CONTENT */}
        {/* ======================================================== */}
        <div className="flex-1 flex w-full relative">
          {/* WordPress Left Admin Sidebar (#adminmenu) */}
          <aside
            id="adminmenu"
            className={`${
              mobileMenuOpen ? 'block' : 'hidden'
            } md:flex w-56 shrink-0 bg-[#1d2327] text-[#c3c4c7] flex-col justify-between border-r border-[#2c3338] z-30 sticky top-10 h-[calc(100vh-40px)] overflow-y-auto select-none`}
          >
            <div className="py-2 space-y-0.5">
              {/* Group: Core Operations */}
              <div className="px-3 pt-2 pb-1 text-[10px] uppercase font-bold text-[#8c8f94] tracking-wider">
                Operations
              </div>

              {/* 1. Registrations */}
              <button
                onClick={() => {
                  setActiveTab('registrations');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between border-l-4 ${
                  activeTab === 'registrations'
                    ? 'bg-[#2271b1] text-white border-[#72aee6] font-bold'
                    : 'border-transparent text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">📋</span>
                  <span>Registrations</span>
                </div>
                <span className="bg-[#2c3338] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalAttendees}
                </span>
              </button>

              {/* 2. Inquiries & Queries */}
              <button
                onClick={() => {
                  setActiveTab('queries');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between border-l-4 ${
                  activeTab === 'queries'
                    ? 'bg-[#2271b1] text-white border-[#72aee6] font-bold'
                    : 'border-transparent text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">💬</span>
                  <span>Queries &amp; Replies</span>
                </div>
                {pendingQueriesCount > 0 ? (
                  <span className="bg-[#dba617] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {pendingQueriesCount}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500">{queries.length}</span>
                )}
              </button>

              {/* Group: Conference Setup */}
              <div className="px-3 pt-4 pb-1 text-[10px] uppercase font-bold text-[#8c8f94] tracking-wider border-t border-[#2c3338]/60 mt-2">
                Conference Setup
              </div>

              {[
                { id: 'annual', label: 'Year, Dates & Hero', icon: '📅' },
                { id: 'venue', label: 'Venue & Location', icon: '📍' },
                { id: 'theme', label: 'Theme & Scripture', icon: '📖' },
                { id: 'speakers', label: 'Speakers Section', icon: '🎙️' },
                { id: 'schedule', label: 'Programme Schedule', icon: '⏱️' },
                { id: 'pricing', label: 'Accommodation & Fees', icon: '🏷️' },
                { id: 'books', label: 'Complimentary Books', icon: '📚' },
                { id: 'contact', label: 'Contact Details', icon: '📞' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center gap-2.5 border-l-4 ${
                    activeTab === item.id
                      ? 'bg-[#2271b1] text-white border-[#72aee6] font-bold'
                      : 'border-transparent text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6]'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}

              {/* Group: Tools */}
              <div className="px-3 pt-4 pb-1 text-[10px] uppercase font-bold text-[#8c8f94] tracking-wider border-t border-[#2c3338]/60 mt-2">
                Tools
              </div>

              <button
                onClick={handleStartNextYearEdition}
                className="w-full text-left px-3.5 py-2 text-xs text-[#dba617] hover:bg-[#2c3338] hover:text-white transition-colors flex items-center gap-2.5 border-l-4 border-transparent"
              >
                <span className="text-sm">⚡</span>
                <span>Annual Switcher</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('json');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center gap-2.5 border-l-4 ${
                  activeTab === 'json'
                    ? 'bg-[#2271b1] text-white border-[#72aee6] font-bold'
                    : 'border-transparent text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <span className="text-sm">⚙️</span>
                <span>Raw JSON Backup</span>
              </button>
            </div>

            {/* Bottom Sidebar Footer */}
            <div className="p-3 border-t border-[#2c3338] text-[11px] text-[#8c8f94] flex items-center justify-between">
              <span>AIPC Admin v2.0</span>
              <button
                onClick={handleReset}
                className="text-[#d63638] hover:underline text-[10px]"
                title="Reset defaults"
              >
                Reset Defaults
              </button>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* WordPress Main Content Area (#wpbody-content) */}
          {/* FULL WIDTH: spans from sidebar to right edge, no centering! */}
          {/* ======================================================== */}
          <main id="wpbody-content" className="flex-1 min-w-0 bg-[#f0f0f1] p-5 lg:p-7">
            {/* ======================================================== */}
            {/* VIEW 1: ATTENDEE REGISTRATIONS (WordPress Table View) */}
            {/* ======================================================== */}
            {activeTab === 'registrations' && (
              <div className="space-y-4">
                {/* Page Title & Action Buttons (WP Style) */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c3c4c7] pb-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-normal text-[#1d2327]">
                      Attendees &amp; Registrations
                    </h1>
                    <button
                      type="button"
                      onClick={() => setIsAddRegOpen(true)}
                      className="text-xs font-semibold text-[#2271b1] hover:text-[#135e96] bg-white hover:bg-[#f6f7f7] border border-[#2271b1] rounded px-2.5 py-1 shadow-sm transition-colors"
                    >
                      Add New Attendee
                    </button>
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="text-xs font-semibold text-gray-700 hover:text-black bg-white hover:bg-[#f6f7f7] border border-gray-300 rounded px-2.5 py-1 shadow-sm flex items-center gap-1 transition-colors"
                    >
                      <span>📥</span>
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div className="text-xs text-[#646970]">
                    Edition: <strong className="text-gray-900">{data.meta.year}</strong> &bull; Total Registered: <strong className="text-gray-900">{totalAttendees}</strong>
                  </div>
                </div>

                {/* WordPress View Sub-filters Links: All (6) | Confirmed (4) | Pending (2) */}
                <ul className="flex items-center gap-2 text-xs text-[#646970]">
                  <li>
                    <button
                      onClick={() => setRegStatusFilter('all')}
                      className={`hover:underline ${
                        regStatusFilter === 'all' ? 'font-bold text-[#1d2327]' : 'text-[#2271b1]'
                      }`}
                    >
                      All <span className="text-[#646970]">({totalAttendees})</span>
                    </button>{' '}
                    |
                  </li>
                  <li>
                    <button
                      onClick={() => setRegStatusFilter('confirmed')}
                      className={`hover:underline ${
                        regStatusFilter === 'confirmed' ? 'font-bold text-[#1d2327]' : 'text-[#2271b1]'
                      }`}
                    >
                      Confirmed <span className="text-[#646970]">({confirmedAttendees})</span>
                    </button>{' '}
                    |
                  </li>
                  <li>
                    <button
                      onClick={() => setRegStatusFilter('pending')}
                      className={`hover:underline ${
                        regStatusFilter === 'pending' ? 'font-bold text-[#1d2327]' : 'text-[#2271b1]'
                      }`}
                    >
                      Pending Payment <span className="text-[#646970]">({pendingAttendees})</span>
                    </button>{' '}
                    |
                  </li>
                  <li>
                    <button
                      onClick={() => setRegStatusFilter('cancelled')}
                      className={`hover:underline ${
                        regStatusFilter === 'cancelled' ? 'font-bold text-[#1d2327]' : 'text-[#2271b1]'
                      }`}
                    >
                      Cancelled <span className="text-[#646970]">({registrations.filter((r) => r.paymentStatus === 'cancelled').length})</span>
                    </button>
                  </li>
                </ul>

                {/* Metrics Summary Strip (Across Full Width) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 border border-[#c3c4c7] shadow-sm">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#646970] block">
                      Total Registered
                    </span>
                    <span className="text-xl font-bold text-[#1d2327] mt-0.5 block">
                      {totalAttendees} Pastors
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#00a32a] block">
                      Confirmed / Paid
                    </span>
                    <span className="text-xl font-bold text-[#00a32a] mt-0.5 block">
                      {confirmedAttendees} ({totalAttendees > 0 ? Math.round((confirmedAttendees / totalAttendees) * 100) : 0}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#dba617] block">
                      Pending Verification
                    </span>
                    <span className="text-xl font-bold text-[#dba617] mt-0.5 block">
                      {pendingAttendees} seats
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7F0401] block">
                      Realized Revenue
                    </span>
                    <span className="text-xl font-bold text-[#7F0401] mt-0.5 block">
                      ₹{totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Filter and Search Bar (WP Style) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-2.5 border border-[#c3c4c7] shadow-sm">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={regPlanFilter}
                      onChange={(e) => setRegPlanFilter(e.target.value)}
                      className="bg-white border border-[#8c8f94] text-xs py-1 px-2 text-[#2c3338] rounded-none focus:border-[#2271b1]"
                    >
                      <option value="all">Filter by Accommodation</option>
                      <option value="quadruple">Quadruple Sharing</option>
                      <option value="triple">Triple Sharing</option>
                      <option value="double">Double Sharing</option>
                    </select>

                    <button
                      type="button"
                      onClick={refreshRegistrations}
                      className="bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2271b1] border border-[#2271b1] text-xs font-semibold py-1 px-2.5 rounded-none"
                    >
                      Apply
                    </button>
                  </div>

                  <div className="relative w-full sm:w-72">
                    <input
                      type="search"
                      placeholder="Search attendees..."
                      value={regSearch}
                      onChange={(e) => setRegSearch(e.target.value)}
                      className="w-full bg-white border border-[#8c8f94] text-xs p-1.5 rounded-none text-[#2c3338] focus:border-[#2271b1] focus:outline-none"
                    />
                  </div>
                </div>

                {/* WordPress Table (#the-list) */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327] font-bold text-[11px]">
                        <th className="p-2.5 w-28">Reg ID</th>
                        <th className="p-2.5">Attendee Name</th>
                        <th className="p-2.5">Church &amp; City</th>
                        <th className="p-2.5">Contact Details</th>
                        <th className="p-2.5">Accommodation Tier</th>
                        <th className="p-2.5">Payment Status</th>
                        <th className="p-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f1]">
                      {filteredRegistrations.map((reg) => (
                        <tr
                          key={reg.id}
                          className="hover:bg-[#f6f7f7] transition-colors group"
                        >
                          <td className="p-2.5 font-mono font-bold text-gray-900 whitespace-nowrap">
                            {reg.id}
                          </td>

                          <td className="p-2.5">
                            <strong className="text-gray-900 font-semibold block">
                              {reg.firstName} {reg.lastName}
                            </strong>
                            <span className="text-[11px] text-[#646970]">
                              {reg.designation} &bull; {reg.age} yrs
                            </span>
                            {/* WP Row Action Links on Hover */}
                            <div className="text-[10px] space-x-1.5 pt-1 text-[#2271b1]">
                              <button
                                onClick={() => setSelectedReg(reg)}
                                className="hover:underline"
                              >
                                Edit Details
                              </button>
                              <span>|</span>
                              <button
                                onClick={() =>
                                  handleUpdateRegStatus(
                                    reg.id,
                                    reg.paymentStatus === 'confirmed' ? 'pending' : 'confirmed'
                                  )
                                }
                                className="hover:underline"
                              >
                                {reg.paymentStatus === 'confirmed' ? 'Mark Pending' : 'Confirm Payment'}
                              </button>
                              <span>|</span>
                              <button
                                onClick={() =>
                                  handleDeleteReg(reg.id, `${reg.firstName} ${reg.lastName}`)
                                }
                                className="text-[#b32d2e] hover:underline"
                              >
                                Trash
                              </button>
                            </div>
                          </td>

                          <td className="p-2.5">
                            <div className="font-medium text-gray-800" title={reg.church}>
                              {reg.church}
                            </div>
                            <span className="text-[11px] text-[#646970]">
                              {reg.city}, {reg.state}
                            </span>
                          </td>

                          <td className="p-2.5 whitespace-nowrap text-[11px]">
                            <a
                              href={`mailto:${reg.email}`}
                              className="text-[#2271b1] hover:underline block"
                            >
                              {reg.email}
                            </a>
                            <a
                              href={`tel:${reg.phone}`}
                              className="text-gray-700 font-mono hover:underline"
                            >
                              {reg.phone}
                            </a>
                          </td>

                          <td className="p-2.5 whitespace-nowrap">
                            <div className="font-semibold text-gray-900">{reg.planTitle}</div>
                            <span className="text-[11px] font-bold text-[#7F0401]">
                              ₹{reg.amount?.toLocaleString()}
                            </span>
                          </td>

                          <td className="p-2.5 whitespace-nowrap">
                            <select
                              value={reg.paymentStatus}
                              onChange={(e) =>
                                handleUpdateRegStatus(reg.id, e.target.value as any)
                              }
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 border rounded-none ${
                                reg.paymentStatus === 'confirmed'
                                  ? 'bg-[#edfaef] text-[#00a32a] border-[#00a32a]'
                                  : reg.paymentStatus === 'pending'
                                  ? 'bg-[#fcf9e8] text-[#dba617] border-[#dba617]'
                                  : 'bg-[#fcf0f1] text-[#d63638] border-[#d63638]'
                              }`}
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="pending">Pending</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="p-2.5 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedReg(reg)}
                              className="px-2 py-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs rounded-none shadow-sm"
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredRegistrations.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500 text-xs">
                            No attendees found matching current criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 2: QUERIES & INQUIRIES (WordPress Comments/Feedback Style) */}
            {/* ======================================================== */}
            {activeTab === 'queries' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c3c4c7] pb-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-normal text-[#1d2327]">
                      Visitor Queries &amp; Replies
                    </h1>
                    <button
                      type="button"
                      onClick={refreshQueries}
                      className="text-xs font-semibold text-gray-700 hover:text-black bg-white hover:bg-[#f6f7f7] border border-gray-300 rounded px-2.5 py-1 shadow-sm"
                    >
                      🔄 Refresh
                    </button>
                  </div>

                  <div className="text-xs text-[#646970]">
                    Total Queries: <strong className="text-gray-900">{queries.length}</strong> &bull; Pending: <strong className="text-[#d63638]">{pendingQueriesCount}</strong>
                  </div>
                </div>

                {/* Sub-filter links */}
                <ul className="flex items-center gap-2 text-xs text-[#646970]">
                  <li>
                    <button
                      onClick={() => setQueryStatusFilter('all')}
                      className={`hover:underline ${
                        queryStatusFilter === 'all' ? 'font-bold text-[#1d2327]' : 'text-[#2271b1]'
                      }`}
                    >
                      All <span className="text-[#646970]">({queries.length})</span>
                    </button>{' '}
                    |
                  </li>
                  <li>
                    <button
                      onClick={() => setQueryStatusFilter('pending')}
                      className={`hover:underline ${
                        queryStatusFilter === 'pending' ? 'font-bold text-[#1d2327]' : 'text-[#2271b1]'
                      }`}
                    >
                      Awaiting Reply <span className="text-[#646970]">({pendingQueriesCount})</span>
                    </button>{' '}
                    |
                  </li>
                  <li>
                    <button
                      onClick={() => setQueryStatusFilter('replied')}
                      className={`hover:underline ${
                        queryStatusFilter === 'replied' ? 'font-bold text-[#1d2327]' : 'text-[#2271b1]'
                      }`}
                    >
                      Replied &amp; Resolved <span className="text-[#646970]">({queries.filter((q) => q.status === 'replied').length})</span>
                    </button>
                  </li>
                </ul>

                {/* Search */}
                <div className="bg-white p-2.5 border border-[#c3c4c7] shadow-sm flex items-center justify-between">
                  <input
                    type="search"
                    placeholder="Search queries by name, email, question content..."
                    value={querySearch}
                    onChange={(e) => setQuerySearch(e.target.value)}
                    className="w-full max-w-md bg-white border border-[#8c8f94] text-xs p-1.5 text-[#2c3338] focus:border-[#2271b1] focus:outline-none"
                  />
                  <span className="text-xs text-[#646970] hidden sm:inline">
                    Showing {filteredQueries.length} of {queries.length} items
                  </span>
                </div>

                {/* Queries Feed */}
                <div className="space-y-3">
                  {filteredQueries.map((q) => {
                    const cleanPhone = q.phone.replace(/[^0-9]/g, '');
                    const whatsappLink = cleanPhone
                      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Hi ${q.name}, thank you for contacting the All India Pastors' Conference team regarding your inquiry.`
                        )}`
                      : null;

                    const emailSubject = encodeURIComponent(`Re: Inquiry - All India Pastors' Conference ${data.meta.year}`);
                    const emailBody = encodeURIComponent(
                      `Dear ${q.name},\n\nThank you for reaching out to us regarding AIPC ${data.meta.year}.\n\nIn response to your query:\n"${q.message}"\n\n\n\nWarm regards,\nAIPC Secretariat\nhttps://aipc.live`
                    );
                    const emailLink = `mailto:${q.email}?subject=${emailSubject}&body=${emailBody}`;

                    return (
                      <div
                        key={q.id}
                        className={`bg-white border p-4 shadow-sm transition-all ${
                          q.status === 'pending'
                            ? 'border-l-4 border-l-[#dba617] border-[#c3c4c7]'
                            : 'border-l-4 border-l-[#00a32a] border-[#c3c4c7]'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-2">
                          <div className="flex items-center gap-2">
                            <strong className="text-sm text-[#1d2327]">{q.name}</strong>
                            <span className="text-xs text-gray-500 font-mono">({q.id})</span>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-none ${
                                q.status === 'pending'
                                  ? 'bg-[#fcf9e8] text-[#dba617]'
                                  : 'bg-[#edfaef] text-[#00a32a]'
                              }`}
                            >
                              {q.status}
                            </span>
                          </div>
                          <span className="text-xs text-[#646970]">
                            {new Date(q.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-[#646970] mb-2.5">
                          <span>✉️ <a href={`mailto:${q.email}`} className="text-[#2271b1] hover:underline">{q.email}</a></span>
                          {q.phone && (
                            <span>📞 <a href={`tel:${q.phone}`} className="font-mono text-gray-800 hover:underline">{q.phone}</a></span>
                          )}
                        </div>

                        {/* Inquiry Quote */}
                        <div className="bg-[#f6f7f7] border border-[#dcdcde] p-3 text-xs text-[#1d2327] italic font-serif leading-relaxed mb-3">
                          &ldquo;{q.message}&rdquo;
                        </div>

                        {/* Reply Notes if logged */}
                        {q.status === 'replied' && q.replyNotes && (
                          <div className="bg-[#edfaef] border border-[#00a32a]/30 p-2.5 text-xs text-[#00a32a] mb-3">
                            <span className="font-bold block text-[11px] text-[#008a20]">
                              ✓ Reply Logged ({q.repliedAt ? new Date(q.repliedAt).toLocaleString() : 'Done'} by {q.repliedBy || 'Staff'})
                            </span>
                            <p className="text-gray-800 font-sans mt-0.5 not-italic">{q.replyNotes}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
                          <div className="flex items-center gap-2">
                            <a
                              href={emailLink}
                              className="px-2.5 py-1 bg-[#2271b1] hover:bg-[#135e96] text-white rounded-none font-semibold flex items-center gap-1 shadow-sm"
                            >
                              <span>✉️ Email Reply</span>
                            </a>
                            {whatsappLink && (
                              <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 bg-[#00a32a] hover:bg-[#008a20] text-white rounded-none font-semibold flex items-center gap-1 shadow-sm"
                              >
                                <span>💬 WhatsApp Reply</span>
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedQueryForReply(q);
                                setReplyNoteText(q.replyNotes || '');
                              }}
                              className="px-2.5 py-1 bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2c3338] border border-gray-300 rounded-none font-semibold"
                            >
                              📝 {q.status === 'replied' ? 'Edit Response Note' : 'Log Reply Note'}
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleQueryStatus(q.id, q.status)}
                              className="text-[#2271b1] hover:underline"
                            >
                              {q.status === 'replied' ? 'Mark as Pending' : 'Mark as Replied'}
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuery(q.id, q.name)}
                              className="text-[#b32d2e] hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredQueries.length === 0 && (
                    <div className="p-8 text-center bg-white border border-[#c3c4c7] text-gray-500 text-xs">
                      No queries found matching criteria.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 3: CONFERENCE SETTINGS (Two-Column WP Post Edit Style) */}
            {/* ======================================================== */}
            {activeTab !== 'registrations' && activeTab !== 'queries' && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c3c4c7] pb-3">
                  <h1 className="text-2xl font-normal text-[#1d2327]">
                    Conference Configuration &bull; AIPC {data.meta.year}
                  </h1>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveToBackend()}
                      disabled={isSaving}
                      className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold py-1.5 px-4 shadow-sm"
                    >
                      {isSaving ? 'Publishing...' : 'Publish Changes'}
                    </button>
                  </div>
                </div>

                {/* Two-Column Editor Layout: Left 72% Form | Right 28% Publish Box */}
                <div className="flex flex-col lg:flex-row gap-5 items-start">
                  {/* Left Column (Main Form Fields) */}
                  <div className="flex-1 w-full space-y-5">
                    {/* TAB: ANNUAL & HERO */}
                    {activeTab === 'annual' && (
                      <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-5">
                        <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2">
                          General Conference Metadata &amp; Hero Banner
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Conference Year
                            </label>
                            <input
                              type="text"
                              value={data.meta.year}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  meta: { ...data.meta, year: e.target.value },
                                  hero: { ...data.hero, mainHeading2: e.target.value },
                                })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs focus:border-[#2271b1] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Display Dates
                            </label>
                            <input
                              type="text"
                              value={data.meta.dates}
                              onChange={(e) =>
                                setData({ ...data, meta: { ...data.meta, dates: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs focus:border-[#2271b1] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Countdown Target
                            </label>
                            <input
                              type="text"
                              value={data.meta.targetDate}
                              onChange={(e) =>
                                setData({ ...data, meta: { ...data.meta, targetDate: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs focus:border-[#2271b1] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Hero Pre-title
                            </label>
                            <input
                              type="text"
                              value={data.hero.preTitle}
                              onChange={(e) =>
                                setData({ ...data, hero: { ...data.hero, preTitle: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs focus:border-[#2271b1] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Theme Highlight Word
                            </label>
                            <input
                              type="text"
                              value={data.hero.subtitleHighlight}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  hero: { ...data.hero, subtitleHighlight: e.target.value },
                                })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs font-bold text-[#7F0401] focus:border-[#2271b1] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Exposition Subtitle
                            </label>
                            <input
                              type="text"
                              value={data.hero.description}
                              onChange={(e) =>
                                setData({ ...data, hero: { ...data.hero, description: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Conference Tagline
                            </label>
                            <input
                              type="text"
                              value={data.hero.tagline}
                              onChange={(e) =>
                                setData({ ...data, hero: { ...data.hero, tagline: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
                            />
                          </div>
                        </div>

                        {/* Image Upload Box */}
                        <div className="p-3.5 bg-[#f6f7f7] border border-[#dcdcde] space-y-2">
                          <label className="block text-xs font-bold text-[#1d2327]">
                            Hero Background Banner Image
                          </label>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="w-28 h-16 bg-gray-900 overflow-hidden shrink-0 border border-gray-300">
                              <img src={data.hero.bgImage} alt="Hero" className="w-full h-full object-cover" />
                            </div>
                            <input
                              type="text"
                              value={data.hero.bgImage}
                              onChange={(e) =>
                                setData({ ...data, hero: { ...data.hero, bgImage: e.target.value } })
                              }
                              className="flex-1 w-full bg-white border border-[#8c8f94] p-1.5 text-xs font-mono"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleFileUpload('heroBg', (url) =>
                                  setData({ ...data, hero: { ...data.hero, bgImage: url } })
                                )
                              }
                              className="px-3 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold shrink-0"
                            >
                              Upload File
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1d2327] mb-1">
                            English Language Disclaimer Notice
                          </label>
                          <textarea
                            rows={2}
                            value={data.meta.englishDisclaimer}
                            onChange={(e) =>
                              setData({ ...data, meta: { ...data.meta, englishDisclaimer: e.target.value } })
                            }
                            className="w-full bg-white border border-[#8c8f94] p-2 text-xs font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB: VENUE & LOCATION */}
                    {activeTab === 'venue' && (
                      <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-5">
                        <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2">
                          Venue, Location &amp; Transit Directions
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Venue / Hotel Name
                            </label>
                            <input
                              type="text"
                              value={data.venue.mainCard.name}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  venue: {
                                    ...data.venue,
                                    mainCard: { ...data.venue.mainCard, name: e.target.value },
                                    mapCard: { ...data.venue.mapCard, title: e.target.value },
                                  },
                                })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              City &amp; Area Subtitle
                            </label>
                            <input
                              type="text"
                              value={data.venue.mapCard.subtitle}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  venue: {
                                    ...data.venue,
                                    mapCard: { ...data.venue.mapCard, subtitle: e.target.value },
                                  },
                                })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1d2327] mb-1">
                            Full Physical Address
                          </label>
                          <input
                            type="text"
                            value={data.venue.mainCard.address}
                            onChange={(e) =>
                              setData({
                                ...data,
                                venue: {
                                  ...data.venue,
                                  mainCard: { ...data.venue.mainCard, address: e.target.value },
                                },
                              })
                            }
                            className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1d2327] mb-1">
                            Google Maps Link
                          </label>
                          <input
                            type="text"
                            value={data.venue.mapCard.mapUrl}
                            onChange={(e) =>
                              setData({
                                ...data,
                                venue: {
                                  ...data.venue,
                                  mapCard: { ...data.venue.mapCard, mapUrl: e.target.value },
                                },
                              })
                            }
                            className="w-full bg-white border border-[#8c8f94] p-2 text-xs font-mono"
                          />
                        </div>

                        {/* Venue Photo */}
                        <div className="p-3.5 bg-[#f6f7f7] border border-[#dcdcde] space-y-2">
                          <label className="block text-xs font-bold text-[#1d2327]">
                            Venue Photo / Building Facade
                          </label>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="w-28 h-16 bg-gray-200 overflow-hidden shrink-0 border border-gray-300">
                              <img src={data.venue.mainCard.image} alt="Venue" className="w-full h-full object-cover" />
                            </div>
                            <input
                              type="text"
                              value={data.venue.mainCard.image}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  venue: {
                                    ...data.venue,
                                    mainCard: { ...data.venue.mainCard, image: e.target.value },
                                  },
                                })
                              }
                              className="flex-1 w-full bg-white border border-[#8c8f94] p-1.5 text-xs font-mono"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleFileUpload('venueImg', (url) =>
                                  setData({
                                    ...data,
                                    venue: {
                                      ...data.venue,
                                      mainCard: { ...data.venue.mainCard, image: url },
                                    },
                                  })
                                )
                              }
                              className="px-3 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold shrink-0"
                            >
                              Upload File
                            </button>
                          </div>
                        </div>

                        {/* Transport cards */}
                        <div className="space-y-3">
                          <span className="font-bold text-xs text-[#1d2327] block uppercase">
                            Transit Direction Instructions
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {data.venue.transport.map((t: any, idx: number) => (
                              <div key={idx} className="p-3 bg-[#f6f7f7] border border-[#dcdcde]">
                                <strong className="text-xs text-[#7F0401] block mb-1">{t.mode}</strong>
                                <textarea
                                  rows={3}
                                  value={t.desc}
                                  onChange={(e) => {
                                    const next = [...data.venue.transport];
                                    next[idx].desc = e.target.value;
                                    setData({ ...data, venue: { ...data.venue, transport: next } });
                                  }}
                                  className="w-full bg-white border border-[#8c8f94] p-1.5 text-xs"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: THEME & SCRIPTURE */}
                    {activeTab === 'theme' && (
                      <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-5">
                        <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2">
                          Biblical Theme &amp; Scripture Expositions
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Section Pre-title
                            </label>
                            <input
                              type="text"
                              value={data.theme.preTitle}
                              onChange={(e) =>
                                setData({ ...data, theme: { ...data.theme, preTitle: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Scripture Reference
                            </label>
                            <input
                              type="text"
                              value={data.theme.quoteRef}
                              onChange={(e) =>
                                setData({ ...data, theme: { ...data.theme, quoteRef: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1d2327] mb-1">
                            Scripture Passage Quote Text
                          </label>
                          <textarea
                            rows={4}
                            value={data.theme.quoteText}
                            onChange={(e) =>
                              setData({ ...data, theme: { ...data.theme, quoteText: e.target.value } })
                            }
                            className="w-full bg-white border border-[#8c8f94] p-2.5 text-xs font-serif italic"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Exposition Narrative 1
                            </label>
                            <textarea
                              rows={4}
                              value={data.theme.p1}
                              onChange={(e) =>
                                setData({ ...data, theme: { ...data.theme, p1: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Exposition Narrative 2
                            </label>
                            <textarea
                              rows={4}
                              value={data.theme.p2}
                              onChange={(e) =>
                                setData({ ...data, theme: { ...data.theme, p2: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1d2327] mb-1">
                            Topic Tags (Comma separated)
                          </label>
                          <input
                            type="text"
                            value={data.theme.tags.join(', ')}
                            onChange={(e) =>
                              setData({
                                ...data,
                                theme: {
                                  ...data.theme,
                                  tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                                },
                              })
                            }
                            className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB: SPEAKERS */}
                    {activeTab === 'speakers' && (
                      <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-5">
                        <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2">
                          Speakers Section &amp; Declaration
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Pre-heading
                            </label>
                            <input
                              type="text"
                              value={data.speakers.preHeading}
                              onChange={(e) =>
                                setData({ ...data, speakers: { ...data.speakers, preHeading: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Heading (Italic)
                            </label>
                            <input
                              type="text"
                              value={data.speakers.mainHeadingItalic}
                              onChange={(e) =>
                                setData({ ...data, speakers: { ...data.speakers, mainHeadingItalic: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs font-serif italic text-[#7F0401]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Heading (Rest)
                            </label>
                            <input
                              type="text"
                              value={data.speakers.mainHeadingRest}
                              onChange={(e) =>
                                setData({ ...data, speakers: { ...data.speakers, mainHeadingRest: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1d2327] mb-1">
                            Pastoral Statement &amp; Footnote
                          </label>
                          <textarea
                            rows={4}
                            value={data.speakers.footnote}
                            onChange={(e) =>
                              setData({ ...data, speakers: { ...data.speakers, footnote: e.target.value } })
                            }
                            className="w-full bg-white border border-[#8c8f94] p-2.5 text-xs leading-relaxed"
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB: SCHEDULE */}
                    {activeTab === 'schedule' && (
                      <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                          <h2 className="text-sm font-bold text-[#1d2327]">
                            Programme Schedule Editor
                          </h2>
                          <button
                            type="button"
                            onClick={() => {
                              const nextDays = { ...data.schedule.days };
                              nextDays[activeScheduleDay].events.push({
                                title: 'New Event / Session',
                                session: `Session 0${nextDays[activeScheduleDay].events.length + 1}`,
                                type: 'session',
                              });
                              setData({ ...data, schedule: { ...data.schedule, days: nextDays } });
                            }}
                            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-2.5 py-1"
                          >
                            + Add Event
                          </button>
                        </div>

                        <div className="flex items-center gap-1 border-b border-[#c3c4c7] pb-2">
                          {(['day1', 'day2', 'day3'] as const).map((dayKey) => (
                            <button
                              key={dayKey}
                              onClick={() => setActiveScheduleDay(dayKey)}
                              className={`px-3 py-1 text-xs font-semibold border-b-2 ${
                                activeScheduleDay === dayKey
                                  ? 'border-[#2271b1] text-[#2271b1] font-bold'
                                  : 'border-transparent text-gray-600 hover:text-black'
                              }`}
                            >
                              {data.schedule.days[dayKey].dayLabel} ({data.schedule.days[dayKey].date})
                            </button>
                          ))}
                        </div>

                        <div className="space-y-2">
                          {data.schedule.days[activeScheduleDay].events.map((evt: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-[#f6f7f7] border border-[#dcdcde]">
                              <span className="text-xs text-gray-400 w-5">#{idx + 1}</span>
                              <select
                                value={evt.type}
                                onChange={(e) => {
                                  const nextDays = { ...data.schedule.days };
                                  nextDays[activeScheduleDay].events[idx].type = e.target.value as any;
                                  setData({ ...data, schedule: { ...data.schedule, days: nextDays } });
                                }}
                                className="bg-white border border-[#8c8f94] text-xs p-1"
                              >
                                <option value="session">Session</option>
                                <option value="general">General</option>
                                <option value="break">Break / Meal</option>
                              </select>

                              {evt.type === 'session' && (
                                <input
                                  type="text"
                                  value={evt.session || ''}
                                  onChange={(e) => {
                                    const nextDays = { ...data.schedule.days };
                                    nextDays[activeScheduleDay].events[idx].session = e.target.value;
                                    setData({ ...data, schedule: { ...data.schedule, days: nextDays } });
                                  }}
                                  className="w-24 bg-white border border-[#8c8f94] text-xs p-1 font-mono"
                                  placeholder="Session 01"
                                />
                              )}

                              <input
                                type="text"
                                value={evt.title}
                                onChange={(e) => {
                                  const nextDays = { ...data.schedule.days };
                                  nextDays[activeScheduleDay].events[idx].title = e.target.value;
                                  setData({ ...data, schedule: { ...data.schedule, days: nextDays } });
                                }}
                                className="flex-1 bg-white border border-[#8c8f94] text-xs p-1 font-medium"
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  const nextDays = { ...data.schedule.days };
                                  nextDays[activeScheduleDay].events.splice(idx, 1);
                                  setData({ ...data, schedule: { ...data.schedule, days: nextDays } });
                                }}
                                className="text-red-600 hover:text-red-800 text-xs px-1.5 font-bold"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB: PRICING & ROOMS */}
                    {activeTab === 'pricing' && (
                      <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                          <h2 className="text-sm font-bold text-[#1d2327]">
                            Accommodation Sharing Tiers &amp; Fees
                          </h2>
                          <button
                            type="button"
                            onClick={() => {
                              const nextCards = [...data.pricing.cards];
                              nextCards.push({
                                id: `tier-${Date.now()}`,
                                title: 'Single Occupancy',
                                occupancy: 'Max 1 Guest',
                                price: '14,999',
                                badge: 'Early Bird',
                                features: ['2 nights', 'All meals', 'Sessions', 'Books'],
                                registerUrl: `/registration-${data.meta.year}`,
                              });
                              setData({ ...data, pricing: { ...data.pricing, cards: nextCards } });
                            }}
                            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-2.5 py-1"
                          >
                            + Add Tier
                          </button>
                        </div>

                        <div className="space-y-3">
                          {data.pricing.cards.map((c: any, idx: number) => (
                            <div key={idx} className="p-3 bg-[#f6f7f7] border border-[#dcdcde] space-y-2">
                              <div className="flex items-center justify-between">
                                <strong className="text-xs text-[#1d2327]">{c.title}</strong>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextCards = data.pricing.cards.filter((_: any, i: number) => i !== idx);
                                    setData({ ...data, pricing: { ...data.pricing, cards: nextCards } });
                                  }}
                                  className="text-[#d63638] text-xs hover:underline"
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                <div>
                                  <label className="text-[10px] text-gray-500 block">Title</label>
                                  <input
                                    type="text"
                                    value={c.title}
                                    onChange={(e) => {
                                      const nextCards = [...data.pricing.cards];
                                      nextCards[idx].title = e.target.value;
                                      setData({ ...data, pricing: { ...data.pricing, cards: nextCards } });
                                    }}
                                    className="w-full bg-white border border-[#8c8f94] p-1 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-gray-500 block">Price (₹)</label>
                                  <input
                                    type="text"
                                    value={c.price}
                                    onChange={(e) => {
                                      const nextCards = [...data.pricing.cards];
                                      nextCards[idx].price = e.target.value;
                                      setData({ ...data, pricing: { ...data.pricing, cards: nextCards } });
                                    }}
                                    className="w-full bg-white border border-[#8c8f94] p-1 text-xs font-bold text-[#7F0401]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-gray-500 block">Occupancy</label>
                                  <input
                                    type="text"
                                    value={c.occupancy}
                                    onChange={(e) => {
                                      const nextCards = [...data.pricing.cards];
                                      nextCards[idx].occupancy = e.target.value;
                                      setData({ ...data, pricing: { ...data.pricing, cards: nextCards } });
                                    }}
                                    className="w-full bg-white border border-[#8c8f94] p-1 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-gray-500 block">Badge</label>
                                  <input
                                    type="text"
                                    value={c.badge || ''}
                                    onChange={(e) => {
                                      const nextCards = [...data.pricing.cards];
                                      nextCards[idx].badge = e.target.value;
                                      setData({ ...data, pricing: { ...data.pricing, cards: nextCards } });
                                    }}
                                    className="w-full bg-white border border-[#8c8f94] p-1 text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB: BOOKS */}
                    {activeTab === 'books' && (
                      <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                          <h2 className="text-sm font-bold text-[#1d2327]">
                            Complimentary Books by Year
                          </h2>
                          <button
                            type="button"
                            onClick={() =>
                              handleFileUpload(`book-${activeBookYear}`, (url) => {
                                const list = data.books.booksData[activeBookYear] || [];
                                setData({
                                  ...data,
                                  books: {
                                    ...data.books,
                                    booksData: {
                                      ...data.books.booksData,
                                      [activeBookYear]: [...list, { img: url }],
                                    },
                                  },
                                });
                              })
                            }
                            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-2.5 py-1"
                          >
                            + Upload Book Cover
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1 border-b border-[#c3c4c7] pb-2">
                          {data.books.years.map((year: string) => (
                            <button
                              key={year}
                              onClick={() => setActiveBookYear(year)}
                              className={`px-3 py-1 text-xs font-semibold border-b-2 ${
                                activeBookYear === year
                                  ? 'border-[#2271b1] text-[#2271b1] font-bold'
                                  : 'border-transparent text-gray-600'
                              }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {(data.books.booksData[activeBookYear] || []).map((b: any, idx: number) => (
                            <div key={idx} className="p-2 bg-[#f6f7f7] border border-[#dcdcde] text-center">
                              <img src={b.img} alt="Book" className="w-full h-32 object-cover mb-2" />
                              <button
                                type="button"
                                onClick={() => {
                                  const list = data.books.booksData[activeBookYear].filter((_: any, i: number) => i !== idx);
                                  setData({
                                    ...data,
                                    books: {
                                      ...data.books,
                                      booksData: { ...data.books.booksData, [activeBookYear]: list },
                                    },
                                  });
                                }}
                                className="text-[11px] text-[#d63638] hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB: CONTACT */}
                    {activeTab === 'contact' && (
                      <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-4">
                        <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2">
                          Contact Channels &amp; FAQ Content
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Support Email
                            </label>
                            <input
                              type="email"
                              value={data.contact.email}
                              onChange={(e) =>
                                setData({ ...data, contact: { ...data.contact, email: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1d2327] mb-1">
                              Phone Numbers
                            </label>
                            <input
                              type="text"
                              value={data.contact.phone}
                              onChange={(e) =>
                                setData({ ...data, contact: { ...data.contact, phone: e.target.value } })
                              }
                              className="w-full bg-white border border-[#8c8f94] p-2 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1d2327] mb-1">
                            WhatsApp Direct Link
                          </label>
                          <input
                            type="text"
                            value={data.contact.whatsappUrl}
                            onChange={(e) =>
                              setData({ ...data, contact: { ...data.contact, whatsappUrl: e.target.value } })
                            }
                            className="w-full bg-white border border-[#8c8f94] p-2 text-xs font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB: RAW JSON */}
                    {activeTab === 'json' && (
                      <div className="bg-white border border-[#c3c4c7] shadow-sm p-5 space-y-4">
                        <h2 className="text-sm font-bold text-[#1d2327] border-b border-gray-200 pb-2">
                          Raw Database Store (`data/conference.json`)
                        </h2>
                        <textarea
                          rows={24}
                          value={jsonText}
                          onChange={(e) => setJsonText(e.target.value)}
                          className="w-full bg-[#1d2327] text-[#72aee6] p-3 text-xs font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column: WordPress "Publish / Meta Box" (28% Width) */}
                  <div className="w-full lg:w-72 shrink-0 space-y-4">
                    {/* Publish Box */}
                    <div className="bg-white border border-[#c3c4c7] shadow-sm">
                      <div className="p-3 border-b border-[#c3c4c7] font-bold text-xs text-[#1d2327] bg-[#f6f7f7]">
                        Publish
                      </div>
                      <div className="p-3.5 space-y-2.5 text-xs text-[#646970]">
                        <div className="flex items-center justify-between">
                          <span>Status:</span>
                          <strong className="text-[#00a32a]">Live Published</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Active Edition:</span>
                          <strong className="text-gray-900">{data.meta.year}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Host City:</span>
                          <strong className="text-gray-900">{data.venue.mapCard.subtitle}</strong>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                          <Link href="/" target="_blank" className="text-[#2271b1] hover:underline">
                            Preview Site ↗
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleSaveToBackend()}
                            disabled={isSaving}
                            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold py-1.5 px-3.5 shadow-sm"
                          >
                            {isSaving ? 'Updating...' : 'Update'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Annual Edition Quick Switcher Box */}
                    <div className="bg-white border border-[#c3c4c7] shadow-sm">
                      <div className="p-3 border-b border-[#c3c4c7] font-bold text-xs text-[#1d2327] bg-[#f6f7f7]">
                        Annual Transition
                      </div>
                      <div className="p-3.5 text-xs text-[#646970] space-y-3">
                        <p>
                          Move conference to next calendar year and new city across all public pages in 1 click.
                        </p>
                        <button
                          type="button"
                          onClick={handleStartNextYearEdition}
                          className="w-full bg-[#dba617] hover:bg-[#c29314] text-black text-xs font-bold py-1.5 px-3 shadow-sm"
                        >
                          ⚡ Prepare Next Year ({parseInt(data.meta.year || '2026', 10) + 1})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* ======================================================== */}
        {/* MODAL: ATTENDEE DETAILS */}
        {/* ======================================================== */}
        {selectedReg && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-none border border-[#c3c4c7] max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#c3c4c7] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#1d2327]">
                    {selectedReg.firstName} {selectedReg.lastName}
                  </h3>
                  <span className="text-xs font-mono text-gray-500">ID: {selectedReg.id}</span>
                </div>
                <button onClick={() => setSelectedReg(null)} className="text-gray-400 hover:text-black font-bold">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">Payment Status</label>
                  <select
                    value={selectedReg.paymentStatus}
                    onChange={(e) => setSelectedReg({ ...selectedReg, paymentStatus: e.target.value as any })}
                    className="w-full bg-white border border-[#8c8f94] p-1.5"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">Payment Ref / Transaction ID</label>
                  <input
                    type="text"
                    value={selectedReg.paymentReference || ''}
                    onChange={(e) => setSelectedReg({ ...selectedReg, paymentReference: e.target.value })}
                    className="w-full bg-white border border-[#8c8f94] p-1.5 font-mono"
                    placeholder="e.g. UPI-9820145678"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">Notes &amp; Room Allocation</label>
                  <textarea
                    rows={3}
                    value={selectedReg.notes || ''}
                    onChange={(e) => setSelectedReg({ ...selectedReg, notes: e.target.value })}
                    className="w-full bg-white border border-[#8c8f94] p-1.5"
                    placeholder="e.g. Room #204 with Pastor John"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setSelectedReg(null)}
                  className="px-3 py-1.5 bg-[#f6f7f7] border border-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveRegDetails}
                  className="px-3.5 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: ADD ATTENDEE MANUALLY */}
        {/* ======================================================== */}
        {isAddRegOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-none border border-[#c3c4c7] max-w-xl w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#c3c4c7] pb-3">
                <h3 className="text-base font-bold text-[#1d2327]">Register Attendee Manually</h3>
                <button onClick={() => setIsAddRegOpen(false)} className="text-gray-400 hover:text-black font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateAttendee} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1d2327] mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={newAttendee.firstName}
                      onChange={(e) => setNewAttendee({ ...newAttendee, firstName: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1d2327] mb-1">Last Name</label>
                    <input
                      type="text"
                      value={newAttendee.lastName}
                      onChange={(e) => setNewAttendee({ ...newAttendee, lastName: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] p-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1d2327] mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={newAttendee.email}
                      onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1d2327] mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={newAttendee.phone}
                      onChange={(e) => setNewAttendee({ ...newAttendee, phone: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] p-1.5 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1d2327] mb-1">Church Name</label>
                    <input
                      type="text"
                      value={newAttendee.church}
                      onChange={(e) => setNewAttendee({ ...newAttendee, church: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1d2327] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={newAttendee.city}
                      onChange={(e) => setNewAttendee({ ...newAttendee, city: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] p-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1d2327] mb-1">Accommodation Plan</label>
                    <select
                      value={newAttendee.planId}
                      onChange={(e) => {
                        const plan = data.pricing.cards.find((c: any) => c.id === e.target.value);
                        setNewAttendee({
                          ...newAttendee,
                          planId: e.target.value,
                          planTitle: plan?.title || e.target.value,
                          amount: plan ? parseInt(plan.price.replace(/,/g, ''), 10) : 5999,
                        });
                      }}
                      className="w-full bg-white border border-[#8c8f94] p-1.5"
                    >
                      {data.pricing.cards.map((c: any) => (
                        <option key={c.id} value={c.id}>
                          {c.title} (₹{c.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1d2327] mb-1">Payment Status</label>
                    <select
                      value={newAttendee.paymentStatus}
                      onChange={(e) => setNewAttendee({ ...newAttendee, paymentStatus: e.target.value as any })}
                      className="w-full bg-white border border-[#8c8f94] p-1.5"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsAddRegOpen(false)}
                    className="px-3 py-1.5 bg-[#f6f7f7] border border-gray-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold"
                  >
                    Add Attendee
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: QUERY REPLY */}
        {/* ======================================================== */}
        {selectedQueryForReply && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-none border border-[#c3c4c7] max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#c3c4c7] pb-3">
                <h3 className="text-base font-bold text-[#1d2327]">
                  Log Response for {selectedQueryForReply.name}
                </h3>
                <button onClick={() => setSelectedQueryForReply(null)} className="text-gray-400 hover:text-black font-bold">
                  ✕
                </button>
              </div>

              <div className="bg-[#f6f7f7] p-3 text-xs italic font-serif text-gray-800 border border-gray-200">
                &ldquo;{selectedQueryForReply.message}&rdquo;
              </div>

              <form onSubmit={handleSaveQueryReply} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">Reply Notes / Advice Given *</label>
                  <textarea
                    rows={4}
                    required
                    value={replyNoteText}
                    onChange={(e) => setReplyNoteText(e.target.value)}
                    className="w-full bg-white border border-[#8c8f94] p-2"
                    placeholder="e.g. Sent email answering room allocation questions."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setSelectedQueryForReply(null)}
                    className="px-3 py-1.5 bg-[#f6f7f7] border border-gray-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#00a32a] hover:bg-[#008a20] text-white text-xs font-semibold"
                  >
                    Save &amp; Mark as Replied
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = getConferenceData();
  const registrations = getRegistrations();
  const queries = getQueries();

  return {
    props: {
      initialData: data,
      initialRegistrations: registrations,
      initialQueries: queries,
    },
  };
};
