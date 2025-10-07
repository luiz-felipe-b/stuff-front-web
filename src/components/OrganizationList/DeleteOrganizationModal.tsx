import React from "react";
import Button from "../Button/Button";
import { X } from "lucide-react";

interface DeleteOrganizationModalProps {
  open: boolean;
  orgName: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteOrganizationModal: React.FC<DeleteOrganizationModalProps> = ({
  open,
  orgName,
  loading,
  onCancel,
  onConfirm,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stuff-black/40" onClick={onCancel}>
      <div className="bg-stuff-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-stuff-mid hover:text-stuff-dark transition-colors" onClick={onCancel} aria-label="Fechar">
          <X size={24} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
            <X size={28} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stuff-dark">Confirmar exclusão</h2>
            <p className="text-stuff-mid text-sm">Esta ação não pode ser desfeita.</p>
          </div>
        </div>
        <div className="mb-6 text-stuff-dark">
          Tem certeza que deseja deletar a organização <b>{orgName}</b>?
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
            type="button"
            palette="danger"
            onClick={onConfirm}
            disabled={loading}
            loading={loading}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteOrganizationModal;
