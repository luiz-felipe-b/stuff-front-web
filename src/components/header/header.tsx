"use client"

import { Home, Building, Boxes, Users, Settings,  } from "lucide-react";

// import "./header.css";

import HeaderNavLink from "./HeaderNavLink";
import UserDropdown from "./UserDropdown";
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";

interface HeaderProps {
    activeTab?: string;
    showNav?: boolean;
}

export default function Header({ activeTab = "home", showNav = true }: HeaderProps) {
    const { organization } = useSelectedOrganization();
    const orgBase = organization ? `/organization/${organization.slug}` : "";
    return (
        <header className="sticky top-0 z-30 flex flex-col w-full items-center bg-stuff-white rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] border-2 border-stuff-light mb-4 mx-4 px-4 py-3">
            <div className="flex flex-row items-center justify-between w-full py-4">
                <img src="/logo-stuff-orange.svg" alt="Stuff logo" className="h-12" />
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
                      active={activeTab === "asset" || activeTab === "assets"}
                  >
                      ativos
                  </HeaderNavLink>
                  {/* <HeaderNavLink
                      href="/organization/"
                      icon={Users}
                      active={activeTab === "organization"}
                  >
                      organizações
                  </HeaderNavLink> */}
                  <HeaderNavLink
                      href={organization ? `${orgBase}/reports` : "/organization"}
                      icon={Boxes}
                      active={activeTab === "reports"}
                      disabled
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
