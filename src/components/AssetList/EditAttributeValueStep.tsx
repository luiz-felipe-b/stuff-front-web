import React from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Select from "../Select/Select";
import Switch from "../Switch/Switch";
import OptionTokenList from "../OptionTokenList/OptionTokenList";
import ValueTokenSelector from "../ValueTokenSelector/ValueTokenSelector";

export interface EditAttributeStepProps {
  attribute: any;
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const EditAttributeValueStep: React.FC<EditAttributeStepProps> = ({
  attribute,
  onChange,
  onSave,
  onCancel,
  loading,
}) => {
  return (
    <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onSave(); }}>
      <h3 className="text-lg font-bold text-stuff-light mb-2">Editar atributo</h3>
      <div>
        <label className="text-stuff-light">nome do atributo</label>
        <Input
          type="text"
          value={attribute.name}
          onChange={e => onChange("name", e.target.value)}
          placeholder="nome do atributo"
          className="w-full"
          required
        />
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
      {(attribute.type === "select" || attribute.type === "singleselection") && (
        <div className="w-full flex flex-col gap-1">
          <label className="text-stuff-light">opções cadastradas</label>
          <OptionTokenList
            options={Array.isArray(attribute.options) ? attribute.options : []}
            value={attribute.value}
            onRemove={opt => {
              const newOpts = (Array.isArray(attribute.options) ? attribute.options : []).filter((o: string) => o !== opt);
              onChange("options", newOpts);
              if (attribute.value === opt) onChange("value", "");
              if (Array.isArray(attribute.value) && attribute.value.includes(opt)) onChange("value", "");
            }}
          />
          <label className="text-stuff-light">selecione o valor final</label>
          <Select
            disabled={!Array.isArray(attribute.options) || attribute.options.length === 0}
            options={Array.isArray(attribute.options) && attribute.options.length > 0
              ? [{ value: '', label: 'selecione uma opção' }, ...attribute.options.map((opt: string) => ({ value: opt, label: opt }))]
              : [{ value: '', label: 'crie uma opção e depois a selecione' }]}
            value={Array.isArray(attribute.value) ? (attribute.value[0] || '') : (typeof attribute.value === 'string' ? attribute.value : '')}
            onChange={e => onChange('value', e.target.value)}
            className="w-full"
          />
        </div>
      )}
      {attribute.type === "multiselection" && (
        <div className="w-full flex flex-col gap-1">
          <label className="text-stuff-light">opções cadastradas</label>
          <OptionTokenList
            options={Array.isArray(attribute.options) ? attribute.options : []}
            value={attribute.value}
            onRemove={opt => {
              const newOpts = (Array.isArray(attribute.options) ? attribute.options : []).filter((o: string) => o !== opt);
              onChange("options", newOpts);
              let current: string[] = [];
              if (Array.isArray(attribute.value)) {
                current = attribute.value;
              } else if (typeof attribute.value === 'string') {
                current = attribute.value.split(',').map((v: string) => v.trim()).filter(Boolean);
              }
              if (current.includes(opt)) {
                const updated = current.filter((v: string) => v !== opt);
                onChange("value", updated);
              }
            }}
          />
          <label className="text-stuff-light">selecione os valores finais</label>
          <ValueTokenSelector
            options={Array.isArray(attribute.options) ? attribute.options : []}
            value={Array.isArray(attribute.value) ? attribute.value : (typeof attribute.value === 'string' ? attribute.value.split(',').map((v: string) => v.trim()).filter(Boolean) : [])}
            onChange={val => {
              if (Array.isArray(val)) {
                onChange("value", val);
              } else if (typeof val === 'string') {
                onChange("value", (val as string).split(',').map((v: string) => v.trim()).filter(Boolean));
              } else {
                onChange("value", []);
              }
            }}
          />
        </div>
      )}
      <div className="flex justify-end gap-2 mt-2">
        <Button type="button" palette="danger" onClick={onCancel} disabled={loading}>cancelar</Button>
        <Button type="submit" palette="success" loading={loading}>salvar alterações</Button>
      </div>
    </form>
  );
};

export default EditAttributeValueStep;
