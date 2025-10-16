"use client";

import React, { useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { Package, Calendar, Trash2, ChevronUp } from "lucide-react";
import Button from "../Button/Button";

interface Attribute {
  id: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string | null;
  authorId: string;
  trashBin: boolean;
  values: any[];
  unit?: string;
}

interface Asset {
  id: string;
  organizationId: string | null;
  templateId: string | null;
  creatorUserId: string;
  name: string;
  description: string;
  trashBin: boolean;
  createdAt: string;
  updatedAt: string;
  attributes?: Attribute[];
}

interface AssetCardProps {
  asset: Asset;
  onClick?: (asset: Asset) => void;
  showDescription?: boolean;
  showCreatedDate?: boolean;
  onToggleTrashBin?: (asset: Asset) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick, showDescription = true, showCreatedDate = true, onToggleTrashBin }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'trash' | 'restore' | null>(null);

  const handleTrashClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalType('trash');
    setModalOpen(true);
  };
  const handleRestoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalType('restore');
    setModalOpen(true);
  };
  const handleConfirm = () => {
    setModalOpen(false);
    setModalType(null);
    onToggleTrashBin?.(asset);
  };
  const handleCancel = () => {
    setModalOpen(false);
    setModalType(null);
  };

  return (
    <>
      <div
        className={`flex flex-col rounded-xl px-6 py-4 transition cursor-pointer border-2 border-b-4 shadow-[2px_4px_0_0_rgba(0,0,0,0.1)] 
          ${asset.trashBin
            ? 'bg-stuff-white border-danger-light text-danger-light hover:bg-danger-light/20'
            : 'bg-stuff-white border-stuff-light text-stuff-light hover:bg-stuff-high/40'}
        `}
        onClick={() => onClick?.(asset)}
      >
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${asset.trashBin ? 'bg-danger-light' : 'bg-stuff-light'}`}>
            <Package size={20} className='text-stuff-white' />
          </div>
          <div className="flex-1">
            <h4 className={`text-lg font-bold mb-1 ${asset.trashBin ? 'line-through text-red-700' : 'text-stuff-light'}`}>{asset.name}</h4>
            {showDescription && asset.description && (
              <p className={`text-sm mb-1 ${asset.trashBin ? 'line-through text-red-500' : 'text-stuff-mid'}`}>{asset.description}</p>
            )}
            {showCreatedDate && (
              <div className={`flex flex-wrap gap-4 text-xs ${asset.trashBin ? 'text-red-400' : 'text-stuff-mid'}`}>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>criado em {formatDate(asset.createdAt)}</span>
                </div>
                {asset.updatedAt !== asset.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>atualizado em {formatDate(asset.updatedAt)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          {asset.trashBin ? (
            <Button
              size="sm"
              palette="success"
              title="Restaurar"
              onClick={handleRestoreClick}
              className="py-3 px-3"
            >
              <ChevronUp size={24} />
            </Button>
          ) : (
            <Button
              size="sm"
              palette="danger"
              title="Mover para lixeira"
              onClick={handleTrashClick}
              className="py-3 px-3"
            >
              <Trash2 size={24} />
            </Button>
          )}
        </div>
      </div>
      <ConfirmModal
        open={modalOpen}
        message={modalType === 'trash' ? 'deseja mover este ativo para a lixeira? não esquenta! dá pra trazer de volta' : 'deseja restaurar este ativo da lixeira? sentiu saudade né?'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        cancelLabel="cancelar"
        confirmLabel={modalType === 'trash' ? 'mover para lixeira' : 'restaurar'}
        cancelPalette={modalType === 'trash' ? 'success' : 'danger'}
        confirmPalette={modalType === 'trash' ? 'danger' : 'success'}
      />
    </>
  );
};

export default AssetCard;
