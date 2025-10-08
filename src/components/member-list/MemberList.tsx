"use client";
import React from "react";
import Loader from "@/components/Loader/Loader";
import { Users, Trash, Shield, ShieldCheck } from "lucide-react";

export interface Member {
  id: string;
  email: string;
  role: string;
}

interface MemberListProps {
  members: Member[];
  loading?: boolean;
  onUpdateRole: (userId: string, newRole: string) => void;
  onDelete: (userId: string) => void;
}

const getRoleIcon = (role: string) => {
  return role === "admin" ? <ShieldCheck size={16} /> : <Shield size={16} />;
};

const MemberList: React.FC<MemberListProps> = ({
  members,
  loading = false,
  onUpdateRole,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader label="Carregando membros..." />
      </div>
    );
  }
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-stuff-gray-100">
        <Users size={48} className="mb-2" />
        <h3 className="text-lg font-semibold">Nenhum membro encontrado</h3>
        <p>Adicione membros à organização usando o formulário acima.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex flex-row items-center justify-between bg-white border-2 border-stuff-gray-100 rounded-2xl px-6 py-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.06)] transition-all hover:shadow-[8px_8px_0_0_rgba(0,0,0,0.10)] hover:border-stuff-primary/40"
        >
          <div className="flex flex-row items-center gap-4 min-w-0">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-stuff-primary/10">
              <Users size={28} className="text-stuff-primary" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-stuff-dark text-lg truncate">{member.email}</h4>
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                  member.role === "admin"
                    ? "bg-stuff-success/10 text-stuff-success"
                    : "bg-stuff-gray-100 text-stuff-mid"
                }`}
              >
                {getRoleIcon(member.role)}
                <span>
                  {member.role === "admin" ? "Administrador" : "Membro"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2 ml-4">
            <select
              value={member.role}
              onChange={(e) => onUpdateRole(member.id, e.target.value)}
              className="border border-stuff-gray-100 rounded-lg px-3 py-2 text-sm font-medium bg-stuff-gray-50 focus:outline-none focus:ring-2 focus:ring-stuff-primary/30 transition-colors"
              disabled={loading}
            >
              <option value="membro">Membro</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={() => onDelete(member.id)}
              disabled={loading}
              className="ml-1 px-2 py-2 rounded-full bg-stuff-danger/90 text-white hover:bg-stuff-danger hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-stuff-danger/30"
              title="Remover membro"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
