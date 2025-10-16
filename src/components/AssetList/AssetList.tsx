"use client";

import React, { useState, useMemo } from "react";
import Loader from "@/components/Loader/Loader";
import Button from "../Button/Button";
import ToggleButton from "../Button/ToggleButton";
import AddAssetModal from "./AddAssetModal";
import AssetDetailsModal from "./AssetDetailsModal";
import { Trash2, Edit3, Package, Calendar, User, Eye, MoreVertical, Search, Filter, X, Hash, Weight, CalendarDays, Plus, Type, Ruler, Lightbulb } from "lucide-react";
import Input from "@/components/Input/Input";
// import Select from "@/components/Select/Select";
// import "./asset-list.css";
import { assetsApi } from "@/services/api";

interface AttributeValue {
  id: string;
  assetInstanceId: string;
  attributeId: string;
  createdAt: string;
  updatedAt: string;
  value: any;
}

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
  values: AttributeValue[];
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

type TimeMetricValue = { scale: string; unit: string };
interface NewAttribute {
  name: string;
  description: string;
  type: 'number' | 'text' | 'date' | 'metric' | 'file' | 'timemetric' | 'boolean' | 'select' | 'multiselection' | 'rfid';
  dimension?: string;
  unit?: string;
  value: string | File | string[] | TimeMetricValue;
  options?: string[];
}

interface NewAsset {
  name: string;
  description: string;
  organizationId?: string | null;
  templateId?: string | null;
}

interface AssetListProps {
  assets: Asset[];
  onEdit?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
  onView?: (asset: Asset) => void;
  onAddAsset?: (asset: NewAsset) => Promise<void>;
  onAddAttribute?: () => Promise<void>;
  onAssetsChanged?: () => void;
  loading?: boolean;
  emptyMessage?: string;
  showActions?: boolean;
  showCreatedDate?: boolean;
  showDescription?: boolean;
}


type FilterToggle = {
  active: boolean;
  trash: boolean;
};

export default function AssetList({
  assets,
  onEdit,
  onDelete,
  onAddAsset,
  onAddAttribute,
  onAssetsChanged,
  loading = false,
  emptyMessage = "Nenhum ativo encontrado",
  showCreatedDate = true,
  showDescription = true,
}: AssetListProps) {
  // Called after attribute is added in modal: refetch all assets and the selected asset
  const handleAttributeSaved = async () => {
    if (onAddAttribute) await onAddAttribute(); // parent will refetch all assets
    if (selectedAsset) await refetchAsset(selectedAsset.id); // update modal asset
  };
  const [searchTerm, setSearchTerm] = useState("");
  // Toggle state for Ativos and Lixeira
  const [filterToggle, setFilterToggle] = useState<FilterToggle>({ active: true, trash: true });
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [attributeLoading, setAttributeLoading] = useState(false);
  const [assetLoading, setAssetLoading] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAsset, setNewAsset] = useState<NewAsset>({
    name: '',
    description: ''
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  const openAssetModal = async (asset: Asset) => {
    setSelectedAsset(asset);
    setAttributeLoading(true);
    try {
      await refetchAsset(asset.id);
    } finally {
      setAttributeLoading(false);
    }
  };

  const closeAssetModal = () => {
    setSelectedAsset(null);
  };

  // resetNewAttribute removed

  const resetNewAsset = () => {
    setNewAsset({
      name: '',
      description: ''
    });
  };

  // handleAddAttribute and handleCancelAddAttribute removed

  const handleAddAsset = () => {
    setShowAddAsset(true);
  };

  const handleCancelAddAsset = () => {
    setShowAddAsset(false);
    resetNewAsset();
  };

  const handleSaveAsset = async () => {
    if (!onAddAsset) return;

    if (!newAsset.name.trim()) {
      alert('Nome do ativo é obrigatório');
      return;
    }

    setAssetLoading(true);
    try {
      await onAddAsset(newAsset);
      setShowAddAsset(false);
      resetNewAsset();
      if (typeof onAssetsChanged === 'function') {
        onAssetsChanged();
      }
    } catch (error) {
      console.error('Erro ao criar ativo:', error);
      alert('Erro ao criar ativo. Tente novamente.');
    } finally {
      setAssetLoading(false);
    }
  };

  const handleAssetChange = (field: keyof NewAsset, value: string) => {
    setNewAsset(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const refetchAsset = async (assetId: string) => {
    if (!assetId) return;
    try {
      const assetResp = await assetsApi.getAssetsId({ params: { id: assetId } });
      const asset = assetResp.data;
      if (!asset || !asset.id) {
        throw new Error('Invalid asset data received from API');
      }
      const updatedAsset: Asset = {
        ...asset,
        description: typeof asset.description === 'string' ? asset.description : "",
        templateId: ('templateId' in asset && typeof asset.templateId === 'string') ? asset.templateId : null,
        organizationId: typeof asset.organizationId === 'string' ? asset.organizationId : null,
        attributes: Array.isArray(asset.attributes)
          ? asset.attributes.map(attr => ({
              ...attr,
              description: typeof attr.description === 'string' ? attr.description : "",
              organizationId: typeof attr.organizationId === 'string' ? attr.organizationId : null,
              unit: typeof attr.unit === 'string' ? attr.unit : undefined,
              values: Array.isArray(attr.values)
                ? attr.values.map(val => {
                    const v = val as any;
                    return {
                      id: v.id || '',
                      assetInstanceId: v.assetInstanceId || v.asset_id || '',
                      attributeId: v.attributeId || v.attribute_id || '',
                      value: v.value,
                      createdAt: v.createdAt || v.created_at || '',
                      updatedAt: v.updatedAt || v.updated_at || '',
                    };
                  })
                : []
            }))
          : []
      };
      setSelectedAsset(updatedAsset);
    } catch (error) {
      console.error('Erro ao recarregar ativo:', error);
      alert('Erro ao recarregar ativo. Tente novamente.');
    }
  };

  // handleSaveAttribute removed; now handled in modal

  // handleAttributeChange removed

  const filteredAssets = useMemo(() => {
    let filtered = assets;
    // If both toggles are on, show all ("Todos")
    if (!(filterToggle.active && filterToggle.trash)) {
      if (filterToggle.active && !filterToggle.trash) {
        filtered = filtered.filter(asset => !asset.trashBin);
      } else if (!filterToggle.active && filterToggle.trash) {
        filtered = filtered.filter(asset => asset.trashBin);
      } else if (!filterToggle.active && !filterToggle.trash) {
        // If both are off, show all (or could show none)
        filtered = [];
      }
    }
    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [assets, searchTerm, filterToggle]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader label="Carregando ativos..." />
      </div>
    );
  }


  return (
    <>
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-stuff-dark">Ativos <span className="text-stuff-mid">({assets.length})</span></h3>
            {onAddAsset && (
              <Button size="sm" palette="success" onClick={handleAddAsset} iconBefore={<Plus size={16} />}>
                Novo Ativo
              </Button>
            )}
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex items-center w-full">
              <Input
                type="text"
                icon={<Search size={16} />}
                placeholder="busque ativos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={clearSearch} className="absolute right-3 text-stuff-mid hover:text-stuff-dark cursor-pointer hover:bg-stuff-mid/20 rounded-4xl p-2">
                  <X size={16} className="shadow-[0_8px_32px_rgba(0,0,0,0.08)]" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ToggleButton
                pressed={!filterToggle.active}
                size="md"
                palette="primary"
                className="py-3"
                onClick={() => setFilterToggle(ft => ({ ...ft, active: !ft.active }))}
                aria-label="Ativos"
              >
                <Lightbulb size={24} />
              </ToggleButton>
              <ToggleButton
                pressed={!filterToggle.trash}
                size="md"
                palette="danger"
                onClick={() => setFilterToggle(ft => ({ ...ft, trash: !ft.trash }))}
                className="py-3"
                aria-label="Lixeira"
              >
                <Trash2 size={24} />
              </ToggleButton>
            </div>
          </div>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-stuff-mid shadow-sm">
            <Package size={48} className="text-stuff-light mb-2" />
            <h3 className="text-lg font-semibold mb-1">Nenhum ativo encontrado</h3>
            <p className="text-stuff-mid mb-4">
              {searchTerm || !(filterToggle.active && filterToggle.trash)
                ? "Nenhum ativo corresponde aos critérios de busca."
                : emptyMessage}
            </p>
            {onAddAsset && (
              <Button size="sm" palette="success" onClick={handleAddAsset} iconBefore={<Plus size={16} />}>Criar Primeiro Ativo</Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className={`flex flex-col bg-white border-2 border-b-4 border-black rounded-xl px-6 py-4 shadow-none hover:bg-stuff-light/80 transition cursor-pointer ${asset.trashBin ? 'opacity-60' : ''}`} onClick={() => openAssetModal(asset)}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stuff-light border border-stuff-mid">
                    <Package size={20} className="text-stuff-mid" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-stuff-dark mb-1">{asset.name}</h4>
                    {showDescription && asset.description && (
                      <p className="text-stuff-mid text-sm mb-1">{asset.description}</p>
                    )}
                    {showCreatedDate && (
                      <div className="flex flex-wrap gap-4 text-xs text-stuff-mid">
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
                  {asset.trashBin && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-stuff-light text-stuff-mid text-xs font-semibold border border-stuff-mid">
                      <Trash2 size={12} /> Lixeira
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      <AddAssetModal
        open={showAddAsset}
        loading={assetLoading}
        newAsset={newAsset}
        onChange={handleAssetChange}
        onCancel={handleCancelAddAsset}
        onSave={handleSaveAsset}
  />

      {/* Asset Detail Modal */}
      <AssetDetailsModal
        open={!!selectedAsset}
        asset={selectedAsset}
        loading={attributeLoading}
        onClose={closeAssetModal}
        onEdit={onEdit}
        onDelete={onDelete}
        onAttributeSaved={handleAttributeSaved}
      />
    </>
  );
}