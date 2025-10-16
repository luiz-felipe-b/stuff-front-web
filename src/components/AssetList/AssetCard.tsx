"use client";

import React from "react";
import { Package, Calendar, Trash2, ChevronLeft } from "lucide-react";
import ToggleButton from "../Button/ToggleButton";

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
  return (
    <div
      className={`flex flex-col rounded-xl px-6 py-4 transition cursor-pointer border-2 border-b-4 shadow-[2px_4px_0_0_rgba(0,0,0,0.1)] 
        ${asset.trashBin
          ? 'bg-stuff-white border-danger-base text-danger-base hover:bg-danger-light/20 opacity-80'
          : 'bg-stuff-white border-stuff-light text-stuff-light hover:bg-stuff-high/40'}
      `}
      onClick={() => onClick?.(asset)}
    >
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${asset.trashBin ? 'bg-red-200' : 'bg-stuff-light'}`}>
          <Package size={20} className={asset.trashBin ? 'text-red-600' : 'text-stuff-white'} />
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
                <span>Criado em {formatDate(asset.createdAt)}</span>
              </div>
              {asset.updatedAt !== asset.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Atualizado em {formatDate(asset.updatedAt)}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <ToggleButton
          pressed={!asset.trashBin}
          size="sm"
          palette={asset.trashBin ? 'primary' : 'danger'}
          title={asset.trashBin ? 'tirar da lixeira' : ''}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            if (typeof window !== 'undefined' && window.confirm(
              asset.trashBin ? 'Deseja restaurar este ativo da lixeira?' : 'Deseja mover este ativo para a lixeira?'
            )) {
              onToggleTrashBin?.(asset);
            }
          }}
        ><div className="flex items-center">
          {asset.trashBin && (<ChevronLeft/>)}
          <Trash2 size={24} />
        </div>
        </ToggleButton>
      </div>
    </div>
  );
};

export default AssetCard;
