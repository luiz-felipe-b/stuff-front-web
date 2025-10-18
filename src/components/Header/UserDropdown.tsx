"use client";

import { useUser } from "../../context/UserContext";
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { User as UserIcon, ChevronDown, LogOut, UserRound } from "lucide-react";

const UserDropdown = () => {
  const { user, setUser } = useUser();
  const { setOrganization } = useSelectedOrganization();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  async function handleLogout() {
    try {
      await fetch("/auth/logout", { method: "POST" });
    } catch (e) {
      // Se der erro, ainda assim faz logout local
    }
    setUser(null);
    router.push("/");
  }

  // function handleLogin() {
  //   router.push("/pages/login");
  // }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stuff-white cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-stuff-light text-stuff-white font-bold text-xl">
          {initials || <UserIcon size={22} />}
        </span>
        <span className="font-semibold text-stuff-light text-lg ml-2">
          {user.firstName} {user.lastName}
        </span>
        <ChevronDown className={`ml-2 text-stuff-light transition-transform ${open ? "rotate-180" : "rotate-0"}`} size={20} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-[180px] bg-stuff-white rounded-b-xl border-x border-b border-stuff-light z-50 flex flex-col py-2 animate-fade-in shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
          <button
            className="flex items-center gap-2 px-5 py-2 text-stuff-dark hover:bg-stuff-light transition-colors w-full text-left text-base cursor-pointer"
            onClick={() => {router.push("/pages/profile")}}
          >
            <UserRound size={20} className="text-stuff-mid" />
            perfil
          </button>
          <div className="border-t border-stuff-light my-1" />
          <button
            className="flex items-center gap-2 px-5 py-2 text-danger-base hover:bg-danger-light/60 transition-colors w-full text-left text-base cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut size={20} className="text-danger-base" />
            sair
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;