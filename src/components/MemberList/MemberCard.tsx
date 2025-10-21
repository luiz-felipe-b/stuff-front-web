import React from "react";
import { Users, Trash, Shield, ShieldCheck, Mail } from "lucide-react";
import Button from "../Button/Button";
import Select from "../Select/Select";
import { Member } from "./MemberList";


// Helper to get initials from email
const getInitials = (email: string) => {
  const [name] = email.split("@");
  return name
    .split(/[._-]/)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2);
};

const getRoleIcon = (role: string) => {
  return role === "admin" ? <ShieldCheck size={16} /> : <Shield size={16} />;
};

export interface MemberCardProps {
  member: Member;
  loading: boolean;
  onUpdateRole: (userId: string, newRole: string) => void;
  onDelete: (userId: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, loading, onUpdateRole, onDelete }) => {
  // Placeholder for join date (could be member.joinedAt if available)
  const joinDate = "Desde 2024";

  return (
    <div
      className={`flex flex-row items-center rounded-xl px-6 py-4 transition border-2 border-b-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] bg-stuff-white border-stuff-light text-stuff-light w-full max-w-2xl`}
    >
      {/* Avatar */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-stuff-light">
        <span className="text-stuff-white text-lg font-bold">{getInitials(member.email)}</span>
      </div>
      {/* Info */}
      <div className="flex-1 ml-4 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-lg font-bold truncate text-stuff-light">{member.firstName} {member.lastName}</h4>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-stuff-light">
          <div className="flex items-center gap-1">
            <Mail size={18} />
            <span className="text-sm">{member.email}</span>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex flex-row items-center gap-2 ml-4">
        <Select
          value={member.role}
          onChange={e => onUpdateRole(member.id, (e.target as HTMLSelectElement).value)}
          disabled={loading}
          options={[
            { value: "membro", label: "Membro" },
            { value: "admin", label: "Admin" },
          ]}
          className="min-w-[110px]"
        />
        <Button
          size="sm"
          palette="danger"
          onClick={() => onDelete(member.id)}
          disabled={loading}
          title="Remover membro"
          className="ml-1 px-2 py-2"
        >
          <Trash size={18} />
        </Button>
      </div>
    </div>
  );
};

export default MemberCard;
