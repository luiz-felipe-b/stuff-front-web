"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
// import "./breadcrumb.css";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  separator?: React.ReactNode;
  className?: string;
}

export default function Breadcrumb({ 
  items, 
  showHome = false, 
  separator = <ChevronRight size={16} />,
  className = ""
}: BreadcrumbProps) {
  const breadcrumbItems = showHome 
    ? [{ label: "Início", href: "/pages/dashboard", icon: <Home size={16} /> }, ...items]
    : items;

  return (
    <nav className={`breadcrumb ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={index} className="breadcrumb-item">
              {item.href && !isLast ? (
                <Link href={item.href} className="breadcrumb-link">
                  {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                  <span className="breadcrumb-text">{item.label}</span>
                </Link>
              ) : (
                <span className={`breadcrumb-current ${isLast ? 'current' : ''}`}>
                  {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                  <span className="breadcrumb-text">{item.label}</span>
                </span>
              )}
              
              {!isLast && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}