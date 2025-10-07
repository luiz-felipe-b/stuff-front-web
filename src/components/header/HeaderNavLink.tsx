import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface HeaderNavLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

const HeaderNavLink: React.FC<HeaderNavLinkProps> = ({ href, icon: Icon, children, active = false, disabled = false }) => {
  if (disabled) {
    return (
      <span
        className={`flex flex-col items-center px-3 pt-2 rounded-lg font-medium text-base transition-colors opacity-60 cursor-not-allowed hover:bg-transparent
          ${active ? "text-stuff-mid" : "text-stuff-gray-100"}
        `}
        tabIndex={-1}
        aria-disabled="true"
      >
        <Icon size={20} /> {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`flex flex-col text-center justify-center items-center px-3 pt-2 rounded-lg font-medium text-base transition-colors leading-loose hover:bg-stuff-high/40 
        ${active ? "text-stuff-mid" : "text-stuff-gray-200"}
      `}
      tabIndex={0}
      prefetch={false}
    >
      <Icon size={20} /> {children}
    </Link>
  );
};

export default HeaderNavLink;
