"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface SelectedOrganizationContextType {
  organization: Organization | null;
  setOrganization: (org: Organization | null) => void;
}

const SelectedOrganizationContext = createContext<SelectedOrganizationContextType | undefined>(undefined);

export const SelectedOrganizationProvider = ({ children }: { children: ReactNode }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  return (
    <SelectedOrganizationContext.Provider value={{ organization, setOrganization }}>
      {children}
    </SelectedOrganizationContext.Provider>
  );
};

export const useSelectedOrganization = () => {
  const ctx = useContext(SelectedOrganizationContext);
  if (!ctx) throw new Error("useSelectedOrganization must be used within SelectedOrganizationProvider");
  return ctx;
};
