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
    <nav className={`w-full ${className}`} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-stuff-light">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="flex items-center gap-1 hover:text-stuff-primary transition-colors">
                  {item.icon && <span className="text-stuff-primary">{item.icon}</span>}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ) : (
                <span className={`flex items-center gap-1 font-extrabold text-stuff-light ${isLast ? '' : ''}`}> 
                  {item.icon && <span className="text-stuff-primary">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
              {!isLast && (
                <span className="mx-1 text-stuff-light" aria-hidden="true">
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