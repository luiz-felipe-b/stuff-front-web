"use client"

import { Home, Building, Boxes, Users, Settings, ClipboardList,  } from "lucide-react";

// import "./header.css";

import HeaderNavLink from "./HeaderNavLink";
import UserDropdown from "./UserDropdown";
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";

interface HeaderProps {
    activeTab?: string;
    showNav?: boolean;
    organizationName?: string;
}

export default function Header({ activeTab = "home", showNav = true, organizationName }: HeaderProps) {
    const { organization } = useSelectedOrganization();
    const orgBase = organization ? `/organization/${organization.slug}` : "";
    return (
        <header className="sticky top-0 z-30 flex flex-col w-full items-center bg-stuff-white rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] border-2 border-stuff-light mb-4 mx-4 px-4 py-3">
            <div className="flex flex-row items-center justify-between w-full py-4">
                <div className="flex items-center gap-8">
                  <img src="/logo-stuff-orange.svg" alt="Stuff logo" className="h-12" />
                  {organizationName && (
                  <div className="flex gap-2 text-stuff-light items-center">
                    <Building strokeWidth={2} className="h-8"/>
                        
                            <span className="font-bold text-lg text-stuff-light truncate max-w-xs" title={organizationName}>{organizationName}</span>
                  </div>
                  )}
                </div>
                <UserDropdown />
            </div>
            {showNav && (
              <nav className="flex flex-row items-center gap-2 md:gap-4 w-full overflow-x-auto">
                  <HeaderNavLink
                      href={organization ? `${orgBase}` : "/organization"}
                      icon={Home}
                      active={activeTab === "home"}
                  >
                      início
                  </HeaderNavLink>
                  <HeaderNavLink
                      href={organization ? `${orgBase}/assets` : "/organization"}
                      icon={Boxes}
                      active={activeTab === "assets"}
                  >
                      ativos
                  </HeaderNavLink>
                  <HeaderNavLink
                      href={organization ? `${orgBase}/members` : "/organization"}
                      icon={Users}
                      active={activeTab === "members"}
                  >
                      membros
                  </HeaderNavLink>
                  <HeaderNavLink
                      href={organization ? `${orgBase}/reports` : "/organization"}
                      icon={ClipboardList}
                      active={activeTab === "reports"}
                  >
                      relatórios
                  </HeaderNavLink>
                  <HeaderNavLink
                      href={organization ? `${orgBase}/settings` : "/organization"}
                      icon={Settings}
                      active={activeTab === "settings"}
                      disabled
                  >
                      configurações
                  </HeaderNavLink>
              </nav>
            )}
        </header>
    );
}
