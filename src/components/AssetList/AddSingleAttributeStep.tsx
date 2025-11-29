import React from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Select from "../Select/Select";
import Switch from "../Switch/Switch";
import { Plus } from "lucide-react";
import OptionTokenList from "../OptionTokenList/OptionTokenList";
import ValueTokenSelector from "../ValueTokenSelector/ValueTokenSelector";
import ToggleButton from "../Button/ToggleButton";

export interface Attribute {
  name: string;
  type: string;
  value: any;
  options?: string[];
  unit?: string;
  copied?: boolean;
  newOption?: string;
}

export interface AddSingleAttributeStepProps {
  attribute: Attribute;
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
  loading?: boolean;
  orgAttributes?: Attribute[];
  orgAttributesLoading?: boolean;
}

const typeOptions = [
  { value: "text", label: "texto" },
  { value: "number", label: "numérico" },
  { value: "boolean", label: "booleano" },
  { value: "date", label: "data" },
  { value: "metric", label: "métrica" },
  { value: "select", label: "seleção" },
  { value: "multiselection", label: "seleção múltipla" },
  { value: "timemetric", label: "tempo métrico" },
  { value: "file", label: "arquivo" },
  { value: "rfid", label: "rfid" },
];

const AddSingleAttributeStep: React.FC<AddSingleAttributeStepProps> = ({
  attribute,
  onChange,
  onSave,
  onCancel,
  loading,
  orgAttributes = [],
  orgAttributesLoading = false,
}) => {
  const [selectedAttrId, setSelectedAttrId] = React.useState<string>("__new__");

  React.useEffect(() => {
    if (selectedAttrId && selectedAttrId !== "__new__") {
      const found = orgAttributes.find(a => a.id === selectedAttrId);
      if (found) {
        // Copy all fields except value
        onChange("name", found.name);
        onChange("type", found.type);
        if (found.options) onChange("options", found.options);
        if (found.unit) onChange("unit", found.unit);
        if (found.timeUnit) onChange("timeUnit", found.timeUnit);
        // Optionally lock name/type fields
      }
    }
    if (selectedAttrId === "__new__") {
      onChange("name", "");
      onChange("type", "text");
      onChange("options", []);
      onChange("unit", undefined);
      onChange("timeUnit", undefined);
    }
    // eslint-disable-next-line
  }, [selectedAttrId]);

  return (
    <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onSave(); }}>
      <h3 className="text-lg font-bold text-stuff-light mb-2">Adicionar atributo</h3>
      <div>
        <label className="text-stuff-light mb-1 block">Usar atributo existente</label>
        <Select
          options={[
            { value: "__new__", label: "Novo atributo" },
            ...orgAttributes.map(a => ({ value: a.id, label: `${a.name} (${a.type})` })),
          ]}
          value={selectedAttrId}
          onChange={e => setSelectedAttrId(e.target.value)}
          disabled={orgAttributesLoading}
        />
      </div>
      <div>
        <label className="text-stuff-light">nome do atributo</label>
        <Input
          type="text"
          value={attribute.name}
          onChange={e => onChange("name", e.target.value)}
          placeholder="nome do atributo"
          className="w-full"
          required
          disabled={selectedAttrId !== "__new__"}
        />
      </div>
      <div>
        <label className="text-stuff-light mb-1 block">tipo do atributo</label>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`px-3 py-1 rounded-lg border-2 border-b-4 transition-colors font-medium text-sm focus:outline-none cursor-pointer ${attribute.type === opt.value ? 'bg-stuff-light border-stuff-mid text-stuff-white' : 'bg-stuff-white border-stuff-light text-stuff-light hover:bg-stuff-light/10'}`}
              onClick={() => onChange("type", opt.value)}
              disabled={selectedAttrId !== "__new__"}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {/* Render input based on type */}
      {attribute.type === "text" && (
        <div>
          <label className="text-stuff-light">valor do atributo</label>
          <Input
            type="text"
            value={attribute.value}
            onChange={e => onChange("value", e.target.value)}
            placeholder="valor"
            className="w-full"
          />
        </div>
      )}
      {attribute.type === "number" && (
        <div>
          <label className="text-stuff-light">valor do atributo</label>
          <Input
            type="number"
            value={attribute.value}
            onChange={e => onChange("value", e.target.value)}
            placeholder="valor"
            className="w-full"
          />
        </div>
      )}
      {attribute.type === "date" && (
        <div>
          <label className="text-stuff-light">data do atributo</label>
          <Input
            type="date"
            value={typeof attribute.value === "string" ? attribute.value : (attribute.value ? String(attribute.value) : "")}
            onChange={e => onChange("value", e.target.value)}
            placeholder="valor"
            className="w-full"
          />
        </div>
      )}
      {attribute.type === "boolean" && (
        <div>
          <label className="text-stuff-light">valor booleano</label>
          <div className="w-full flex items-center">
            <Switch
              checked={!!attribute.value}
              onChange={checked => onChange("value", checked)}
              label={attribute.value ? "sim" : "não"}
            />
          </div>
        </div>
      )}
      {attribute.type === "metric" && (
        <div>
          <label className="text-stuff-light">valor e unidade</label>
          <div className="w-full flex gap-2">
            <Input
              type="number"
              value={attribute.value}
              onChange={e => onChange("value", e.target.value)}
              placeholder="valor"
              className="w-2/3"
            />
            <Select
              options={[
                { value: "ton", label: "tonelada" },
                { value: "kilogram", label: "quilograma" },
                { value: "gram", label: "grama" },
                { value: "kilometer", label: "quilômetro" },
                { value: "meter", label: "metro" },
                { value: "centimeter", label: "centímetro" },
                { value: "square_meter", label: "metro quadrado" },
                { value: "cubic_meter", label: "metro cúbico" },
                { value: "mile", label: "milha" },
                { value: "feet", label: "pé" },
                { value: "degree", label: "grau" },
                { value: "liter", label: "litro" },
              ]}
              value={attribute.unit || ""}
              onChange={e => onChange("unit", e.target.value)}
              className="w-1/3"
            />
          </div>
        </div>
      )}
      {attribute.type === "timemetric" && (
        <div>
          <label className="text-stuff-light">escala e unidade de tempo</label>
          <div className="w-full flex gap-2">
            <Input
              type="number"
              value={(() => {
                if (attribute.value && typeof attribute.value === "object") {
                  return attribute.value.scale ?? attribute.value.value ?? "";
                } else if (typeof attribute.value === "string" || typeof attribute.value === "number") {
                  return attribute.value;
                }
                return "";
              })()}
              onChange={e => {
                let newValue = e.target.value;
                let unit = "";
                if (attribute.value && typeof attribute.value === "object") {
                  unit = attribute.value.unit ?? "";
                }
                onChange("value", { scale: newValue, unit });
              }}
              placeholder="escala"
              className="w-1/2"
            />
            <Select
              options={[
                { value: "second", label: "segundo" },
                { value: "minute", label: "minuto" },
                { value: "hour", label: "hora" },
                { value: "day", label: "dia" },
                { value: "week", label: "semana" },
                { value: "month", label: "mês" },
                { value: "year", label: "ano" },
              ]}
              value={(() => {
                if (attribute.value && typeof attribute.value === "object") {
                  return attribute.value.unit ?? "";
                }
                return "";
              })()}
              onChange={e => {
                let scale = "";
                if (attribute.value && typeof attribute.value === "object") {
                  scale = attribute.value.scale ?? attribute.value.value ?? "";
                } else if (typeof attribute.value === "string" || typeof attribute.value === "number") {
                  scale = String(attribute.value);
                }
                onChange("value", { scale, unit: e.target.value });
              }}
              className="w-1/2"
            />
          </div>
        </div>
      )}
      {attribute.type === "select" && (
        <div className="w-full flex flex-col gap-1">
          <label className="text-stuff-light">nova opção</label>
          <div className="flex gap-1 mb-1">
            <Input
              type="text"
              value={attribute.newOption || ""}
              onChange={e => onChange("newOption", e.target.value)}
              placeholder="nova opção"
              className="flex-1"
            />
            <Button
              type="button"
              palette="success"
              size="sm"
              disabled={!attribute.newOption || attribute.newOption.trim() === ""}
              onClick={() => {
                if (attribute.newOption && attribute.newOption.trim()) {
                  onChange("options", [...(Array.isArray(attribute.options) ? attribute.options : []), attribute.newOption.trim()]);
                  onChange("newOption", "");
                }
              }}
            ><Plus/></Button>
          </div>
          {Array.isArray(attribute.options) && attribute.options.length > 0 && (
            <div>
              <label className="text-stuff-light">opções cadastradas</label>
              <OptionTokenList
                options={attribute.options}
                value={attribute.value}
                onRemove={opt => {
                  const newOpts = (Array.isArray(attribute.options) ? attribute.options : []).filter(o => o !== opt);
                  onChange("options", newOpts);
                  if (attribute.value === opt) onChange("value", "");
                  if (Array.isArray(attribute.value) && attribute.value.includes(opt)) onChange("value", attribute.value.filter((v: string) => v !== opt));
                }}
              />
            </div>
          )}
          <label className="text-stuff-light">selecione o valor final</label>
          <Select
            disabled={!Array.isArray(attribute.options) || attribute.options.length === 0}
            options={Array.isArray(attribute.options) && attribute.options.length > 0
              ? [{ value: '', label: 'selecione uma opção' }, ...attribute.options.map((opt: string) => ({ value: opt, label: opt }))]
              : [{ value: '', label: 'crie uma opção e depois a selecione' }]}
            value={Array.isArray(attribute.value) ? (attribute.value[0] || '') : (attribute.value || '')}
            onChange={e => onChange('value', e.target.value)}
            className="w-full"
          />
        </div>
      )}
      {attribute.type === "multiselection" && (
        <div className="w-full flex flex-col gap-1">
          <label className="text-stuff-light">nova opção</label>
          <div className="flex gap-1 mb-1">
            <Input
              type="text"
              value={attribute.newOption || ""}
              onChange={e => onChange("newOption", e.target.value)}
              placeholder="nova opção"
              className="flex-1"
            />
            <Button
              type="button"
              palette="success"
              size="sm"
              disabled={!attribute.newOption || attribute.newOption.trim() === ""}
              onClick={() => {
                if (attribute.newOption && attribute.newOption.trim()) {
                  onChange("options", [...(Array.isArray(attribute.options) ? attribute.options : []), attribute.newOption.trim()]);
                  onChange("newOption", "");
                }
              }}
            ><Plus/></Button>
          </div>
          {Array.isArray(attribute.options) && attribute.options.length > 0 && (
          <>
            <label className="text-stuff-light">opções cadastradas</label>
            <OptionTokenList
              options={attribute.options}
              value={attribute.value}
              onRemove={opt => {
                const newOpts = attribute.options!.filter(o => o !== opt);
                onChange("options", newOpts);
                // Remove from value if present
                const current = typeof attribute.value === 'string' ? attribute.value.split(',').map(v => v.trim()).filter(Boolean) : [];
                if (current.includes(opt)) {
                  const updated = current.filter(v => v !== opt);
                  onChange("value", updated.join(","));
                }
              }}
            />
          </>
          )}
          <label className="text-stuff-light">selecione os valores finais</label>
          <ValueTokenSelector
            options={Array.isArray(attribute.options) ? attribute.options : []}
            value={attribute.value}
            onChange={val => onChange("value", val)}
          />
        </div>
      )}
      {attribute.type === "file" && (
        <div>
          <label className="text-stuff-light">arquivo</label>
          <Input
            type="file"
            onChange={e => onChange("value", e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>
      )}
      {attribute.type === "rfid" && (
        <div>
          <label className="text-stuff-light">rfid</label>
          <Input
            type="text"
            value={attribute.value}
            onChange={e => onChange("value", e.target.value)}
            placeholder="rfid"
            className="w-full"
          />
        </div>
      )}
      <div className="flex justify-end gap-2 mt-2">
        <Button type="button" palette="danger" onClick={onCancel} disabled={loading}>cancelar</Button>
        <Button type="submit" palette="success" loading={loading}>salvar atributo</Button>
      </div>
    </form>
  );
};

export default AddSingleAttributeStep;
