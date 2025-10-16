"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface SelectedOrganizationContextType {
  organization: Organization | null;
  setOrganization: (org: Organization | null) => void;
  hydrated: boolean;
}

const SelectedOrganizationContext = createContext<SelectedOrganizationContextType | undefined>(undefined);


export const SelectedOrganizationProvider = ({ children }: { children: ReactNode }) => {
  const [organization, setOrganizationState] = useState<Organization | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // On mount, load from localStorage
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('selectedOrganization') : null;
    if (stored) {
      try {
        setOrganizationState(JSON.parse(stored));
      } catch {
        setOrganizationState(null);
      }
    }
    setHydrated(true);
  }, []);

  // Setter that syncs to localStorage
  const setOrganization = (org: Organization | null) => {
    setOrganizationState(org);
    if (typeof window !== 'undefined') {
      if (org) {
        localStorage.setItem('selectedOrganization', JSON.stringify(org));
      } else {
        localStorage.removeItem('selectedOrganization');
      }
    }
  };

  return (
    <SelectedOrganizationContext.Provider value={{ organization, setOrganization, hydrated }}>
      {hydrated ? children : null}
    </SelectedOrganizationContext.Provider>
  );
};


export const useSelectedOrganization = () => {
  const ctx = useContext(SelectedOrganizationContext);
  if (!ctx) throw new Error("useSelectedOrganization must be used within SelectedOrganizationProvider");
  return ctx;
}
