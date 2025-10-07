import React from "react";
import Loader from "@/components/Loader/Loader";
import Button from "../Button/Button";
import { X, Plus } from "lucide-react";

interface CreateOrganizationModalProps {
  open: boolean;
  loading: boolean;
  form: {
    name: string;
    slug: string;
    description: string;
    password?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  open,
  loading,
  form,
  onChange,
  onCancel,
  onSubmit,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stuff-black/40" onClick={onCancel}>
      <div className="bg-stuff-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn" onClick={e => e.stopPropagation()}>
  <button className="absolute top-4 right-4 text-stuff-mid hover:text-stuff-dark transition-colors" onClick={onCancel} aria-label="Fechar"></button>
          <X size={24} />
              <Button
                type="submit"
                palette="default"
                size="md"
                className="w-full"
                loading={loading}
                disabled={loading || !form.name.trim() || !form.slug.trim()}
              >
                {loading ? <Loader size={18} label="" /> : "Criar Organização"}
              </Button>
        <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onSubmit(); }}>
          <div>
            <label className="block text-stuff-mid font-medium mb-1">Nome *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Nome da organização"
              className="w-full border border-stuff-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stuff-primary text-stuff-dark"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-stuff-mid font-medium mb-1">Slug *</label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={onChange}
              placeholder="slug-org-exemplo"
              className="w-full border border-stuff-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stuff-primary text-stuff-dark"
              required
            />
          </div>
          <div>
            <label className="block text-stuff-mid font-medium mb-1">Descrição</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Descrição da organização (opcional)"
              rows={3}
              className="w-full border border-stuff-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stuff-primary text-stuff-dark resize-none"
            />
          </div>
          {/* <div>
            <label className="block text-stuff-mid font-medium mb-1">Senha de acesso</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Senha (opcional)"
              className="w-full border border-stuff-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stuff-primary text-stuff-dark"
            />
          </div> */}
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
              palette="default"
              variant="primary"
              disabled={loading || !form.name.trim() || !form.slug.trim()}
              loading={loading}
            >
              Criar Organização
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;
