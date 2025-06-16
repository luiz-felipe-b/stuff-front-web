"use client"

import { Home, Building, Boxes } from "lucide-react";
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
                                        <Link href="/pages/organization/" className={`nav-option ${activeTab === "organization" ? "active" : ""}`}>
                                                <Building /> organizações
                                        </Link>
                                        <Link href="/pages/assets" className={`nav-option ${activeTab === "assets" ? "active" : ""}`}>
                                                <Boxes /> ativos
                                        </Link>
                                </nav>
                        </header>
                </>
        );
}
