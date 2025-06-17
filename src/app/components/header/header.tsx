"use client"

import { Home, Building, Boxes, Users, Settings,  } from "lucide-react";

import "./header.css";
import Link from "next/link";

interface HeaderProps {
    activeTab?: string;
}

export default function Header({ activeTab = "home" }: HeaderProps) {
        return (
                <>
                        <header className="header">
                                <div className="header-content">
                                        <h2 className="logo">stuff.</h2>
                                </div>
                                <nav className="nav">
                                        <Link href="/pages/dashboard" className={`nav-option ${activeTab === "home" ? "active" : ""}`}>
                                                <Home /> início
                                        </Link>
                                        <Link href="/pages/asset/" className={`nav-option disabled ${activeTab === "asset" ? "active" : ""}`}>
                                                <Boxes /> meus ativos
                                        </Link>
                                        <Link href="/pages/organization/" className={`nav-option ${activeTab === "organization" ? "active" : ""}`}>
                                                <Users /> organizações
                                        </Link>
                                        <Link href="/pages/reports/" className={`nav-option disabled ${activeTab === "reports" ? "active" : ""}`}>
                                                <Boxes /> relatórios
                                        </Link>
                                        <Link href="/pages/settings/" className={`nav-option disabled ${activeTab === "settings" ? "active" : ""}`}>
                                                <Settings /> configurações
                                        </Link>                                       


                                </nav>
                        </header>
                </>
        );
}
