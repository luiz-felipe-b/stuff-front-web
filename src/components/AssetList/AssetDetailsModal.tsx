"use client";
import React from "react";
import { X, Pencil, Trash2, Check } from "lucide-react";
import Button from "../Button/Button";
import AddSingleAttributeStep from "./AddSingleAttributeStep";
import { useUser } from "@/context/UserContext";
import { toast } from "react-hot-toast";
import EditAttributeValueStep from "./EditAttributeValueStep";
import Textarea from "../Input/Textarea";
import Input from "../Input/Input";
import Loader from "../Loader/Loader";

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
  const { user } = useUser();

  React.useEffect(() => {
    setAttributes(asset && asset.attributes ? asset.attributes : []);
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
    const attr = attributes[idx];
    if (!attr) return;
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
    } else if (attr.type === "multiselection" || attr.type === "singleselection") {
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
      } else if (attr.type === "singleselection") {
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
    console.log('Editing attribute draft:', draft);
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
      <div className="flex flex-col gap-6 p-6 w-full max-w-4xl bg-stuff-white rounded-2xl border-2 border-stuff-light relative" onClick={e => e.stopPropagation()}>
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
              <div className="text-stuff-light font-extrabold">Atributos</div>
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
                      const unitLabels: Record<string, string> = {
                        ton: "tonelada", kilogram: "quilograma", gram: "grama", kilometer: "quilômetro", meter: "metro", centimeter: "centímetro", square_meter: "metro quadrado", cubic_meter: "metro cúbico", mile: "milha", feet: "pé", degree: "grau", liter: "litro",
                      };
                      const unit = attr.unit ? (unitLabels[attr.unit] || attr.unit) : "";
                      displayValue = `${scale} ${unit}`.trim();
                    } else if (attr.type === "timemetric") {
                      let scale = "";
                      if (rawValue && typeof rawValue === "object" && rawValue !== null) {
                        scale = rawValue.scale ?? rawValue.value ?? "";
                      } else if (typeof rawValue === "string" || typeof rawValue === "number") {
                        scale = String(rawValue);
                      }
                      displayValue = `${scale} ${rawValue.unit || attr.unit || ""}`.trim();
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
                        <div className="w-1/2 flex gap-2 items-center truncate" title={attr.type}>{typeLabels[attr.type] || attr.type}</div>
                        <div className="w-1/2 truncate" title={displayValue}>{displayValue}</div>
                        <div className="w-1/6 flex gap-2 justify-center">
                          <Button variant="primary" palette="default" size="sm" className="p-1" title="Editar" onClick={() => handleEditAttribute(idx)}>
                            <Pencil size={24} />
                          </Button>
                          <Button palette="danger" size="sm" className="p-1" title="Excluir" onClick={() => {
                            setAttributes(prev => prev.filter((_, i) => i !== idx));
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
                  Cancelar
                </Button>
                <Button palette="success" size="md" onClick={async () => {
                  let success = true;
                  try {
                    const { attributesApi, assetsApi } = await import("@/services/api");
                    // Persist asset name/description
                    await assetsApi.patchAssetsId({
                      name: asset.name,
                      description: asset.description,
                    }, { params: { id: asset.id } });
                    // Persist changed attribute values
                    let anyPatched = false;
                    for (let i = 0; i < attributes.length; i++) {
                      const attr = attributes[i];
                      const origAttr = asset.attributes?.[i];
                      // Extract current and original value for comparison
                      let newValue = attr.value;
                      let oldValue = origAttr?.value;
                      if ((oldValue === undefined || oldValue === null || oldValue === "") && Array.isArray(origAttr?.values) && origAttr.values.length > 0) {
                        oldValue = origAttr.values[0].value;
                      }
                      // Normalize values for comparison
                      const normalize = (val: any, type: string) => {
                        if (type === "timemetric") {
                          if (val && typeof val === "object") return `${val.scale ?? ""}|${val.unit ?? ""}`;
                          return String(val ?? "");
                        }
                        if (type === "metric") {
                          if (val && typeof val === "object") return `${val.scale ?? ""}|${attr.unit ?? ""}`;
                          return String(val ?? "");
                        }
                        if (type === "multiselection") {
                          if (Array.isArray(val)) return val.filter(Boolean).join(",");
                          return String(val ?? "");
                        }
                        if (type === "boolean") {
                          return String(val === true || val === "true");
                        }
                        return String(val ?? "");
                      };
                      const normNew = normalize(newValue, attr.type);
                      const normOld = normalize(oldValue, attr.type);
                      // Only patch if normalized values are truly different and newValue is not empty/undefined/null
                      if (normNew !== normOld && normNew !== "" && normNew !== "undefined" && normNew !== "null") {
                        // Find the correct attribute value ID
                        const valueId = Array.isArray(attr.values) && attr.values.length > 0 ? attr.values[0].id : null;
                        if (valueId) {
                          // Build body according to type
                          let body: any = {};
                          if (attr.type === "timemetric") {
                            body.value = newValue?.scale ?? (typeof newValue === "object" ? "" : newValue);
                            body.timeUnit = newValue?.unit || attr.unit || "";
                          } else if (attr.type === "metric") {
                            body.value = typeof newValue === "object" ? newValue?.scale ?? "" : newValue;
                            body.metricUnit = attr.unit || "";
                          } else if (attr.type === "multiselection") {
                            body.value = Array.isArray(newValue) ? newValue.filter(Boolean).join(",") : String(newValue ?? "");
                          } else if (attr.type === "boolean") {
                            body.value = typeof newValue === "boolean" ? newValue : newValue === "true";
                          } else {
                            body.value = newValue ?? "";
                          }
                          await attributesApi.patchAttributesvalueAttributeValueId(body, { params: { attributeValueId: valueId } });
                          anyPatched = true;
                        } else {
                          toast.error(`Não foi possível atualizar o valor do atributo "${attr.name}" porque ele ainda não existe.`);
                        }
                      }
                    }
                    toast.success("Alterações salvas!");
                  } catch (err) {
                    success = false;
                    toast.error("Erro ao salvar alterações de atributos ou ativo");
                  }
                  if (onUpdateAsset) {
                    onUpdateAsset({ name: asset.name, description: asset.description });
                  }
                  onClose();
                }}>
                  Salvar alterações
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
        {editingAttributeIdx !== null && attributeDraft && (
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
        )}
      </div>
    </div>
  );
};

export default AssetDetailsModal;
