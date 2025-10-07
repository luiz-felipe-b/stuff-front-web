"use client";
import MultiCheckbox from "../MultiCheckbox/MultiCheckbox";
import RadioGroup from "../RadioGroup/RadioGroup";
import React, { useState, useEffect } from "react";
import Loader from "@/components/Loader/Loader";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Switch from "../Switch/Switch";
import Select, { SelectProps } from "../Select/Select";
import {
  X,
  Package,
  Plus,
  Edit3,
  Trash2,
  Hash,
  Calendar,
  FileText,
  CheckSquare,
  ListChecks,
  Timer,
  File,
  Radio,
  ToggleLeft,
  Tag
} from "lucide-react";
import { attributesApi } from "@/services/api";

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
  options?: string[];
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
interface AssetDetailsModalProps {
  open: boolean;
  asset: Asset | null;
  loading: boolean;
  onClose: () => void;
  onEdit?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
  onAttributeSaved?: () => Promise<void>;
}

const getAttributeIcon = (type: string) => {
  // All icons: white color, circular stuff-mid background
  const iconProps = { size: 20, className: "text-stuff-white" };
  const bgClass = "flex items-center justify-center w-7 h-7 rounded-full bg-stuff-mid";
  switch (type) {
    case "text":
      return (
        <span className={bgClass}><FileText {...iconProps} /></span>
      );
    case "number":
      return (
        <span className={bgClass}><Hash {...iconProps} /></span>
      );
    case "boolean":
      return (
        <span className={bgClass}><ToggleLeft {...iconProps} /></span>
      );
    case "date":
      return (
        <span className={bgClass}><Calendar {...iconProps} /></span>
      );
    case "metric":
      return (
        <span className={bgClass}><Tag {...iconProps} /></span>
      );
    case "select":
      return (
        <span className={bgClass}><CheckSquare {...iconProps} /></span>
      );
    case "multiselection":
      return (
        <span className={bgClass}><ListChecks {...iconProps} /></span>
      );
    case "timemetric":
      return (
        <span className={bgClass}><Timer {...iconProps} /></span>
      );
    case "file":
      return (
        <span className={bgClass}><File {...iconProps} /></span>
      );
    case "rfid":
      return (
        <span className={bgClass}><Radio {...iconProps} /></span>
      );
    default:
      return (
        <span className={bgClass}><Package {...iconProps} /></span>
      );
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

const formatValue = (value: any, type: string, unit?: string) => {
  switch (type) {
    case "date":
      return new Date(value).toLocaleDateString("pt-BR");
    case "number":
      return value.toString();
    case "metric":
      return `${value}${unit ? ` ${unit}` : ""}`;
    default:
      return value.toString();
  }
};

const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({
  open,
  asset,
  loading,
  onClose,
  onEdit,
  onDelete,
  onAttributeSaved,
}) => {
  // State for available organization attributes
  const [orgAttributes, setOrgAttributes] = useState<Attribute[]>([]);
  // State for selected attributeId ('' means new attribute)
  const [selectedAttributeId, setSelectedAttributeId] = useState("");
  const [showAddAttribute, setShowAddAttribute] = useState(false);
  const [newAttribute, setNewAttribute] = useState<{
    name: string;
    description: string;
    type: string;
    unit?: string;
    value: string | File | string[] | TimeMetricValue;
    options?: string[];
  }>({
    name: '',
    description: '',
    type: 'text',
    unit: '',
    value: '',
    options: [],
  });
  // Removed separate unit state; use newAttribute.unit only
  // Option input state for select/multiselection attribute types
  const [optionInput, setOptionInput] = useState("");

  // Reset form and fetch org attributes when modal opens/closes
  useEffect(() => {
    if (!open) {
      setShowAddAttribute(false);
      setNewAttribute({
        name: '',
        description: '',
        type: 'text',
        unit: '',
        value: '',
        options: [],
      });
      setSelectedAttributeId("");
      setOrgAttributes([]);
    } else if (asset?.organizationId) {
      // Fetch all attributes and filter by organizationId
      attributesApi.getAttributes()
        .then((resp: any) => {
          const attrs: Attribute[] = resp?.data || [];
          setOrgAttributes(attrs.filter(attr => attr.organizationId === asset.organizationId));
        })
        .catch(() => setOrgAttributes([]));
    }
  }, [open, asset?.organizationId]);

  const handleAttributeChange = (field: string, value: string | File | string[] | TimeMetricValue) => {
    setNewAttribute(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAttribute = () => {
    setShowAddAttribute(true);
  };

  const handleCancelAddAttribute = () => {
    setShowAddAttribute(false);
    setNewAttribute({
      name: '',
      description: '',
      type: 'text',
      unit: '',
      value: '',
      options: [],
    });
    setOptionInput("");
  };

  const handleSaveAttribute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!asset) return;

    // Validate name
    if (typeof newAttribute.name !== 'string' || !newAttribute.name.trim()) {
      alert('Nome do atributo é obrigatório');
      return;
    }

    // Validate value based on type
    let valueIsEmpty = false;
    if (typeof newAttribute.value === 'string') {
      valueIsEmpty = !newAttribute.value.trim();
    } else if (Array.isArray(newAttribute.value)) {
      valueIsEmpty = newAttribute.value.length === 0;
    } else if (newAttribute.type === 'timemetric' && typeof newAttribute.value === 'object' && newAttribute.value !== null && !(newAttribute.value instanceof File)) {
      valueIsEmpty = !(typeof (newAttribute.value as any).scale === 'string' && (newAttribute.value as any).scale.trim() && typeof (newAttribute.value as any).unit === 'string' && (newAttribute.value as any).unit.trim());
    } else if (
      typeof File !== 'undefined' &&
      newAttribute.value instanceof File
    ) {
      valueIsEmpty = !(newAttribute.value && 'name' in newAttribute.value && (newAttribute.value as File).name);
    } else if (!newAttribute.value) {
      valueIsEmpty = true;
    }
    if (valueIsEmpty) {
      alert('Valor do atributo é obrigatório');
      return;
    }

    if (newAttribute.type === 'metric') {
      if (!newAttribute.unit || typeof newAttribute.unit !== 'string' || !newAttribute.unit.trim()) {
        alert('Unidade é obrigatória para atributos métricos');
        return;
      }
    }

    if (newAttribute.type === 'date' && typeof newAttribute.value === 'string' && isNaN(Date.parse(newAttribute.value))) {
      alert('Valor deve ser uma data válida para atributos do tipo data');
      return;
    }

    // API logic for attribute creation/reuse and value posting
    try {
      if (selectedAttributeId) {
        // Reusing existing attribute: only send value and attributeId
        await attributesApi.postAttributesAttributeIdvalue(
          {
            assetId: asset.id,
            value: String(newAttribute.value),
          },
          {
            params: { attributeId: selectedAttributeId },
          }
        );
      } else {
        // Creating new attribute: create attribute, then add value
        const allowedTypes = [
          "number",
          "boolean",
          "select",
          "text",
          "date",
          "file",
          "metric",
          "multiselection",
          "timemetric",
          "rfid",
        ] as const;
        const attrType = allowedTypes.includes(newAttribute.type as any)
          ? (newAttribute.type as typeof allowedTypes[number])
          : "text";
        const attrResp = await attributesApi.postAttributes(
          {
            name: newAttribute.name,
            description: newAttribute.description,
            authorId: asset.creatorUserId,
            type: attrType,
            organizationId: asset.organizationId || undefined,
          }
        );
        const attributeId = attrResp.data.id;
        await attributesApi.postAttributesAttributeIdvalue(
          {
            assetId: asset.id,
            value: String(newAttribute.value),
          },
          {
            params: { attributeId },
          }
        );
      }
      // Refetch orgAttributes after add
      if (asset.organizationId) {
        const resp = await attributesApi.getAttributes();
        const attrs: Attribute[] = resp?.data || [];
        const filtered = attrs.filter(attr => attr.organizationId === asset.organizationId);
        setOrgAttributes(filtered);
        // Reset dropdown and form to force re-render with new orgAttributes
        setSelectedAttributeId("");
        setNewAttribute({
          name: '',
          description: '',
          type: 'text',
          unit: '',
          value: '',
          options: [],
        });
        setOptionInput("");
      }
      if (onAttributeSaved) await onAttributeSaved();
    } catch (err) {
      alert('Erro ao adicionar atributo ao ativo.');
    }
    setShowAddAttribute(false);
  };

  if (!open || !asset) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 w-screen h-screen bg-stuff-black/40 z-0" onClick={onClose}></div>
      <div className="relative z-10 bg-stuff-white  rounded-2xl border-2 border-stuff-mid shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-0 animate-fadeIn custom-scrollbar" onClick={e => e.stopPropagation()}>
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-50 rounded-2xl">
            <Loader label="Carregando detalhes..." />
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-stuff-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-stuff-primary/10">
              <Package size={28} className="text-stuff-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stuff-dark leading-tight">{asset.name}</h2>
              {asset.description && <p className="text-stuff-mid text-sm mt-1">{asset.description}</p>}
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-stuff-gray-50 text-stuff-mid hover:text-stuff-dark transition-colors" onClick={onClose} aria-label="Fechar">
            <X size={24} />
          </button>
        </div>
        {/* Content */}
        <div className="px-6 py-4 flex flex-col gap-6">
          {/* Info Section */}
          <div className="bg-stuff-gray-50 rounded-xl p-4 flex flex-col gap-2 border border-stuff-gray-100">
            <div className="flex flex-wrap gap-4 text-sm">
              <div><span className="font-medium text-stuff-dark">ID:</span> <span className="text-stuff-mid break-all">{asset.id}</span></div>
              <div><span className="font-medium text-stuff-dark">Criado em:</span> <span className="text-stuff-mid">{formatDate(asset.createdAt)}</span></div>
              <div><span className="font-medium text-stuff-dark">Atualizado em:</span> <span className="text-stuff-mid">{formatDate(asset.updatedAt)}</span></div>
              <div><span className="font-medium text-stuff-dark">Status:</span> <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${asset.trashBin ? 'bg-stuff-light text-stuff-mid' : 'bg-stuff-success/10 text-stuff-success'}`}>{asset.trashBin ? 'Lixeira' : 'Ativo'}</span></div>
            </div>
          </div>
          {/* Attributes Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-stuff-dark">Atributos</h3>
              {!showAddAttribute && (
                <Button size="sm" palette="default" onClick={handleAddAttribute} iconBefore={<Plus size={16} />}>Adicionar</Button>
              )}
            </div>
            {/* Add Attribute Form */}
            {showAddAttribute && (
              <form className="bg-white border border-stuff-gray-100 rounded-xl p-4 mb-3 flex flex-col gap-3 shadow-sm" onSubmit={handleSaveAttribute}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Attribute selection dropdown */}
                  <div className="md:col-span-2">
                    <label className="block text-stuff-mid font-medium mb-1">Usar atributo existente</label>
                    <Select
                      value={selectedAttributeId}
                      onChange={e => {
                        const id = e.target.value;
                        setSelectedAttributeId(id);
                        if (id) {
                          const attr = orgAttributes.find(a => a.id === id);
                          if (attr) {
                            setNewAttribute({
                              name: attr.name,
                              description: attr.description,
                              type: attr.type,
                              unit: attr.unit || '',
                              value: '',
                              options: attr.options ?? [],
                            });
                          }
                        } else {
                          setNewAttribute({
                            name: '',
                            description: '',
                            type: 'text',
                            unit: '',
                            value: '',
                            options: [],
                          });
                        }
                      }}
                      options={[
                        { value: '', label: 'Novo atributo' },
                        ...orgAttributes.map(attr => ({ value: attr.id, label: attr.name }))
                      ]}
                      placeholder="Selecione um atributo existente ou crie novo"
                    />
                  </div>
                  <div>
                    <label className="block text-stuff-mid font-medium mb-1">Nome *</label>
                    <Input
                      type="text"
                      value={newAttribute.name}
                      onChange={e => handleAttributeChange("name", e.target.value)}
                      placeholder="Nome do atributo"
                      required
                      disabled={!!selectedAttributeId}
                    />
                  </div>
                  <div>
                    <label className="block text-stuff-mid font-medium mb-1">Tipo *</label>
                    <Select
                      value={newAttribute.type}
                      onChange={e => handleAttributeChange("type", e.target.value)}
                      required
                      options={[
                        { value: "text", label: "Texto" },
                        { value: "number", label: "Numérico" },
                        { value: "boolean", label: "Booleano" },
                        { value: "date", label: "Data" },
                        { value: "metric", label: "Métrica" },
                        { value: "select", label: "Seleção" },
                        { value: "multiselection", label: "Seleção múltipla" },
                        { value: "timemetric", label: "Tempo métrico" },
                        { value: "file", label: "Arquivo" },
                        { value: "rfid", label: "RFID" },
                      ]}
                      placeholder="Selecione o tipo"
                      disabled={!!selectedAttributeId}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-stuff-mid font-medium mb-1">Descrição</label>
                    <Input
                      type="text"
                      value={newAttribute.description}
                      onChange={e => handleAttributeChange("description", e.target.value)}
                      placeholder="Descrição do atributo"
                      disabled={!!selectedAttributeId}
                    />
                  </div>
                  {newAttribute.type === 'metric' && (
                    <div>
                      <label className="block text-stuff-mid font-medium mb-1">Unidade *</label>
                      <Select
                        value={newAttribute.unit}
                        onChange={e => handleAttributeChange('unit', e.target.value)}
                        options={[
                          { value: "ton", label: "Tonelada" },
                          { value: "kilogram", label: "Quilograma" },
                          { value: "gram", label: "Grama" },
                          { value: "kilometer", label: "Quilômetro" },
                          { value: "meter", label: "Metro" },
                          { value: "centimeter", label: "Centímetro" },
                          { value: "square_meter", label: "Metro quadrado" },
                          { value: "cubic_meter", label: "Metro cúbico" },
                          { value: "mile", label: "Milha" },
                          { value: "feet", label: "Pé" },
                          { value: "degree", label: "Grau" },
                          { value: "liter", label: "Litro" },
                        ]}
                        placeholder="Selecione a unidade"
                        required
                        disabled={!!selectedAttributeId}
                      />
                      {newAttribute.unit && (
                        <div className="text-xs text-stuff-mid mt-1">
                          Unidade selecionada: {
                            [
                              { value: "ton", label: "Tonelada" },
                              { value: "kilogram", label: "Quilograma" },
                              { value: "gram", label: "Grama" },
                              { value: "kilometer", label: "Quilômetro" },
                              { value: "meter", label: "Metro" },
                              { value: "centimeter", label: "Centímetro" },
                              { value: "square_meter", label: "Metro quadrado" },
                              { value: "cubic_meter", label: "Metro cúbico" },
                              { value: "mile", label: "Milha" },
                              { value: "feet", label: "Pé" },
                              { value: "degree", label: "Grau" },
                              { value: "liter", label: "Litro" },
                            ].find(opt => opt.value === newAttribute.unit)?.label || newAttribute.unit
                          }
                        </div>
                      )}
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-stuff-mid font-medium mb-1">Valor *</label>
                    {/* Render input based on attribute type */}
                    {(() => {
                      switch (newAttribute.type) {
                        case 'boolean':
                          return (
                            <div className="flex items-center gap-3">
                              <Switch
                                checked={newAttribute.value === 'true'}
                                onChange={val => handleAttributeChange('value', val ? 'true' : 'false')}
                                label={newAttribute.value === 'true' ? 'Sim' : 'Não'}
                              />
                            </div>
                          );
                        case 'date':
                          return (
                            <Input
                              type="date"
                              value={newAttribute.value as string}
                              onChange={e => handleAttributeChange('value', e.target.value)}
                              required
                            />
                          );
                        case 'number':
                        case 'metric':
                          return (
                            <Input
                              type="number"
                              value={newAttribute.value as string}
                              onChange={e => handleAttributeChange('value', e.target.value)}
                              placeholder="Valor do atributo"
                              required
                            />
                          );
                        case 'timemetric': {
                          let timeValue: { scale: string; unit: string } = { scale: '', unit: '' };
                          if (
                            typeof newAttribute.value === 'object' &&
                            newAttribute.value !== null &&
                            !Array.isArray(newAttribute.value) &&
                            'scale' in newAttribute.value &&
                            'unit' in newAttribute.value
                          ) {
                            timeValue = newAttribute.value as { scale: string; unit: string };
                          }
                          const timeUnits = [
                            { value: 'second', label: 'Segundo' },
                            { value: 'minute', label: 'Minuto' },
                            { value: 'hour', label: 'Hora' },
                            { value: 'day', label: 'Dia' },
                            { value: 'week', label: 'Semana' },
                            { value: 'fortnight', label: 'Quinzena' },
                            { value: 'month', label: 'Mês' },
                            { value: 'year', label: 'Ano' },
                          ];
                          const handleTimeMetricChange = (field: 'scale' | 'unit', val: string) => {
                            handleAttributeChange('value', { ...timeValue, [field]: val });
                          };
                          return (
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                value={timeValue.scale}
                                onChange={e => handleTimeMetricChange('scale', e.target.value)}
                                placeholder="Escala"
                                required
                              />
                              <Select
                                value={timeValue.unit}
                                onChange={e => handleTimeMetricChange('unit', e.target.value)}
                                options={timeUnits}
                                placeholder="Unidade"
                                required
                              />
                            </div>
                          );
                        }
                        case 'file':
                          return (
                            <Input
                              type="file"
                              onChange={e => {
                                const file = (e.target as HTMLInputElement).files?.[0] || '';
                                handleAttributeChange('value', file);
                              }}
                              required
                            />
                          );
                        case 'select':
                        case 'multiselection': {
                          // Parse options: support both array and comma-separated string
                          let options: string[] = [];
                          if (Array.isArray(newAttribute.options)) {
                            options = newAttribute.options;
                          } else if (typeof newAttribute.options === 'string') {
                            const optStr: string = (newAttribute.options as string).trim();
                            if (optStr.startsWith('[') && optStr.endsWith(']')) {
                              try {
                                const parsed = JSON.parse(optStr);
                                if (Array.isArray(parsed)) {
                                  options = parsed.map((item: any) => String(item));
                                } else {
                                  options = [];
                                }
                              } catch {
                                options = [];
                              }
                            } else {
                              options = optStr
                                .split(',')
                                .map((opt: string) => opt.trim())
                                .filter((opt: string) => opt.length > 0);
                            }
                          }
                          let value = newAttribute.value;
                          if (newAttribute.type === 'multiselection' && !Array.isArray(value)) value = [];
                          if (newAttribute.type === 'select' && Array.isArray(value)) value = '';
                          const handleAddOption = () => {
                            const val = optionInput.trim();
                            if (val && !options.includes(val)) {
                              handleAttributeChange('options', [...options, val]);
                              setOptionInput("");
                            }
                          };
                          return (
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-wrap gap-2 mb-2">
                                {options.map((opt, idx) => (
                                  <div key={opt + '-' + idx} className="flex items-center gap-1 bg-stuff-gray-100 rounded px-2 py-1">
                                    <span>{opt}</span>
                                    <button type="button" className="text-stuff-danger ml-1" onClick={() => {
                                      const newOpts = options.filter((_, i) => i !== idx);
                                      handleAttributeChange('options', newOpts);
                                      if (newAttribute.type === 'multiselection' && Array.isArray(value)) {
                                        handleAttributeChange('value', value.filter((v: string) => v !== opt));
                                      } else if (newAttribute.type === 'select' && value === opt) {
                                        handleAttributeChange('value', '');
                                      }
                                    }}>×</button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2 mb-2">
                                <Input
                                  type="text"
                                  placeholder="Adicionar opção"
                                  value={optionInput}
                                  onChange={e => setOptionInput(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddOption();
                                    }
                                  }}
                                />
                                <Button type="button" size="sm" palette="default" onClick={handleAddOption} disabled={!optionInput.trim() || options.includes(optionInput.trim())}>
                                  Adicionar
                                </Button>
                              </div>
                              {newAttribute.type === 'select' ? (
                                <RadioGroup
                                  options={options}
                                  value={value as string}
                                  onChange={val => handleAttributeChange('value', val)}
                                />
                              ) : (
                                <MultiCheckbox
                                  options={options}
                                  value={Array.isArray(value) ? value : []}
                                  onChange={vals => handleAttributeChange('value', vals)}
                                />
                              )}
                            </div>
                          );
                        }
                        case 'rfid':
                        case 'text':
                        default:
                          return (
                            <Input
                              type="text"
                              value={newAttribute.value as string}
                              onChange={e => handleAttributeChange('value', e.target.value)}
                              placeholder="Valor do atributo"
                              required
                            />
                          );
                      }
                    })()}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button type="button" palette="default" onClick={handleCancelAddAttribute} disabled={loading}>Cancelar</Button>
                  <Button type="submit" palette="default" loading={loading}>Salvar</Button>
                </div>
              </form>
            )}
            {/* Attribute List */}
            {asset.attributes && asset.attributes.length > 0 ? (
              <div className="flex flex-col gap-2">
                {asset.attributes.map(attribute => {
                  const attributeValue = attribute.values.find(
                    val => val.assetInstanceId === asset.id && val.attributeId === attribute.id
                  );
                  return (
                    <div key={attribute.id} className="flex items-center gap-4 bg-stuff-gray-50 border border-stuff-gray-100 rounded-lg px-4 py-3 shadow-sm">
                      {getAttributeIcon(attribute.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-stuff-mid text-base truncate">{attribute.name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded bg-stuff-high text-stuff-dark ml-1">{attribute.type}</span>
                        </div>
                        {attribute.description && <p className="text-stuff-mid text-xs truncate mt-0.5">{attribute.description}</p>}
                      </div>
                      {attributeValue && (
                        <div className="text-base text-stuff-primary whitespace-nowrap">{formatValue(attributeValue.value, attribute.type, attribute.unit)}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              !showAddAttribute && (
                <div className="flex flex-col items-center justify-center py-6">
                  <Package size={48} className="text-stuff-light mb-2" />
                  <p className="text-stuff-mid">Este ativo não possui atributos definidos.</p>
                </div>
              )
            )}
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-2 px-6 pb-6 pt-2 border-t border-stuff-gray-100">
          {onEdit && (
            <Button palette="default" onClick={() => onEdit(asset)} iconBefore={<Edit3 size={16} />}>Editar</Button>
          )}
          {onDelete && (
            <Button palette="danger" onClick={() => onDelete(asset)} iconBefore={<Trash2 size={16} />}>Excluir</Button>
          )}
          <Button palette="default" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsModal;
