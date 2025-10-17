import React from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Select from "../Select/Select";
import Switch from "../Switch/Switch";
import Textarea from "../Input/Textarea";
import ToggleButton from "../Button/ToggleButton";
import { Trash2, Pencil, Plus, Filter, CircleHelp } from "lucide-react";

export interface Attribute {
  name: string;
  type: string;
  value: any;
  options?: string[];
  unit?: string;
  timeUnit?: string;
  copied?: boolean;
  newOption?: string;
}

export interface AddAssetStep2Props {
  loading: boolean;
  attributes: Attribute[];
  onAddAttribute: () => void;
  onAttributeChange: (idx: number, field: string, value: any) => void;
  onRemoveAttribute: (idx: number) => void;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
}

const AddAssetStep2: React.FC<AddAssetStep2Props> = ({
  loading,
  attributes,
  onAddAttribute,
  onAttributeChange,
  onRemoveAttribute,
  onCancel,
  onBack,
  onNext,
}) => {
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string[]>([]);
  const [showTypeMenu, setShowTypeMenu] = React.useState(false);
  // Helper to remove accents
  const normalizeStr = (str: string) =>
    str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  // Attribute types for filter buttons
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
  // Filter attributes by name (accent-insensitive) and type
  const filteredAttributes = attributes.filter(attr => {
    const query = normalizeStr(search.trim());
    const matchesName = !query || normalizeStr(attr.name).includes(query);
    const matchesType = typeFilter.length === 0 || typeFilter.includes(attr.type);
    return matchesName && matchesType;
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onNext(); }}>
      <div className="mb-2">
        <div className="flex items-top justify-between mb-4">
          <h3 className="text-lg font-bold text-stuff-light mb-2">Atributos do ativo</h3>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <Input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome do atributo"
            className="w-1/2"
          />
          <Button type="button" palette="success" size="sm" className="py-3" onClick={onAddAttribute}><Plus /></Button>
          <ToggleButton
            pressed={!showTypeMenu}
            onClick={() => setShowTypeMenu(v => !v)}
            title={showTypeMenu ? "esconder filtros" : "mostrar filtros"}
            className="py-3 px-3 flex items-center gap-1"
            aria-label="Filtrar tipos"
            size="sm"
          >
            <Filter />
          </ToggleButton>
        </div>
        {showTypeMenu && (
          <div className="flex flex-wrap gap-2 mb-3 ml-2">
            {typeOptions.map(opt => (
              <ToggleButton
                key={opt.value}
                pressed={!typeFilter.includes(opt.value)}
                onClick={() => {
                  setTypeFilter(prev =>
                    prev.includes(opt.value)
                      ? prev.filter(t => t !== opt.value)
                      : [...prev, opt.value]
                  );
                }}
                className="px-3 py-2"
                size="sm"
              >{opt.label}</ToggleButton>
            ))}
          </div>
        )}
  <div className="h-[48vh] overflow-y-auto custom-scrollbar border-2 border-t-8 border-stuff-light rounded-2xl w-full bg-stuff-white p-2">
            {filteredAttributes.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full w-full">
                <CircleHelp size={48} className="text-stuff-light mb-2" />
                <h3 className="text-lg font-semibold mb-1">Nenhum ativo encontrado</h3>
          </div>
            )}
            {filteredAttributes.map((attr, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                <Input
                    type="text"
                    value={attr.name}
                    placeholder="Nome do atributo"
                    className="w-1/3"
                    readOnly
                />
                <Select
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
                    value={attr.type}
                    className="w-1/4"
                    disabled
                />
                {/* Render input based on type */}
                {attr.type === "text" && (
                    <Input
                    type="text"
                    value={attr.value}
                    placeholder="Valor"
                    className="w-1/3"
                    readOnly
                    />
                )}
                {attr.type === "number" && (
                    <Input
                    type="number"
                    value={attr.value}
                    placeholder="Valor"
                    className="w-1/3"
                    readOnly
                    />
                )}
                {attr.type === "date" && (
                    <Input
                    type="date"
                    value={(() => {
                        if (typeof attr.value === "string") {
                        // If value is a placeholder, show empty
                        if (attr.value.trim() === "dd/mm/aaaa") return "";
                        // If value is ISO or valid date, format as yyyy-mm-dd
                        const d = new Date(attr.value);
                        if (!isNaN(d.getTime())) {
                            return d.toISOString().slice(0, 10);
                        }
                        // Otherwise, show as is
                        return attr.value;
                        }
                        return attr.value ? String(attr.value) : "";
                    })()}
                    placeholder="Valor"
                    className="w-1/3"
                    readOnly
                    />
                )}
                {attr.type === "boolean" && (
                    <div className="w-1/3 flex items-center justify-center">
                    <Switch
                        checked={!!attr.value}
                        label={attr.value ? "Sim" : "Não"}
                        disabled
                        onChange={() => {}}
                    />
                    </div>
                )}
                {attr.type === "metric" && (
                    <div className="w-1/3 flex gap-2">
                    <Input
                        type="number"
                        value={attr.value}
                        placeholder="Valor"
                        className="w-2/3"
                        readOnly
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
                        value={attr.unit || ""}
                        className="w-1/3"
                        disabled
                    />
                    </div>
                )}
                {attr.type === "timemetric" && (
                    <Input
                    type="text"
                    value={(() => {
                        // Extract value (scale)
                        let scale = "";
                        if (attr.value && typeof attr.value === "object" && attr.value !== null) {
                        scale = attr.value.scale ?? attr.value.value ?? "";
                        } else if (typeof attr.value === "number" || typeof attr.value === "string") {
                        scale = String(attr.value);
                        }
                        // Extract unit: value.unit, attr.unit, attr.timeUnit
                        let unit = "";
                        if (attr.value && typeof attr.value === "object" && attr.value !== null && typeof attr.value.unit === "string" && attr.value.unit) {
                        unit = attr.value.unit;
                        } else if (typeof attr.unit === "string" && attr.unit) {
                        unit = attr.unit;
                        } else if (typeof attr.timeUnit === "string" && attr.timeUnit) {
                        unit = attr.timeUnit;
                        }
                        // Map unit to label
                        const unitLabels: Record<string, string> = {
                        second: "segundos",
                        segundos: "segundos",
                        minute: "minutos",
                        minutos: "minutos",
                        hour: "horas",
                        horas: "horas",
                        day: "dias",
                        dias: "dias",
                        week: "semanas",
                        semanas: "semanas",
                        month: "meses",
                        meses: "meses",
                        year: "anos",
                        anos: "anos",
                        };
                        const unitLabel = unitLabels[unit] || unit || "";
                        return scale && unitLabel ? `${scale} ${unitLabel}`.trim() : scale;
                    })()}
                    placeholder="Escala e unidade"
                    className="w-1/2"
                    readOnly
                    />
                )}
                {attr.type === "select" && (
                    attr.copied && Array.isArray(attr.options) ? (
                    <Select
                        options={[{ value: '', label: 'Selecione...' }, ...attr.options.map((opt: string) => ({ value: opt, label: opt }))]}
                        value={attr.value || ''}
                        className="w-1/3"
                        disabled
                    />
                    ) : (
                    <div className="w-1/3 flex flex-col gap-1">
                        <div className="flex gap-1 mb-1">
                        <Input
                            type="text"
                            value={attr.newOption || ''}
                            placeholder="Nova opção"
                            className="flex-1"
                            readOnly
                        />
                        <Button
                            type="button"
                            palette="success"
                            size="sm"
                            disabled
                        >+</Button>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-1">
                        {Array.isArray(attr.options) && attr.options.map((opt: string, optIdx: number) => (
                            <span key={optIdx} className="bg-stuff-light/20 px-2 py-1 rounded flex items-center gap-1">
                            {opt}
                            </span>
                        ))}
                        </div>
                        <Select
                        options={Array.isArray(attr.options)
                            ? [{ value: '', label: 'Selecione...' }, ...attr.options.map((opt: string) => ({ value: opt, label: opt }))]
                            : [{ value: '', label: 'Selecione...' }]}
                        value={attr.value || ''}
                        className="w-full"
                        disabled
                        />
                    </div>
                    )
                )}
                {attr.type === "multiselection" && (
                    attr.copied && Array.isArray(attr.options) ? (
                    <Select
                        options={attr.options.map((opt: string) => ({ value: opt, label: opt }))}
                        value={Array.isArray(attr.value) ? attr.value : []}
                        className="w-1/3"
                        multiple
                        disabled
                    />
                    ) : (
                    <div className="w-1/3 flex flex-col gap-1">
                        <div className="flex gap-1 mb-1">
                        <Input
                            type="text"
                            value={attr.newOption || ''}
                            placeholder="Nova opção"
                            className="flex-1"
                            readOnly
                        />
                        <Button
                            type="button"
                            palette="success"
                            size="sm"
                            disabled
                        >+</Button>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-1">
                        {Array.isArray(attr.options) && attr.options.map((opt: string, optIdx: number) => (
                            <span key={optIdx} className="bg-stuff-light/20 px-2 py-1 rounded flex items-center gap-1">
                            {opt}
                            </span>
                        ))}
                        </div>
                        <Select
                        options={Array.isArray(attr.options)
                            ? attr.options.map((opt: string) => ({ value: opt, label: opt }))
                            : []}
                        value={Array.isArray(attr.value) ? attr.value : []}
                        className="w-full"
                        multiple
                        disabled
                        />
                    </div>
                    )
                )}
                {attr.type === "file" && (
                    <Input
                    type="file"
                    className="w-1/3"
                    disabled
                    />
                )}
                {attr.type === "rfid" && (
                    <Input
                    type="text"
                    value={attr.value}
                    placeholder="RFID"
                    className="w-1/3"
                    readOnly
                    />
                )}
                <Button className="py-2" type="button" palette="danger" size="sm" onClick={() => onRemoveAttribute(idx)}><Trash2 /></Button>
                {attr.copied && (
                    <Button
                    type="button"
                    palette="default"
                    size="sm"
                    className="py-2"
                    onClick={() => {
                        // Trigger edit for copied attribute (open AddSingleAttributeStep)
                        if (window && window.dispatchEvent) {
                        window.dispatchEvent(new CustomEvent('editCopiedAttribute', { detail: { idx } }));
                        }
                    }}
                    ><Pencil /></Button>
                )}
                </div>
            ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-2">
          <Button
            type="button"
            palette="danger"
            onClick={onCancel}
            disabled={loading}
          >cancelar</Button>
        <Button
          type="button"
          palette="default"
          onClick={onBack}
          disabled={loading}
        >voltar</Button>
        <Button
          type="submit"
          palette="success"
          disabled={attributes.length === 0}
          loading={loading}
        >próximo</Button>
      </div>
    </form>
  );
};

export default AddAssetStep2;
