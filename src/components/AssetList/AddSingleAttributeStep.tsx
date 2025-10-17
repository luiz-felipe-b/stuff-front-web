import React from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Select from "../Select/Select";
import Switch from "../Switch/Switch";
import Textarea from "../Input/Textarea";

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
}

const typeOptions = [
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
];

const AddSingleAttributeStep: React.FC<AddSingleAttributeStepProps> = ({
  attribute,
  onChange,
  onSave,
  onCancel,
  loading,
}) => {
  return (
    <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onSave(); }}>
      <h3 className="text-lg font-bold text-stuff-light mb-2">Novo atributo</h3>
      <Input
        type="text"
        value={attribute.name}
        onChange={e => onChange("name", e.target.value)}
        placeholder="Nome do atributo"
        className="w-full"
        required
      />
      <Select
        options={typeOptions}
        value={attribute.type}
        onChange={e => onChange("type", e.target.value)}
        className="w-full"
        required
      />
      {/* Render input based on type */}
      {attribute.type === "text" && (
        <Input
          type="text"
          value={attribute.value}
          onChange={e => onChange("value", e.target.value)}
          placeholder="Valor"
          className="w-full"
        />
      )}
      {attribute.type === "number" && (
        <Input
          type="number"
          value={attribute.value}
          onChange={e => onChange("value", e.target.value)}
          placeholder="Valor"
          className="w-full"
        />
      )}
      {attribute.type === "date" && (
        <Input
          type="date"
          value={typeof attribute.value === "string" ? attribute.value : (attribute.value ? String(attribute.value) : "")}
          onChange={e => onChange("value", e.target.value)}
          placeholder="Valor"
          className="w-full"
        />
      )}
      {attribute.type === "boolean" && (
        <div className="w-full flex items-center justify-center">
          <Switch
            checked={!!attribute.value}
            onChange={checked => onChange("value", checked)}
            label={attribute.value ? "Sim" : "Não"}
          />
        </div>
      )}
      {attribute.type === "metric" && (
        <div className="w-full flex gap-2">
          <Input
            type="number"
            value={attribute.value}
            onChange={e => onChange("value", e.target.value)}
            placeholder="Valor"
            className="w-2/3"
          />
          <Select
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
            value={attribute.unit || ""}
            onChange={e => onChange("unit", e.target.value)}
            className="w-1/3"
          />
        </div>
      )}
      {attribute.type === "timemetric" && (
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
            placeholder="Escala"
            className="w-1/2"
          />
          <Select
            options={[
              { value: "second", label: "Segundo" },
              { value: "minute", label: "Minuto" },
              { value: "hour", label: "Hora" },
              { value: "day", label: "Dia" },
              { value: "week", label: "Semana" },
              { value: "month", label: "Mês" },
              { value: "year", label: "Ano" },
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
      )}
      {attribute.type === "select" && (
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-1 mb-1">
            <Input
              type="text"
              value={attribute.newOption || ""}
              onChange={e => onChange("newOption", e.target.value)}
              placeholder="Nova opção"
              className="flex-1"
            />
            <Button
              type="button"
              palette="success"
              size="sm"
              onClick={() => {
                if (attribute.newOption && attribute.newOption.trim()) {
                  onChange("options", [...(Array.isArray(attribute.options) ? attribute.options : []), attribute.newOption.trim()]);
                  onChange("newOption", "");
                }
              }}
            >+</Button>
          </div>
          <div className="flex flex-wrap gap-1 mb-1">
            {Array.isArray(attribute.options) && attribute.options.map((opt: string, optIdx: number) => (
              <span key={optIdx} className="bg-stuff-light/20 px-2 py-1 rounded flex items-center gap-1">
                {opt}
                <button type="button" className="text-stuff-danger ml-1" onClick={() => {
                  const newOpts = (Array.isArray(attribute.options) ? attribute.options : []).filter((_: string, i: number) => i !== optIdx);
                  onChange("options", newOpts);
                  if (attribute.value === opt) onChange("value", "");
                  if (Array.isArray(attribute.value) && attribute.value.includes(opt)) onChange("value", attribute.value.filter((v: string) => v !== opt));
                }}>×</button>
              </span>
            ))}
          </div>
          <Select
            options={Array.isArray(attribute.options)
              ? [{ value: '', label: 'Selecione...' }, ...attribute.options.map((opt: string) => ({ value: opt, label: opt }))]
              : [{ value: '', label: 'Selecione...' }]}
            value={attribute.value || ''}
            onChange={e => onChange('value', e.target.value)}
            className="w-full"
          />
        </div>
      )}
      {attribute.type === "multiselection" && (
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-1 mb-1">
            <Input
              type="text"
              value={attribute.newOption || ""}
              onChange={e => onChange("newOption", e.target.value)}
              placeholder="Nova opção"
              className="flex-1"
            />
            <Button
              type="button"
              palette="success"
              size="sm"
              onClick={() => {
                if (attribute.newOption && attribute.newOption.trim()) {
                  onChange("options", [...(Array.isArray(attribute.options) ? attribute.options : []), attribute.newOption.trim()]);
                  onChange("newOption", "");
                }
              }}
            >+</Button>
          </div>
          <div className="flex flex-wrap gap-1 mb-1">
            {Array.isArray(attribute.options) && attribute.options.map((opt: string, optIdx: number) => (
              <span key={optIdx} className="bg-stuff-light/20 px-2 py-1 rounded flex items-center gap-1">
                {opt}
                <button type="button" className="text-stuff-danger ml-1" onClick={() => {
                  const newOpts = (Array.isArray(attribute.options) ? attribute.options : []).filter((_: string, i: number) => i !== optIdx);
                  onChange("options", newOpts);
                  if (Array.isArray(attribute.value) && attribute.value.includes(opt)) onChange("value", attribute.value.filter((v: string) => v !== opt));
                }}>×</button>
              </span>
            ))}
          </div>
          <Select
            options={Array.isArray(attribute.options)
              ? attribute.options.map((opt: string) => ({ value: opt, label: opt }))
              : []}
            value={Array.isArray(attribute.value) ? attribute.value : []}
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
              onChange('value', selected);
            }}
            className="w-full"
            multiple
          />
        </div>
      )}
      {attribute.type === "file" && (
        <Input
          type="file"
          onChange={e => onChange("value", e.target.files?.[0] || null)}
          className="w-full"
        />
      )}
      {attribute.type === "rfid" && (
        <Input
          type="text"
          value={attribute.value}
          onChange={e => onChange("value", e.target.value)}
          placeholder="RFID"
          className="w-full"
        />
      )}
      <div className="flex justify-end gap-2 mt-2">
        <Button type="button" palette="danger" onClick={onCancel} disabled={loading}>cancelar</Button>
        <Button type="submit" palette="success" loading={loading}>salvar atributo</Button>
      </div>
    </form>
  );
};

export default AddSingleAttributeStep;
