"use client";

import React, { useState, useMemo } from "react";
import { Trash2, Edit3, Package, Calendar, User, Eye, MoreVertical, Search, Filter, X, Hash, Weight, CalendarDays, Plus, Type, Ruler } from "lucide-react";
// import "./asset-list.css";
import { AssetService } from "@/services/assets_service";

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

interface NewAttribute {
  name: string;
  description: string;
  type: 'number' | 'text' | 'date' | 'metric';
  dimension?: string;
  unit?: string;
  value: string;
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
  onAddAttribute: (
    assetId: string,
    attribute: { name: string; description: string; type: string; organizationId: string; },
    value: { value: string | number | Date; metricUnit?: string; attributeType?: string; }
  ) => Promise<void>;
  onAddAsset?: (asset: NewAsset) => Promise<void>;
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
  onAddAttribute,
  onAddAsset,
  loading = false,
  emptyMessage = "Nenhum ativo encontrado",
  showCreatedDate = true,
  showDescription = true,
}: AssetListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showAddAttribute, setShowAddAttribute] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAttribute, setNewAttribute] = useState<NewAttribute>({
    name: '',
    description: '',
    type: 'text',
    unit: '',
    value: ''
  });
  const [newAsset, setNewAsset] = useState<NewAsset>({
    name: '',
    description: ''
  });
  const [attributeLoading, setAttributeLoading] = useState(false);
  const [assetLoading, setAssetLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatValue = (value: any, type: string, dimension?: string, unit?: string) => {
    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString("pt-BR");
      case 'numeric':
      case 'number':
        return value.toString();
      case 'metric':
        return `${value}${unit ? ` ${unit}` : ''}${dimension ? ` (${dimension})` : ''}`;
      default:
        return value.toString();
    }
  };

  const getAttributeIcon = (type: string) => {
    switch (type) {
      case 'number':
        return <Hash size={16} />;
      case 'metric':
        return <Weight size={16} />;
      case 'date':
        return <CalendarDays size={16} />;
      case 'text':
        return <Type size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const openAssetModal = async (asset: Asset) => {
    setSelectedAsset(asset);
    await refetchAsset(asset.id);
  };

  const closeAssetModal = () => {
    setSelectedAsset(null);
    setShowAddAttribute(false);
    resetNewAttribute();
  };

  const resetNewAttribute = () => {
    setNewAttribute({
      name: '',
      description: '',
      type: 'text',
      unit: '',
      value: ''
    });
  };

  const resetNewAsset = () => {
    setNewAsset({
      name: '',
      description: ''
    });
  };

  const handleAddAttribute = () => {
    setShowAddAttribute(true);
  };

  const handleCancelAddAttribute = () => {
    setShowAddAttribute(false);
    resetNewAttribute();
  };

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

    console.log('Refetching asset:', assetId);
    
    try {
      const result = await AssetService.getAssetById(assetId);
      const asset = result.data;
      console.log('Refetched asset data:', asset);
      console.log('Asset attributes:', asset?.attributes);

      if (!asset || !asset.id) {
        throw new Error('Invalid asset data received from API');
      }

      const updatedAsset = {
        ...asset,
        attributes: asset.attributes || []
      };

      setSelectedAsset(updatedAsset);
      console.log('Updated selected asset:', updatedAsset);
    } catch (error) {
      console.error('Erro ao recarregar ativo:', error);
      alert('Erro ao recarregar ativo. Tente novamente.');
    }
  };

  const handleSaveAttribute = async () => {
    if (!selectedAsset || !onAddAttribute) return;

    if (!newAttribute.name.trim() || !newAttribute.value.trim()) {
      alert('Nome e valor do atributo são obrigatórios');
      return;
    }

    if (newAttribute.type === 'metric' && (!newAttribute.dimension?.trim() || !newAttribute.unit?.trim())) {
      alert('Dimensão e unidade são obrigatórias para atributos métricos');
      return;
    }

    if (newAttribute.type === 'date' && isNaN(Date.parse(newAttribute.value))) {
      alert('Valor deve ser uma data válida para atributos do tipo data');
      return;
    }

    setAttributeLoading(true);
    try {
      await onAddAttribute(selectedAsset.id, {
        name: newAttribute.name,
        description: newAttribute.description,
        type: newAttribute.type,
        organizationId: selectedAsset.organizationId || '',
      }, {
        value: newAttribute.type === 'number' ? parseInt(newAttribute.value) : newAttribute.value,
        metricUnit: newAttribute.unit,
        attributeType: newAttribute.type
      });
      setShowAddAttribute(false);
      resetNewAttribute();

      setTimeout(async () => {
        await refetchAsset(selectedAsset.id);
      }, 500);

    } catch (error) {
      console.error('Erro ao adicionar atributo:', error);
      alert('Erro ao adicionar atributo. Tente novamente.');
    } finally {
      setAttributeLoading(false);
    }
  };

  const handleAttributeChange = (field: keyof NewAttribute, value: string) => {
    setNewAttribute(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
      <div className="asset-list-loading">
        <div className="loading-spinner"></div>
        <p>Carregando ativos...</p>
      </div>
    );
  }

  return (
    <>
      <div className="asset-list">
        <div className="asset-list-header">
          <div className="asset-list-title">
            <h3>Ativos ({assets.length})</h3>
            {onAddAsset && (
              <button className="add-asset-btn" onClick={handleAddAsset}>
                <Plus size={16} />
                Novo Ativo
              </button>
            )}
          </div>

          <div className="asset-controls">
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar ativos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button onClick={clearSearch} className="clear-search">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="filter-container">
              <Filter size={16} className="filter-icon" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="filter-select"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="trash">Lixeira</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="asset-list-empty">
            <Package size={48} className="empty-icon" />
            <h3>Nenhum ativo encontrado</h3>
            <p>
              {searchTerm || filter !== 'all'
                ? "Nenhum ativo corresponde aos critérios de busca."
                : emptyMessage
              }
            </p>
            {onAddAsset && (
              <button className="add-asset-btn-empty" onClick={handleAddAsset}>
                <Plus size={16} />
                Criar Primeiro Ativo
              </button>
            )}
          </div>
        ) : (
          <div className="asset-vertical-list">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className={`asset-item ${asset.trashBin ? 'trash-item' : ''}`}>
                <div className="asset-item-content" onClick={() => openAssetModal(asset)}>
                  <div className="asset-icon">
                    <Package size={20} />
                  </div>

                  <div className="asset-details">
                    <h4 className="asset-name">{asset.name}</h4>
                    {showDescription && asset.description && (
                      <p className="asset-description">{asset.description}</p>
                    )}
                    {showCreatedDate && (
                      <div className="asset-meta">
                        <div className="meta-item">
                          <Calendar size={12} />
                          <span>Criado em {formatDate(asset.createdAt)}</span>
                        </div>
                        {asset.updatedAt !== asset.createdAt && (
                          <div className="meta-item">
                            <Calendar size={12} />
                            <span>Atualizado em {formatDate(asset.updatedAt)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {asset.trashBin && (
                    <div className="asset-status-badge">
                      <Trash2 size={12} />
                      <span>Lixeira</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {showAddAsset && (
        <div className="asset-modal-overlay" onClick={handleCancelAddAsset}>
          <div className="asset-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="asset-modal-header">
              <div className="asset-modal-title">
                <div className="asset-modal-icon">
                  <Plus size={24} />
                </div>
                <div>
                  <h2>Novo Ativo</h2>
                  <p className="asset-modal-subtitle">Criar um novo ativo para a organização</p>
                </div>
              </div>
              <button className="asset-modal-close" onClick={handleCancelAddAsset}>
                <X size={20} />
              </button>
            </div>

            <div className="asset-modal-body">
              <div className="add-asset-form">
                <div className="form-group">
                  <label>Nome do Ativo *</label>
                  <input
                    type="text"
                    value={newAsset.name}
                    onChange={(e) => handleAssetChange('name', e.target.value)}
                    placeholder="Nome do ativo"
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label>Descrição</label>
                  <textarea
                    value={newAsset.description}
                    onChange={(e) => handleAssetChange('description', e.target.value)}
                    placeholder="Descrição do ativo (opcional)"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="asset-modal-footer">
              <button 
                className="modal-btn cancel-btn" 
                onClick={handleCancelAddAsset}
                disabled={assetLoading}
              >
                Cancelar
              </button>
              <button 
                className="modal-btn save-btn" 
                onClick={handleSaveAsset}
                disabled={assetLoading || !newAsset.name.trim()}
              >
                {assetLoading ? 'Criando...' : 'Criar Ativo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="asset-modal-overlay" onClick={closeAssetModal}>
          <div className="asset-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="asset-modal-header">
              <div className="asset-modal-title">
                <div className="asset-modal-icon">
                  <Package size={24} />
                </div>
                <div>
                  <h2>{selectedAsset.name}</h2>
                  <p className="asset-modal-subtitle">{selectedAsset.description}</p>
                </div>
              </div>
              <button className="asset-modal-close" onClick={closeAssetModal}>
                <X size={20} />
              </button>
            </div>

            <div className="asset-modal-body">
              {/* Basic Information */}
              <div className="asset-info-section">
                <h3>Informações Básicas</h3>
                <div className="asset-info-grid">
                  <div className="info-item">
                    <label>ID</label>
                    <span>{selectedAsset.id}</span>
                  </div>
                  <div className="info-item">
                    <label>Criado em</label>
                    <span>{formatDate(selectedAsset.createdAt)}</span>
                  </div>
                  <div className="info-item">
                    <label>Atualizado em</label>
                    <span>{formatDate(selectedAsset.updatedAt)}</span>
                  </div>
                  <div className="info-item">
                    <label>Status</label>
                    <span className={`status-badge ${selectedAsset.trashBin ? 'trash' : 'active'}`}>
                      {selectedAsset.trashBin ? 'Lixeira' : 'Ativo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attributes Section */}
              <div className="asset-attributes-section">
                <div className="attributes-header">
                  <h3>Atributos</h3>
                  {!showAddAttribute && (
                    <button className="add-attribute-btn" onClick={handleAddAttribute}>
                      <Plus size={16} />
                      Adicionar Atributo
                    </button>
                  )}
                </div>

                {/* Add Attribute Form */}
                {showAddAttribute && (
                  <div className="add-attribute-form">
                    <h4>Novo Atributo</h4>
                    <div className="attribute-form-grid">
                      <div className="form-group">
                        <label>Nome *</label>
                        <input
                          type="text"
                          value={newAttribute.name}
                          onChange={(e) => handleAttributeChange('name', e.target.value)}
                          placeholder="Nome do atributo"
                        />
                      </div>

                      <div className="form-group">
                        <label>Tipo *</label>
                        <select
                          value={newAttribute.type}
                          onChange={(e) => handleAttributeChange('type', e.target.value)}
                        >
                          <option value="text">Texto</option>
                          <option value="number">Numérico</option>
                          <option value="date">Data</option>
                          <option value="metric">Métrica</option>
                        </select>
                      </div>

                      <div className="form-group full-width">
                        <label>Descrição</label>
                        <input
                          type="text"
                          value={newAttribute.description}
                          onChange={(e) => handleAttributeChange('description', e.target.value)}
                          placeholder="Descrição do atributo"
                        />
                      </div>

                      {newAttribute.type === 'metric' && (
                        <div className="form-group">
                          <label>Unidade *</label>
                          <input
                            type="text"
                            value={newAttribute.unit}
                            onChange={(e) => handleAttributeChange('unit', e.target.value)}
                            placeholder="Ex: cm, kg, L"
                          />
                        </div>
                      )}

                      <div className="form-group full-width">
                        <label>Valor *</label>
                        <input
                          type={newAttribute.type === 'number' || newAttribute.type === 'metric' ? 'number' :
                            newAttribute.type === 'date' ? 'date' : 'text'}
                          value={newAttribute.value}
                          onChange={(e) => handleAttributeChange('value', e.target.value)}
                          placeholder="Valor do atributo"
                        />
                      </div>
                    </div>

                    <div className="attribute-form-actions">
                      <button
                        className="cancel-btn"
                        onClick={handleCancelAddAttribute}
                        disabled={attributeLoading}
                      >
                        Cancelar
                      </button>
                      <button
                        className="save-btn"
                        onClick={handleSaveAttribute}
                        disabled={attributeLoading}
                      >
                        {attributeLoading ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing Attributes */}
                {selectedAsset.attributes && selectedAsset.attributes.length > 0 && (
                  <div className="attributes-list">
                    {selectedAsset.attributes.map((attribute) => {
                      const attributeValue = attribute.values.find(
                        val => val.assetInstanceId === selectedAsset.id && val.attributeId === attribute.id
                      );

                      return (
                        <div key={attribute.id} className="attribute-item">
                          <div className="attribute-header">
                            <div className="attribute-icon">
                              {getAttributeIcon(attribute.type)}
                            </div>
                            <div className="attribute-info">
                              <h4>{attribute.name}</h4>
                              <p>{attribute.description}</p>
                            </div>
                            <span className="attribute-type">{attribute.type}</span>
                          </div>
                          {attributeValue && (
                            <div className="attribute-value">
                              <strong>Valor:</strong> {formatValue(attributeValue.value, attribute.type, attribute.unit)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {(!selectedAsset.attributes || selectedAsset.attributes.length === 0) && !showAddAttribute && (
                  <div className="no-attributes">
                    <Package size={48} className="no-attributes-icon" />
                    <p>Este ativo não possui atributos definidos.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="asset-modal-footer">
              {onEdit && (
                <button className="modal-btn edit-btn" onClick={() => onEdit(selectedAsset)}>
                  <Edit3 size={16} />
                  Editar
                </button>
              )}
              {onDelete && (
                <button className="modal-btn delete-btn" onClick={() => onDelete(selectedAsset)}>
                  <Trash2 size={16} />
                  Excluir
                </button>
              )}
              <button className="modal-btn close-btn" onClick={closeAssetModal}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}