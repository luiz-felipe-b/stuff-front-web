"use client"

import { Home, Building, Boxes, Users, Settings,  } from "lucide-react";

// import "./header.css";
import HeaderNavLink from "./HeaderNavLink";
import UserDropdown from "./UserDropdown";

interface HeaderProps {
    activeTab?: string;
}

export default function Header({ activeTab = "home" }: HeaderProps) {
    return (
        <>
           <div className="h-4"></div>
            <header className="flex flex-col items-center bg-stuff-white rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] border-2 border-stuff-light mb-8 mx-4 px-4 py-3">
                <div className="flex flex-row items-center justify-between w-full py-2 pb-6">
                        <img src="/logo-stuff-orange.svg" alt="Stuff logo" className="h-12" />
                    <UserDropdown />
                </div>
                <nav className="flex flex-row items-center gap-2 md:gap-4 w-full overflow-x-auto">
                    <HeaderNavLink
                        href="/dashboard"
                        icon={Home}
                        active={activeTab === "home"}
                    >
                        início
                    </HeaderNavLink>
                    <HeaderNavLink
                        href="/asset/"
                        icon={Boxes}
                        active={activeTab === "asset"}
                        disabled
                    >
                        ativos
                    </HeaderNavLink>
                    <HeaderNavLink
                        href="/organization/"
                        icon={Users}
                        active={activeTab === "organization"}
                    >
                        organizações
                    </HeaderNavLink>
                    <HeaderNavLink
                        href="/reports/"
                        icon={Boxes}
                        active={activeTab === "reports"}
                        disabled
                    >
                        relatórios
                    </HeaderNavLink>
                    <HeaderNavLink
                        href="/settings/"
                        icon={Settings}
                        active={activeTab === "settings"}
                        disabled
                    >
                        configurações
                    </HeaderNavLink>
                </nav>
            </header>
        </>
    );
}
