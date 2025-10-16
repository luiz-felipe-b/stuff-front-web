"use client";

import { useUser } from "../../context/UserContext";
import { useSelectedOrganization } from "@/context/SelectedOrganizationContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./UserDropdown.css";

const UserDropdown = () => {
  const { user, setUser } = useUser();
  const { setOrganization } = useSelectedOrganization();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  async function handleLogout() {
    try {
      await fetch("/auth/logout", { method: "POST" });
    } catch (e) {
      // Se der erro, ainda assim faz logout local
    }
    setUser(null);
    setOrganization(null);
    router.push("/");
  }

  // function handleLogin() {
  //   router.push("/pages/login");
  // }

  return (
    <div className="user-dropdown">
      <div className="user-dropdown-trigger" onClick={() => setOpen((v) => !v)}>
        <div className="user-dropdown-avatar">{initials}</div>
        <span className="user-dropdown-name">
          {user.firstName} {user.lastName}
        </span>
        <span className="user-dropdown-arrow">▼</span>
      </div>
      {open && (
        <div className="user-dropdown-menu">
          <button className="user-dropdown-btn" onClick={() => {router.push("/pages/profile")}}>
            Ver meu perfil
          </button>
          <button className="user-dropdown-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;