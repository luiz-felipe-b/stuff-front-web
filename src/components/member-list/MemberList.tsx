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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex flex-row items-center justify-between bg-stuff-gray-50 rounded-lg p-4 shadow-sm"
        >
          <div className="flex flex-row items-center gap-3">
            <div className="bg-stuff-primary/10 rounded-full p-2">
              <Users size={24} className="text-stuff-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-stuff-black text-base">{member.email}</h4>
              <div
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  member.role === "admin"
                    ? "bg-stuff-success/10 text-stuff-success"
                    : "bg-stuff-gray-100 text-stuff-mid"
                }`}
              >
                {getRoleIcon(member.role)}
                <span className="ml-1">
                  {member.role === "admin" ? "Administrador" : "Membro"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <select
              value={member.role}
              onChange={(e) => onUpdateRole(member.id, e.target.value)}
              className="border border-stuff-gray-100 rounded-lg px-2 py-1 text-sm focus:outline-none"
              disabled={loading}
            >
              <option value="membro">Membro</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={() => onDelete(member.id)}
              disabled={loading}
              className="ml-1 px-2 py-1 rounded bg-stuff-danger text-white hover:bg-stuff-danger-dark transition-colors"
              title="Remover membro"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
