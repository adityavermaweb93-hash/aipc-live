import React, { createContext, useContext, useState, useEffect } from 'react';
import { conferenceData as defaultData } from '@/data/conferenceData';

type ConferenceDataType = typeof defaultData;

const ConferenceContext = createContext<{
  data: ConferenceDataType;
  setData: (data: ConferenceDataType) => void;
  refresh: () => Promise<void>;
}>({
  data: defaultData,
  setData: () => {},
  refresh: async () => {},
});

export function ConferenceProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: ConferenceDataType;
}) {
  const [data, setData] = useState<ConferenceDataType>(initialData || defaultData);

  const refresh = async () => {
    try {
      const res = await fetch('/api/conference?t=' + Date.now(), {
        cache: 'no-store',
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (e) {
      console.error('Failed to refresh conference data:', e);
    }
  };

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
    // Always refresh latest data on client mount
    refresh();

    // Auto-refresh when returning to this tab after updating in /admin
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', refresh);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', refresh);
    };
  }, [initialData]);

  return (
    <ConferenceContext.Provider value={{ data, setData, refresh }}>
      {children}
    </ConferenceContext.Provider>
  );
}

export function useConference(): ConferenceDataType {
  const context = useContext(ConferenceContext);
  return context?.data || defaultData;
}

export function useConferenceContext() {
  return useContext(ConferenceContext);
}
