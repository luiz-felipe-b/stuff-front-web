"use client";
import React from "react";
import Loader from "@/components/Loader/Loader";
import { Users, Plus, RefreshCw, Search, X } from "lucide-react";
import Button from "../Button/Button";

import Input from "../Input/Input";
import MemberCard from "./MemberCard";


export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}


interface MemberListProps {
  members: Member[];
  loading?: boolean;
  onUpdateRole: (userId: string, newRole: string) => void;
  onDelete: (userId: string) => void;
  onAddMember: (email: string) => void;
  onReload: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  reloading: boolean;
}



const MemberList: React.FC<MemberListProps> = ({
  members,
  loading = false,
  onUpdateRole,
  onDelete,
  onAddMember,
  onReload,
  searchTerm = "",
  onSearchTermChange,
  reloading = false,
}) => {
  const [addEmail, setAddEmail] = React.useState("");
  const clearSearch = () => onSearchTermChange && onSearchTermChange("");

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
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 w-full md:w-auto">
        <Button
          size="md"
          palette="success"
          className="py-3"
          title="adicionar novo membro"
          onClick={() => onAddMember && onAddMember(addEmail)}
          disabled={!addEmail}
        >
          <Plus size={24} />
        </Button>
        <Button
          size="md"
          onClick={onReload}
          title='recarregar membros'
          disabled={reloading}
          className="py-3"
        >
          <RefreshCw size={24} className={reloading ? 'animate-spin' : ''} />
        </Button>
        <div className="relative flex items-center w-full">
          <Input
            type="text"
            icon={<Search size={16} />}
            placeholder="busque membros"
            value={searchTerm}
            onChange={(e) => onSearchTermChange && onSearchTermChange(e.target.value)}
          />
          {searchTerm && (
            <button onClick={clearSearch} className="absolute right-3 text-stuff-mid cursor-pointer hover:bg-stuff-mid/20 rounded-4xl p-2">
              <X size={16} className="shadow-[0_8px_32px_rgba(0,0,0,0.08)]" />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col py-2 px-2 h-[48vh] border-2 border-t-8 border-stuff-light rounded-2xl w-full bg-stuff-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            loading={loading}
            onUpdateRole={onUpdateRole}
            onDelete={onDelete}
          />
        ))}
        </div>

      </div>
    </div>
  );

};

export default MemberList;
