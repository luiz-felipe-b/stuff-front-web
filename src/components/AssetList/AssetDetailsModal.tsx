"use client";
import React from "react";
import { X, Pencil, Trash2, Check, Plus } from "lucide-react";
import Button from "../Button/Button";
import AddSingleAttributeStep from "./AddSingleAttributeStep";
import { useUser } from "@/context/UserContext";
import { toast } from "react-hot-toast";
import EditAttributeValueStep from "./EditAttributeValueStep";
import Textarea from "../Input/Textarea";
import Input from "../Input/Input";
import Loader from "../Loader/Loader";
import { getAttributeIcon } from "@/util/getAttributeIcon";

export interface AssetDetailsModalProps {
  open: boolean;
  asset: {
    id: string;
    name: string;
    description?: string;
    attributes?: any[];
    organizationId?: string | null;
  };
  onClose: () => void;
  onUpdateAsset?: (updated: { name: string; description?: string }) => void;
  onUpdateAttribute?: (idx: number, updated: any) => void;
}

const AssetDetailsModal: React.FC<AssetDetailsModalProps & { loading?: boolean }> = ({
  open,
  asset,
  onClose,
  onUpdateAsset,
  onUpdateAttribute,
  loading = false,
}) => {
  const [editingAsset, setEditingAsset] = React.useState(false);
  const [editingAttributeIdx, setEditingAttributeIdx] = React.useState<number | null>(null);
  const [attributeDraft, setAttributeDraft] = React.useState<any | null>(null);
  const [attributes, setAttributes] = React.useState<any[]>(asset && asset.attributes ? asset.attributes : []);
  // Buffer for changed/created attributes
  const [dirtyAttributes, setDirtyAttributes] = React.useState<{ [key: string]: any }>({});
  const [addingAttribute, setAddingAttribute] = React.useState(false);
  const [addAttributeDraft, setAddAttributeDraft] = React.useState<any | null>(null);
  const [orgAttributes, setOrgAttributes] = React.useState<any[]>([]);
  const [orgAttributesLoading, setOrgAttributesLoading] = React.useState(false);
  // Track deleted attribute value IDs
  const [deletedAttributeValueIds, setDeletedAttributeValueIds] = React.useState<string[]>([]);
    // Handler for adding a new attribute
    const handleAddAttribute = async () => {
      console.log('[DEBUG] handleAddAttribute called');
      // Reset edit state
      setEditingAttributeIdx(null);
      setAttributeDraft(null);
      setAddAttributeDraft({ name: '', type: 'text', value: '' });
      setAddingAttribute(true);
      // Fetch org attributes if not already loaded
      if (asset.organizationId && orgAttributes.length === 0) {
        setOrgAttributesLoading(true);
        try {
          const { attributesApi } = await import("@/services/api");
          const token = localStorage.getItem("token");
          const resp = await attributesApi.getAttributes();
          setOrgAttributes((resp.data || []).filter((attr: any) => attr.organizationId === asset.organizationId));
        } catch (err) {
          setOrgAttributes([]);
        }
        setOrgAttributesLoading(false);
      }
    };

    const handleAddAttributeChange = (field: string, value: any) => {
      setAddAttributeDraft((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleAddAttributeSave = () => {
      if (!addAttributeDraft || !addAttributeDraft.name) {
        setAddAttributeDraft(null);
        setAddingAttribute(false);
        return;
      }
      // Only update local state, not API
      const newAttr = { ...addAttributeDraft, id: addAttributeDraft.id || `new-${Date.now()}` };
      setAttributes(prev => [...prev, newAttr]);
      setDirtyAttributes(prev => ({ ...prev, [newAttr.id]: newAttr }));
      if (onUpdateAttribute) onUpdateAttribute(attributes.length, newAttr);
      setAddAttributeDraft(null);
      setAddingAttribute(false);
    };

    const handleAddAttributeCancel = () => {
      setAddAttributeDraft(null);
      setAddingAttribute(false);
    };
  const { user } = useUser();

  React.useEffect(() => {
    if (asset && asset.attributes) {
      // Normalize attributes: ensure id, name, type, value, and values array
      const normalizedAttrs = asset.attributes.map((attr: any, idx: number) => {
        let value = attr.value;
        if ((value === undefined || value === null || value === "") && Array.isArray(attr.values) && attr.values.length > 0) {
          value = attr.values[0].value;
        }
        // Only assign id if present from backend; do not generate fake id for existing attributes
        return {
          id: attr.id ?? undefined,
          name: attr.name || '',
          type: attr.type || 'text',
          value,
          values: Array.isArray(attr.values) ? attr.values : [],
          description: attr.description || '',
          unit: attr.unit || '',
          timeUnit: attr.timeUnit || '',
          options: attr.options || [],
          ...attr,
        };
      });
      setAttributes(normalizedAttrs);
    } else {
      setAttributes([]);
    }
    setDeletedAttributeValueIds([]); // Reset deleted list when asset changes
    // Reset modal states and drafts when asset changes
    setAddingAttribute(false);
    setAddAttributeDraft(null);
    setEditingAttributeIdx(null);
    setAttributeDraft(null);
  }, [asset]);

  const handleEditAsset = () => {
    setEditingAsset(true);
  };
  const handleSaveAsset = () => {
    if (onUpdateAsset) {
      onUpdateAsset({ name: asset.name, description: asset.description });
    }
    setEditingAsset(false);
  };
  const handleEditAttribute = (idx: number) => {
    console.log('[DEBUG] handleEditAttribute called for idx', idx);
    const attr = attributes[idx];
    if (!attr) return;
    // Reset add state
    setAddingAttribute(false);
    setAddAttributeDraft(null);
    let draft = { ...attr };
    // Prefer attr.value, but fallback to attr.values[0]?.value if present
    let rawValue = attr.value;
    if ((rawValue === undefined || rawValue === null || rawValue === "") && Array.isArray(attr.values) && attr.values.length > 0) {
      rawValue = attr.values[0].value;
    }
    // Transform value for editing
    if (attr.type === "timemetric") {
      let scale = "";
      let unit = attr.unit || attr.timeUnit || "";
      if (typeof rawValue === "string" || typeof rawValue === "number") {
        scale = String(rawValue);
      } else if (rawValue && typeof rawValue === "object") {
        scale = rawValue.scale ?? rawValue.value ?? "";
        unit = rawValue.unit || unit;
      }
      draft.value = { scale, unit };
    } else if (
      attr.type === "multiselection" ||
      attr.type === "singleselection" ||
      attr.type === "select"
    ) {
      // Parse options
      let options: string[] = [];
      if (Array.isArray(attr.options)) {
        options = attr.options;
      } else if (typeof attr.options === "string") {
        try {
          const parsed = JSON.parse(attr.options);
          if (Array.isArray(parsed)) {
            options = parsed;
          }
        } catch {
          options = attr.options.split(/,\s*/);
        }
      }
      draft.options = options;
      // Parse selected values
      if (attr.type === "multiselection") {
        if (Array.isArray(rawValue)) {
          draft.value = rawValue;
        } else if (typeof rawValue === "string") {
          draft.value = rawValue.split(/,\s*/);
        } else {
          draft.value = [];
        }
      } else if (attr.type === "select") {
        if (typeof rawValue === "string") {
          draft.value = rawValue;
        } else if (Array.isArray(rawValue) && rawValue.length > 0) {
          draft.value = rawValue[0];
        } else {
          draft.value = "";
        }
      }
    } else if (attr.type === "date") {
      if (typeof rawValue === "string") {
        const d = new Date(rawValue);
        draft.value = !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : rawValue;
      } else {
        draft.value = rawValue ? String(rawValue) : "";
      }
    } else if (attr.type === "boolean") {
      if (typeof rawValue === "boolean") {
        draft.value = rawValue;
      } else if (typeof rawValue === "string") {
        draft.value = rawValue === "true";
      } else {
        draft.value = false;
      }
    } else {
      draft.value = rawValue;
    }
    setAttributeDraft(draft);
    setEditingAttributeIdx(idx);
  };
  const handleAttributeDraftChange = (field: string, value: any) => {
    setAttributeDraft((prev: any) => ({ ...prev, [field]: value }));
  };
  const handleAttributeDraftSave = () => {
    if (editingAttributeIdx !== null) {
      const attr = attributes[editingAttributeIdx];
      const updatedAttr = {
        ...attr,
        ...attributeDraft,
        options: attributeDraft.options ?? attr.options,
      };
      // Only update local state, not API
      const updatedAttrs = attributes.map((a, i) => i === editingAttributeIdx ? updatedAttr : a);
      setAttributes(updatedAttrs);
      setDirtyAttributes(prev => ({ ...prev, [updatedAttr.id]: updatedAttr }));
      if (onUpdateAttribute) onUpdateAttribute(editingAttributeIdx, updatedAttr);
    }
    setAttributeDraft(null);
    setEditingAttributeIdx(null);
  };
  const handleAttributeDraftCancel = () => {
    setAttributeDraft(null);
    setEditingAttributeIdx(null);
  };

  if (!open) return null;
  const showLoader = loading || !asset || !asset.id;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stuff-black/40" onClick={onClose}>
      <div className="flex flex-col gap-6 p-6 w-full max-w-4xl bg-stuff-white rounded-2xl border-2 border-stuff-light relative shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-stuff-light hover:bg-stuff-mid/20 rounded-full p-2 transition cursor-pointer" onClick={onClose}>
          <X size={22} />
        </button>
        {showLoader ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{ minHeight: 600, minWidth: 800 }}
          >
            <Loader />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <p className="font-extrabold text-stuff-light">Detalhes do ativo</p>
              <div className="flex flex-col border-2 border-b-4 border-stuff-light rounded-2xl p-4 bg-stuff-white">
                <div className="flex flex-col md:flex-row md:gap-8 gap-2">
                  <div>
                    <div className="font-semibold text-stuff-light">nome</div>
                    <div className="text-stuff-black text-base">{asset.name}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-stuff-light">descrição</div>
                    <div className="text-stuff-black text-base">{asset.description}</div>
                  </div>
                  <Button
                    variant="primary"
                    palette="default"
                    size="sm"
                    className="ml-auto"
                    onClick={handleEditAsset}
                  ><Pencil size={24} /></Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="text-stuff-light font-extrabold">Atributos</div>
                <Button
                  variant="primary"
                  palette="success"
                  size="sm"
                  className="py-3"
                  iconBefore={<Plus size={24} />}
                  onClick={handleAddAttribute}
                ></Button>
              </div>
                      {/* Add Attribute Modal */}
                      {/* Edit modal takes precedence over add modal */}
                      {editingAttributeIdx !== null && attributeDraft && (
                        (() => { console.log('[DEBUG] Rendering EDIT modal', { editingAttributeIdx, attributeDraft }); return (
                          <div className="fixed inset-0 z-60 flex items-center justify-center bg-stuff-black/40">
                            <div className="bg-stuff-white border-2 border-b-4 border-stuff-light rounded-2xl p-6 w-full max-w-md shadow-lg">
                              <EditAttributeValueStep
                                attribute={attributeDraft}
                                onChange={handleAttributeDraftChange}
                                onSave={handleAttributeDraftSave}
                                onCancel={handleAttributeDraftCancel}
                                loading={false}
                              />
                            </div>
                          </div>
                        ); })()
                      )}
                      {addingAttribute && editingAttributeIdx === null && (
                        (() => { console.log('[DEBUG] Rendering ADD modal', { addingAttribute, addAttributeDraft }); return (
                          <div className="fixed inset-0 z-60 flex items-center justify-center bg-stuff-black/40">
                            <div className="bg-stuff-white border-2 border-b-4 border-stuff-light rounded-2xl p-6 w-full max-w-md shadow-lg">
                              <AddSingleAttributeStep
                                attribute={addAttributeDraft}
                                onChange={handleAddAttributeChange}
                                onSave={handleAddAttributeSave}
                                onCancel={handleAddAttributeCancel}
                                loading={false}
                                orgAttributes={orgAttributes}
                                orgAttributesLoading={orgAttributesLoading}
                              />
                            </div>
                          </div>
                        ); })()
                      )}
              <div className="h-[48vh] overflow-y-auto custom-scrollbar border-2 border-t-8 border-stuff-light rounded-2xl w-full bg-stuff-white p-2">
                <div className="flex font-semibold text-stuff-light rounded px-2 py-2 mb-2">
                  <div className="w-1/3">nome</div>
                  <div className="w-1/3">tipo</div>
                  <div className="w-1/3">valor</div>
                  <div className="w-1/6 text-center">ações</div>
                </div>
                {attributes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <span className="text-stuff-mid">nenhum atributo.</span>
                  </div>
                ) : (
                  attributes.map((attr, idx) => {
                    let rawValue = attr.value;
                    if ((rawValue === undefined || rawValue === null || rawValue === "") && Array.isArray(attr.values) && attr.values.length > 0) {
                      rawValue = attr.values[0].value;
                    }
                    let displayValue = "";
                    if (attr.type === "metric") {
                      const scale = rawValue ?? "";
                      // Singular and plural unit labels
                      const unitLabels: Record<string, { singular: string; plural: string }> = {
                        ton: { singular: "tonelada", plural: "toneladas" },
                        kilogram: { singular: "quilograma", plural: "quilogramas" },
                        gram: { singular: "grama", plural: "gramas" },
                        kilometer: { singular: "quilômetro", plural: "quilômetros" },
                        meter: { singular: "metro", plural: "metros" },
                        centimeter: { singular: "centímetro", plural: "centímetros" },
                        square_meter: { singular: "metro quadrado", plural: "metros quadrados" },
                        cubic_meter: { singular: "metro cúbico", plural: "metros cúbicos" },
                        mile: { singular: "milha", plural: "milhas" },
                        feet: { singular: "pé", plural: "pés" },
                        degree: { singular: "grau", plural: "graus" },
                        liter: { singular: "litro", plural: "litros" },
                        second: { singular: "segundo", plural: "segundos" },
                        minute: { singular: "minuto", plural: "minutos" },
                        hour: { singular: "hora", plural: "horas" },
                        day: { singular: "dia", plural: "dias" },
                        week: { singular: "semana", plural: "semanas" },
                        month: { singular: "mês", plural: "meses" },
                        year: { singular: "ano", plural: "anos" },
                        // Accept plural keys as well for fallback
                        toneladas: { singular: "tonelada", plural: "toneladas" },
                        quilogramas: { singular: "quilograma", plural: "quilogramas" },
                        gramas: { singular: "grama", plural: "gramas" },
                        quilômetros: { singular: "quilômetro", plural: "quilômetros" },
                        metros: { singular: "metro", plural: "metros" },
                        centímetros: { singular: "centímetro", plural: "centímetros" },
                        "metros quadrados": { singular: "metro quadrado", plural: "metros quadrados" },
                        "metros cúbicos": { singular: "metro cúbico", plural: "metros cúbicos" },
                        milhas: { singular: "milha", plural: "milhas" },
                        pés: { singular: "pé", plural: "pés" },
                        graus: { singular: "grau", plural: "graus" },
                        litros: { singular: "litro", plural: "litros" },
                        segundos: { singular: "segundo", plural: "segundos" },
                        minutos: { singular: "minuto", plural: "minutos" },
                        horas: { singular: "hora", plural: "horas" },
                        dias: { singular: "dia", plural: "dias" },
                        semanas: { singular: "semana", plural: "semanas" },
                        meses: { singular: "mês", plural: "meses" },
                        anos: { singular: "ano", plural: "anos" },
                      };
                      // Prefer unit from value, fallback to attr, check all possible keys
                      let unit = "";
                      if (rawValue && typeof rawValue === "object") {
                        unit = rawValue.unit || rawValue.metricUnit || rawValue.timeUnit || "";
                      }
                      if (!unit) {
                        unit = attr.unit || attr.metricUnit || attr.timeUnit || "";
                      }
                      let label = unit;
                      const isSingular = String(scale) === "1";
                      if (unitLabels[unit]) {
                        label = isSingular ? unitLabels[unit].singular : unitLabels[unit].plural;
                      }
                      displayValue = `${scale} ${label}`.trim();
                    } else if (attr.type === "timemetric") {
                      let scale = "";
                      let unit = "";
                      if (rawValue && typeof rawValue === "object" && rawValue !== null) {
                        scale = rawValue.scale ?? rawValue.value ?? "";
                        unit = rawValue.unit || rawValue.timeUnit || rawValue.metricUnit || attr.unit || attr.timeUnit || attr.metricUnit || "";
                      } else if (typeof rawValue === "string" || typeof rawValue === "number") {
                        scale = String(rawValue);
                        unit = attr.unit || attr.timeUnit || attr.metricUnit || "";
                      }
                      // Singular/plural logic
                      const unitLabels: Record<string, { singular: string; plural: string }> = {
                        ton: { singular: "tonelada", plural: "toneladas" },
                        kilogram: { singular: "quilograma", plural: "quilogramas" },
                        gram: { singular: "grama", plural: "gramas" },
                        kilometer: { singular: "quilômetro", plural: "quilômetros" },
                        meter: { singular: "metro", plural: "metros" },
                        centimeter: { singular: "centímetro", plural: "centímetros" },
                        square_meter: { singular: "metro quadrado", plural: "metros quadrados" },
                        cubic_meter: { singular: "metro cúbico", plural: "metros cúbicos" },
                        mile: { singular: "milha", plural: "milhas" },
                        feet: { singular: "pé", plural: "pés" },
                        degree: { singular: "grau", plural: "graus" },
                        liter: { singular: "litro", plural: "litros" },
                        second: { singular: "segundo", plural: "segundos" },
                        minute: { singular: "minuto", plural: "minutos" },
                        hour: { singular: "hora", plural: "horas" },
                        day: { singular: "dia", plural: "dias" },
                        week: { singular: "semana", plural: "semanas" },
                        month: { singular: "mês", plural: "meses" },
                        year: { singular: "ano", plural: "anos" },
                        // Accept plural keys as well for fallback
                        toneladas: { singular: "tonelada", plural: "toneladas" },
                        quilogramas: { singular: "quilograma", plural: "quilogramas" },
                        gramas: { singular: "grama", plural: "gramas" },
                        quilômetros: { singular: "quilômetro", plural: "quilômetros" },
                        metros: { singular: "metro", plural: "metros" },
                        centímetros: { singular: "centímetro", plural: "centímetros" },
                        "metros quadrados": { singular: "metro quadrado", plural: "metros quadrados" },
                        "metros cúbicos": { singular: "metro cúbico", plural: "metros cúbicos" },
                        milhas: { singular: "milha", plural: "milhas" },
                        pés: { singular: "pé", plural: "pés" },
                        graus: { singular: "grau", plural: "graus" },
                        litros: { singular: "litro", plural: "litros" },
                        segundos: { singular: "segundo", plural: "segundos" },
                        minutos: { singular: "minuto", plural: "minutos" },
                        horas: { singular: "hora", plural: "horas" },
                        dias: { singular: "dia", plural: "dias" },
                        semanas: { singular: "semana", plural: "semanas" },
                        meses: { singular: "mês", plural: "meses" },
                        anos: { singular: "ano", plural: "anos" },
                      };
                      let label = unit;
                      const isSingular = String(scale) === "1";
                      if (unitLabels[unit]) {
                        label = isSingular ? unitLabels[unit].singular : unitLabels[unit].plural;
                      }
                      displayValue = `${scale} ${label}`.trim();
                    } else if (attr.type === "multiselection") {
                      if (Array.isArray(rawValue)) {
                        displayValue = rawValue.filter(Boolean).join(", ");
                      } else if (typeof rawValue === "string") {
                        displayValue = rawValue;
                      }
                    } else if (attr.type === "boolean") {
                      if (typeof rawValue === "boolean") {
                        displayValue = rawValue ? "Sim" : "Não";
                      } else if (typeof rawValue === "string") {
                        displayValue = rawValue === "true" ? "Sim" : rawValue === "false" ? "Não" : rawValue;
                      }
                    } else if (attr.type === "date") {
                      if (typeof rawValue === "string") {
                        displayValue = rawValue;
                      }
                    } else {
                      displayValue = rawValue !== undefined && rawValue !== null ? String(rawValue) : "";
                    }
                    if (!displayValue) displayValue = "-";
                    const typeLabels: Record<string, string> = {
                      text: "texto", number: "numérico", boolean: "booleano", date: "data", metric: "métrica", select: "seleção", multiselection: "seleção múltipla", timemetric: "tempo métrico", file: "arquivo", rfid: "rfid",
                    };
                    return (
                      <div key={attr.id || idx} className="flex items-center gap-2 mb-2 px-4 py-2 border-b-4 border-2 rounded-2xl border-stuff-light shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                        <div className="w-1/2 truncate" title={attr.name}>{attr.name}</div>
                        <div className="w-1/2 flex gap-2 items-center truncate" title={attr.type}>{getAttributeIcon(attr.type)}{typeLabels[attr.type] || attr.type}</div>
                        <div className="w-1/2 truncate" title={displayValue}>{displayValue}</div>
                        <div className="w-1/6 flex gap-2 justify-center">
                          <Button variant="primary" palette="default" size="sm" className="p-1" title="Editar" onClick={() => handleEditAttribute(idx)}>
                            <Pencil size={24} />
                          </Button>
                          <Button palette="danger" size="sm" className="p-1" title="Excluir" onClick={() => {
                            const attr = attributes[idx];
                            setAttributes(prev => prev.filter((_, i) => i !== idx));
                            // If attribute has a value for this asset, track its value ID for deletion
                            if (attr && Array.isArray(attr.values) && attr.values.length > 0 && attr.values[0].id) {
                              setDeletedAttributeValueIds(prev => [...prev, attr.values[0].id]);
                            }
                            if (onUpdateAttribute) onUpdateAttribute(idx, null);
                          }}>
                            <Trash2 size={24} />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}

              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button palette="danger" size="md" onClick={onClose}>
                  cancelar
                </Button>
                <Button palette="success" size="md" onClick={async () => {
                  let success = true;
                  try {
                    const { attributesApi, assetsApi } = await import("@/services/api");
                    const token = localStorage.getItem("token");
                    // Persist asset name/description
                    await assetsApi.patchAssetsId({
                      name: asset.name,
                      description: asset.description,
                    }, { params: { id: asset.id } });

                    // Persist only changed/created attributes
                    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                    for (const key in dirtyAttributes) {
                      if (!Object.prototype.hasOwnProperty.call(dirtyAttributes, key)) continue;
                      let attr = dirtyAttributes[key];
                      let attributeId = attr.id;
                      // Helper: get value for this asset
                      const valueObj = Array.isArray(attr.values)
                        ? attr.values.find((v: any) => v.assetInstanceId === asset.id)
                        : undefined;
                      if (attributeId && typeof attributeId === 'string' && uuidRegex.test(attributeId)) {
                        // Existing attribute
                        if (valueObj && valueObj.id) {
                          // Update existing value
                          // eslint-disable-next-line no-console
                          console.log('[AssetDetailsModal] Patching attribute value:', attr.name, attributeId, valueObj.id);
                          await attributesApi.patchAttributesvalueAttributeValueId({
                            value: typeof attr.value === "object" ? JSON.stringify(attr.value) : String(attr.value ?? ""),
                          }, {
                            params: { attributeValueId: valueObj.id },
                            headers: token ? { Authorization: `Bearer ${token}` } : {},
                          });
                        } else {
                          // Create new value for this asset
                          // eslint-disable-next-line no-console
                          console.log('[AssetDetailsModal] Creating new attribute value:', attr.name, attributeId);
                          await attributesApi.postAttributesAttributeIdvalue({
                            assetId: asset.id,
                            value: typeof attr.value === "object" ? JSON.stringify(attr.value) : String(attr.value ?? ""),
                          }, {
                            params: { attributeId },
                            headers: token ? { Authorization: `Bearer ${token}` } : {},
                          });
                        }
                      } else {
                        // New attribute: create, then create value
                        // eslint-disable-next-line no-console
                        console.log('[AssetDetailsModal] Creating new attribute:', attr.name, attr);
                        const attrRes = await attributesApi.postAttributes({
                          organizationId: asset.organizationId,
                          authorId: (user && user.id) || "",
                          name: attr.name,
                          description: attr.description || null,
                          type: attr.type,
                          unit: attr.unit || null,
                          timeUnit: attr.timeUnit || null,
                          options: Array.isArray(attr.options) ? JSON.stringify(attr.options) : null,
                          required: false,
                        }, {
                          headers: token ? { Authorization: `Bearer ${token}` } : {},
                        });
                        attributeId = attrRes.data.id;
                        setAttributes(prev => prev.map(a => a === attr ? { ...a, id: attributeId } : a));
                        // Now create value for this asset
                        if (attributeId && asset.id) {
                          await attributesApi.postAttributesAttributeIdvalue({
                            assetId: asset.id,
                            value: typeof attr.value === "object" ? JSON.stringify(attr.value) : String(attr.value ?? ""),
                          }, {
                            params: { attributeId },
                            headers: token ? { Authorization: `Bearer ${token}` } : {},
                          });
                        }
                      }
                    }
                    // Handle deleted attribute values: remove value association for this asset
                    for (const attributeValueId of deletedAttributeValueIds) {
                      if (attributeValueId) {
                        try {
                          await attributesApi.deleteAttributesvalueAttributeValueId(undefined, { params: { attributeValueId } });
                        } catch (err) {
                          // Ignore individual delete errors, show error toast below if any
                        }
                      }
                    }
                    toast.success("alterações salvas!");
                  } catch (err) {
                    success = false;
                    toast.error("erro ao salvar alterações de atributos ou ativo");
                  }
                  if (onUpdateAsset) {
                    onUpdateAsset({ name: asset.name, description: asset.description });
                  }
                  setDirtyAttributes({});
                  onClose();
                }}>
                  salvar alterações
                </Button>
              </div>
            </div>
          </>
        )}
        {editingAsset && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-stuff-black/40">
            <div className="bg-stuff-white border-2 border-b-4 border-stuff-light rounded-2xl p-6 w-full max-w-md shadow-lg">
              <h3 className="font-bold  text-stuff-light mb-2">Editar Ativo</h3>
              <label className="font-semibold text-stuff-light mb-1">nome</label>
              <Input className="border rounded p-2 w-full mb-2" defaultValue={asset.name} onChange={e => asset.name = e.target.value} />
              <label className="font-semibold text-stuff-light mb-1">descrição</label>
              <Textarea className="border rounded p-2 w-full mb-2" defaultValue={asset.description} onChange={e => asset.description = e.target.value} />
              <div className="flex gap-2 justify-end mt-2">
                <Button
                  variant="primary"
                  palette="danger"
                  size="md"
                  className="py-3"
                  onClick={() => setEditingAsset(false)}
                >
                  <X size={24} />
                </Button>
                <Button
                  variant="primary"
                  palette="success"
                  size="md"
                  className="py-3"
                  onClick={handleSaveAsset}
                >
                  <Check size={24} />
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* (Removed duplicate edit modal at the bottom; now only rendered above with precedence logic) */}
      </div>
    </div>
  );
};

export default AssetDetailsModal;
