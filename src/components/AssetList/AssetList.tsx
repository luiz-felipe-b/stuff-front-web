"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import Button from "../Button/Button";
import ToggleButton from "../Button/ToggleButton";
import AddAssetModal from "./AddAssetModal";
import AssetDetailsModal from "./AssetDetailsModal";
import AssetCard from "./AssetCard";
import { Trash2, Edit3, Package, Calendar, User, Eye, MoreVertical, Search, Filter, X, Hash, Weight, CalendarDays, Plus, Type, Ruler, Lightbulb, RefreshCw, CircleHelp } from "lucide-react";
import PaginationControls from "../PaginationControls/PaginationControls";
import Input from "@/components/Input/Input";
import { assetsApi, organizationsApi } from "@/services/api";

const ITEMS_PER_PAGE = 10;

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
  organization?: { id: string } | null;
  onEdit?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
  onView?: (asset: Asset) => void;
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
  assets: initialAssets,
  organization,
  onEdit,
  onDelete,
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
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [searchTerm, setSearchTerm] = useState("");
  // Toggle state for Ativos and Lixeira
  const [filterToggle, setFilterToggle] = useState<FilterToggle>({ active: true, trash: false });
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [attributeLoading, setAttributeLoading] = useState(false);
  const [assetLoading, setAssetLoading] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAsset, setNewAsset] = useState<NewAsset>({
    name: '',
    description: '',
    organizationId: organization?.id ?? null
  });
  // Pagination state
  const [page, setPage] = useState(1);

  // Router for modal route sync
  const router = useRouter();
  const pathname = usePathname();

  // Open modal and change route
  const handleAddAsset = () => {
    // Always set organizationId when opening modal
    setNewAsset(prev => ({
      ...prev,
      organizationId: organization?.id ?? null
    }));
    setShowAddAsset(true);
  };

  // Close modal and revert route
  const handleCancelAddAsset = () => {
    setShowAddAsset(false);
    resetNewAsset();
  };

  // Handler to reload all assets for the current organization from backend
  const handleReloadAssets = async () => {
    if (!organization?.id) {
      alert('Nenhuma organização selecionada.');
      return;
    }
    setReloading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // Fetch asset list for the org
      const assetsResp = await organizationsApi.getOrganizationsIdassets({ params: { id: organization.id }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const assetList = assetsResp.data || [];
      // Debug: log asset list response
      // eslint-disable-next-line no-console
      console.log('[Asset List] Response:', assetList);
      // Fetch each asset's full details (with attributes)
      const assetsWithAttributes = await Promise.all(
        assetList.map(async (a: any) => {
          try {
            const assetDetailResp = await assetsApi.getAssetsId({ params: { id: a.id }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
            const asset = assetDetailResp.data;
            // Debug: log asset detail response
            // eslint-disable-next-line no-console
            console.log('[Asset Detail] Response for id', a.id, ':', asset);
            return {
              ...asset,
              description: asset?.description ?? "",
              organizationId: asset?.organizationId ?? "",
            };
          } catch (err) {
            // If fetching details fails, fallback to basic asset info
            return {
              ...a,
              description: a?.description ?? "",
              organizationId: a?.organizationId ?? "",
            };
          }
        })
      );
      setAssets(assetsWithAttributes);
    } catch (error) {
      alert('Erro ao recarregar ativos.');
      console.error(error);
    } finally {
      setReloading(false);
    }
  };

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
      description: '',
      organizationId: organization?.id ?? null
    });
  };

  // handleAddAttribute and handleCancelAddAttribute removed

  // Duplicate handleAddAsset and handleCancelAddAsset removed; only the versions with route logic remain above.

  const handleSaveAsset = async () => {
    // Only reload assets after modal asset creation
    setAssetLoading(true);
    try {
      await handleReloadAssets();
      setShowAddAsset(false);
      resetNewAsset();
      if (typeof onAssetsChanged === 'function') {
        onAssetsChanged();
      }
    } catch (error) {
      console.error('Erro ao atualizar lista de ativos:', error);
      alert('Erro ao atualizar lista de ativos. Tente novamente.');
    } finally {
      setAssetLoading(false);
    }
  };

  const handleAssetChange = React.useCallback((field: keyof NewAsset, value: string) => {
    setNewAsset(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

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

  // Pagination: slice filteredAssets for current page
  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE) || 1;
  const paginatedAssets = filteredAssets.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset to page 1 if filteredAssets or totalPages change
  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filteredAssets, totalPages]);

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


  // Handler to toggle trashBin state
  const handleToggleTrashBin = async (asset: Asset) => {
    // Optimistically update UI
    setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, trashBin: !a.trashBin } : a));
    try {
      await assetsApi.patchAssetsIdtrashBin(
        { trashBin: !asset.trashBin },
        { params: { id: asset.id } }
      );
    } catch (error) {
      // Revert on error
      setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, trashBin: asset.trashBin } : a));
      alert('Erro ao mover ativo para/da lixeira.');
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-full mx-auto">
        {/* Add Asset Button - prominent above asset list */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl ml-3 font-extrabold text-stuff-light">ativos <span className="text-stuff-light font-bold">({assets.length})</span></h1>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button
              size="md"
              palette="success"
              className="py-3"
              title="adicionar novo ativo"
              onClick={handleAddAsset}
            ><Plus size={24} /></Button>
            <Button
              size="md"
              onClick={handleReloadAssets}
              // iconBefore={<RefreshCw size={16} className={reloading ? 'animate-spin' : ''} />}
              title='recarregar ativos'
              disabled={reloading}
              className="py-3"
            >
              <RefreshCw size={24} className={reloading ? 'animate-spin' : ''} />
            </Button>
            <div className="relative flex items-center w-full">
              <Input
                type="text"
                icon={<Search size={16} />}
                placeholder="busque ativos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={clearSearch} className="absolute right-3 text-stuff-mid cursor-pointer hover:bg-stuff-mid/20 rounded-4xl p-2">
                  <X size={16} className="shadow-[0_8px_32px_rgba(0,0,0,0.08)]" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ToggleButton
                pressed={!filterToggle.active}
                size="md"
                palette="primary"
                title={filterToggle.active ? "ocultar ativos fora da lixeira" : "mostrar ativos fora da lixeira"}
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
                title={filterToggle.trash ? "ocultar ativos na lixeira" : "mostrar ativos na lixeira"}
                onClick={() => setFilterToggle(ft => ({ ...ft, trash: !ft.trash }))}
                className="py-3"
                aria-label="Lixeira"
              >
                <Trash2 size={24} />
              </ToggleButton>
            </div>
          </div>
        </div>

        {reloading ? (
          <div className="flex flex-col items-center justify-center py-12 h-[48vh] border-2 border-t-8 border-stuff-high rounded-2xl w-full bg-white">
            <Loader label="Recarregando ativos..." />
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 h-[48vh] border-2 border-t-8 border-stuff-high rounded-2xl w-full bg-white">
            <CircleHelp size={48} className="text-stuff-light mb-2" />
            <h3 className="text-lg font-semibold mb-1">Nenhum ativo encontrado</h3>
            <p className="text-stuff-mid mb-4">
              {searchTerm || !(filterToggle.active && filterToggle.trash)
                ? "Nenhum cccccativo corresponde aos critérios de busca."
                : emptyMessage}
            </p>
            <Button size="sm" palette="success" onClick={handleAddAsset} iconBefore={<Plus size={16} />}>Criar Primeiro Ativo</Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col p-2 gap-4 border-2 border-t-8 border-stuff-high rounded-2xl w-full overflow-y-auto h-[48vh]">
              {paginatedAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  onClick={openAssetModal}
                  showDescription={showDescription}
                  showCreatedDate={showCreatedDate}
                  onToggleTrashBin={handleToggleTrashBin}
                />
              ))}
            </div>
            {/* Pagination Controls */}
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Add Asset Modal */}
      <AddAssetModal
        open={showAddAsset}
        loading={assetLoading}
        newAsset={newAsset}
        existingAssets={paginatedAssets}
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