"use client";

import React, { useState, useMemo } from "react";
import Loader from "@/components/Loader/Loader";
import Button from "../Button/Button";
import AddAssetModal from "./AddAssetModal";
import AssetDetailsModal from "./AssetDetailsModal";
import { Trash2, Edit3, Package, Calendar, User, Eye, MoreVertical, Search, Filter, X, Hash, Weight, CalendarDays, Plus, Type, Ruler } from "lucide-react";
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

type FilterType = 'all' | 'active' | 'trash';

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
  const [filter, setFilter] = useState<FilterType>('all');
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

    if (filter === 'active') {
      filtered = filtered.filter(asset => !asset.trashBin);
    } else if (filter === 'trash') {
      filtered = filtered.filter(asset => asset.trashBin);
    }

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [assets, searchTerm, filter]);

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
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex items-center w-full md:w-64">
              <Search size={16} className="absolute left-3 text-stuff-mid" />
              <input
                type="text"
                placeholder="Buscar ativos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-10 py-2 rounded-lg border border-stuff-mid bg-white text-stuff-dark w-full focus:ring-2 focus:ring-stuff-primary outline-none"
              />
              {searchTerm && (
                <button onClick={clearSearch} className="absolute right-2 text-stuff-mid hover:text-stuff-dark">
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-stuff-mid" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="rounded-lg border border-stuff-mid bg-white text-stuff-dark px-2 py-2 focus:ring-2 focus:ring-stuff-primary outline-none"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="trash">Lixeira</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-stuff-mid shadow-sm">
            <Package size={48} className="text-stuff-light mb-2" />
            <h3 className="text-lg font-semibold mb-1">Nenhum ativo encontrado</h3>
            <p className="text-stuff-mid mb-4">
              {searchTerm || filter !== 'all'
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