import React from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Textarea from "../Input/Textarea";
import Select from "../Select/Select";

export interface AddAssetStep1Props {
  loading: boolean;
  newAsset: { name: string; description: string };
  onChange: (field: "name" | "description", value: string) => void;
  onCancel: () => void;
  onNext: () => void;
  existingAssets: Array<{ id: string; name: string; description: string; attributes?: any[] }>;
  selectedCopyAssetId: string;
  onCopyAsset: (assetId: string) => void;
}

const AddAssetStep1: React.FC<AddAssetStep1Props> = ({
  loading,
  newAsset,
  onChange,
  onCancel,
  onNext,
  existingAssets,
  selectedCopyAssetId,
  onCopyAsset,
}) => {
  return (
    <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onNext(); }}>
      <div>
        <label className="block text-stuff-mid font-medium mb-1">reutilizar ativo existente</label>
        <Select
          options={[{ value: '', label: 'selecione um ativo para copiar' }, ...existingAssets.map(asset => ({ value: asset.id, label: asset.name }))]}
          value={selectedCopyAssetId}
          onChange={e => onCopyAsset(e.target.value)}
          palette="default"
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-stuff-mid font-medium mb-1">nome do ativo</label>
        <Input
          type="text"
          value={newAsset.name}
          onChange={e => onChange("name", e.target.value)}
          placeholder="nome do ativo"
          autoFocus
          required
        />
      </div>
      <div>
        <label className="block text-stuff-mid font-medium mb-1">descrição</label>
        <Textarea
          value={newAsset.description}
          onChange={e => onChange("description", e.target.value)}
          placeholder="descrição do ativo (opcional)"
          rows={3}
          className="w-full"
        />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <Button
          type="button"
          palette="danger"
          onClick={onCancel}
          disabled={loading}
        >cancelar</Button>
        <Button
          type="submit"
          palette="success"
          disabled={loading || !newAsset.name.trim()}
          loading={loading}
        >próximo</Button>
      </div>
    </form>
  );
};

export default AddAssetStep1;
