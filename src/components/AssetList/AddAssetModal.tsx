"use client";
import React from "react";
import { Plus, X } from "lucide-react";
import AddAssetStep1 from "./AddAssetStep1";
import AddAssetStep2 from "./AddAssetStep2";
import AddSingleAttributeStep from "./AddSingleAttributeStep";
import AddAssetConfirmationStep from "./AddAssetConfirmationStep";
import { useUser } from "@/context/UserContext";
import { toast } from "react-hot-toast";

export interface AddAssetModalProps {
  open: boolean;
  loading: boolean;
  newAsset: { name: string; description: string; organizationId?: string | null };
  onChange: (field: "name" | "description", value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  existingAssets?: Array<{ id: string; name: string; description: string; attributes?: any[] }>;
  onCopyFromAsset?: (assetId: string) => void;
  organizationId?: string | null;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({
  open,
  loading,
  newAsset,
  onChange,
  onCancel,
  onSave,
  existingAssets = [],
  onCopyFromAsset,
  organizationId,
}) => {
  const [step, setStep] = React.useState(1);
  const [selectedCopyAssetId, setSelectedCopyAssetId] = React.useState<string>("");
  const [attributes, setAttributes] = React.useState<any[]>([]);
  const [attributeDraft, setAttributeDraft] = React.useState<any | null>(null);
  const [editingAttributeIdx, setEditingAttributeIdx] = React.useState<number | null>(null);
  const {user} = useUser();


  React.useEffect(() => {
    if (!open) {
      setStep(1);
      setAttributes([]);
      setSelectedCopyAssetId("");
    }
  }, [open]);

  const handleCopyAsset = (assetId: string) => {
    setSelectedCopyAssetId(assetId);
    if (!assetId) {
      onChange("name", "");
      onChange("description", "");
      setAttributes([]);
    } else {
      const asset = existingAssets.find(a => a.id === assetId);
      if (asset) {
        onChange("name", asset.name || "");
        onChange("description", asset.description || "");
        setAttributes(
          asset.attributes
            ? asset.attributes.map(attr => {
                let value = "";
                if (Array.isArray(attr.values) && attr.values.length > 0) {
                  value = attr.values[0].value;
                }
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
                return {
                  ...attr,
                  value,
                  options,
                  unit: attr.unit || undefined,
                  copied: true,
                };
              })
            : []
        );
      }
    }
  };

  const onConfirm = async () => {
    if (loading) return;
    const { assetsApi, attributesApi } = await import("@/services/api");
    try {
      // 1. Create asset
      const assetPayload: { type: "unique" | "replicable"; name: string; description?: string; organizationId?: string | null } = {
        type: "unique",
        name: newAsset.name,
      };
      if (newAsset.description) assetPayload.description = newAsset.description;
      // Always use organizationId from newAsset prop
      if (newAsset.organizationId) assetPayload.organizationId = newAsset.organizationId;
      toast("Payload: " + JSON.stringify(assetPayload));
      // eslint-disable-next-line no-console
      console.log("Creating asset with payload:", assetPayload);
      const assetRes = await assetsApi.postAssets(assetPayload);
      let assetId: string | null = null;
      if (Array.isArray(assetRes.data)) {
        assetId = assetRes.data[0]?.id ?? null;
      } else if (assetRes.data && typeof assetRes.data === 'object' && 'id' in assetRes.data) {
        assetId = assetRes.data.id;
      }
      console.log(assetRes)
      if (!assetId) throw new Error("Falha ao criar ativo");
      // 2. Create attributes if new, collect attribute IDs
      const attributeIds: string[] = [];
      for (const attr of attributes) {
        let attrId = attr.id;
        if (!user) throw new Error("Usuário não autenticado");
        if (!user.id) throw new Error("Usuário inválido");
        if (!attr.copied) {
          const attrRes = await attributesApi.postAttributes({
            name: attr.name,
            type: attr.type,
            description: attr.description || "",
            authorId: user.id || "00000000-0000-0000-0000-000000000000",
            unit: attr.unit || null,
            timeUnit: attr.timeUnit || null,
            options: Array.isArray(attr.options) ? JSON.stringify(attr.options) : null,
          });
          attrId = attrRes.data?.id;
          if (!attrId) throw new Error("Falha ao criar atributo");
        }
        attributeIds.push(attrId);
      }
      // 3. Create attribute values
      console.log(assetId, attributeIds, attributes);
      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        const attrId = attributeIds[i];
        let value = attr.value;
        if (attr.type === "timemetric" && value && typeof value === "object") {
          value = value.scale || value.value || "";
        }
        if (attr.type === "multiselection" && Array.isArray(value)) {
          value = value.join(", ");
        }
        await attributesApi.postAttributesAttributeIdvalue({
          assetId,
          value: typeof value === "string" ? value : String(value ?? ""),
        }, { params: { attributeId: attrId }});
      }
      onSave();
    } catch (err) {
      let msg = "Erro ao criar ativo ou atributos.";
      if (err instanceof Error && err.message) {
        msg += " " + err.message;
      } else if (typeof err === "string") {
        msg += " " + err;
      }
      toast.error(msg);
    }
  };

  const handleAddAttribute = () => {
    setAttributeDraft({ name: "", type: "text", value: "" });
    setEditingAttributeIdx(null);
    setStep(22); // 22 = attribute creation step
  };
  React.useEffect(() => {
    const handler = (e: any) => {
      if (e.detail && typeof e.detail.idx === 'number') {
        const attr = attributes[e.detail.idx];
        if (!attr) return;
        let draft = { ...attr };
        // Transform value for editing
        if (attr.type === "timemetric") {
          // Always use { scale, unit }
          let scale = "";
          let unit = attr.unit || attr.timeUnit || "";
          if (typeof attr.value === "string" || typeof attr.value === "number") {
            scale = attr.value;
          } else if (attr.value && typeof attr.value === "object") {
            scale = attr.value.scale ?? attr.value.value ?? "";
            unit = attr.value.unit || unit;
          }
          draft.value = { scale, unit };
        } else if (attr.type === "date") {
          // Ensure value is a valid date string
          if (typeof attr.value === "string") {
            const d = new Date(attr.value);
            draft.value = !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : attr.value;
          } else {
            draft.value = attr.value ? String(attr.value) : "";
          }
        }
        setAttributeDraft(draft);
        setEditingAttributeIdx(e.detail.idx);
        setStep(22);
      }
    };
    window.addEventListener('editCopiedAttribute', handler);
    return () => window.removeEventListener('editCopiedAttribute', handler);
  }, [attributes]);
  const handleAttributeChange = (idx: number, field: string, value: any) => {
    setAttributes(prev => prev.map((attr, i) => i === idx ? { ...attr, [field]: value } : attr));
  };
  const handleAttributeDraftChange = (field: string, value: any) => {
    setAttributeDraft((prev: any) => ({ ...prev, [field]: value }));
  };
  const handleAttributeDraftSave = () => {
    if (editingAttributeIdx !== null) {
      setAttributes(prev => prev.map((attr, i) => i === editingAttributeIdx ? attributeDraft : attr));
    } else {
      setAttributes(prev => [...prev, attributeDraft]);
    }
    setAttributeDraft(null);
    setEditingAttributeIdx(null);
    setStep(2);
  };
  const handleAttributeDraftCancel = () => {
    setAttributeDraft(null);
    setEditingAttributeIdx(null);
    setStep(2);
  };
  const handleRemoveAttribute = (idx: number) => {
    setAttributes(prev => prev.filter((_, i) => i !== idx));
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stuff-black/40">
      <div className="bg-stuff-white border-2 border-stuff-light rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] w-full max-w-3xl p-6 relative animate-fadeIn" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-stuff-light cursor-pointer hover:bg-stuff-mid/20 rounded-4xl p-2" onClick={onCancel}>
          <X size={24} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12">
            <Plus size={28} className="text-stuff-light" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-stuff-light">Novo Ativo</h2>
          </div>
        </div>
        {step === 1 && (
          <AddAssetStep1
            loading={loading}
            newAsset={newAsset}
            onChange={onChange}
            onCancel={onCancel}
            onNext={() => setStep(2)}
            existingAssets={existingAssets}
            selectedCopyAssetId={selectedCopyAssetId}
            onCopyAsset={handleCopyAsset}
          />
        )}
        {step === 2 && (
          <AddAssetStep2
            loading={loading}
            attributes={attributes}
            onAddAttribute={handleAddAttribute}
            onRemoveAttribute={handleRemoveAttribute}
            onCancel={onCancel}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 22 && attributeDraft && (
          <AddSingleAttributeStep
            attribute={attributeDraft}
            onChange={handleAttributeDraftChange}
            onSave={handleAttributeDraftSave}
            onCancel={handleAttributeDraftCancel}
            loading={loading}
          />
        )}
        {step === 3 && (
          <AddAssetConfirmationStep
            loading={loading}
            newAsset={newAsset}
            attributes={attributes}
            onCancel={onCancel}
            onBack={() => setStep(2)}
            onConfirm={onConfirm}
          />
        )}
      </div>
    </div>
  );
};

export default AddAssetModal;