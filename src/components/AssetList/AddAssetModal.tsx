"use client";
import React from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { Plus, X } from "lucide-react";

interface AddAssetModalProps {
  open: boolean;
  loading: boolean;
  newAsset: { name: string; description: string };
  onChange: (field: "name" | "description", value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({
  open,
  loading,
  newAsset,
  onChange,
  onCancel,
  onSave,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stuff-black/40" onClick={onCancel}>
      <div className="bg-stuff-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-stuff-mid hover:text-stuff-dark transition-colors cursor-pointer" onClick={onCancel}>
          <X size={24} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-stuff-success/10">
            <Plus size={28} className="text-stuff-success" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stuff-dark">Novo Ativo</h2>
            <p className="text-stuff-mid text-sm">Criar um novo ativo para a organização</p>
          </div>
        </div>
        <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onSave(); }}>
          <div>
            <label className="block text-stuff-mid font-medium mb-1">Nome do Ativo *</label>
            <Input
              type="text"
              value={newAsset.name}
              onChange={e => onChange("name", e.target.value)}
              placeholder="Nome do ativo"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-stuff-mid font-medium mb-1">Descrição</label>
            <textarea
              value={newAsset.description}
              onChange={e => onChange("description", e.target.value)}
              placeholder="Descrição do ativo (opcional)"
              rows={3}
              className="w-full border border-stuff-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stuff-primary text-stuff-dark resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              palette="default"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              palette="success"
              disabled={loading || !newAsset.name.trim()}
              loading={loading}
            >
              Criar Ativo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
