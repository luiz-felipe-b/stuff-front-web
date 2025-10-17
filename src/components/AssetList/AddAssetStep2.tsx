import React from "react";
import Button from "../Button/Button";
import ToggleButton from "../Button/ToggleButton";
import { Trash2, Pencil, Plus, Filter, CircleHelp, Calendar, CheckSquare, FileText, Hash, ListChecks, Package, Radio, Tag, Timer, ToggleLeft } from "lucide-react";
import Input from "../Input/Input";
import { getAttributeIcon } from "@/util/getAttributeIcon";

export interface Attribute {
  name: string;
  type: string;
  value: any;
  unit?: string;
  timeUnit?: string;
}

export interface AddAssetStep2Props {
  loading: boolean;
  attributes: Attribute[];
  onAddAttribute: () => void;
  onRemoveAttribute: (idx: number) => void;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
}

const AddAssetStep2: React.FC<AddAssetStep2Props> = ({
  loading,
  attributes,
  onAddAttribute,
  onRemoveAttribute,
  onCancel,
  onBack,
  onNext,
}) => {
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string[]>([]);
  const [showTypeMenu, setShowTypeMenu] = React.useState(false);

  const normalizeStr = (str: string) =>
    str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

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
  // Filter attributes by name
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
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome do atributo"
            className="w-1/2 border rounded px-2 py-1"
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
          <div className="flex font-semibold text-stuff-light rounded px-2 py-2 mb-2">
            <div className="w-1/3">nome</div>
            <div className="w-1/3">tipo</div>
            <div className="w-1/3">valor</div>
            <div className="w-1/6 text-center">ações</div>
          </div>
          {filteredAttributes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <CircleHelp size={48} className="text-stuff-light mb-2" />
              <h3 className="text-lg font-semibold mb-1">nenhum ativo encontrado</h3>
            </div>
          ) : (
            filteredAttributes.map((attr, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2 px-4 py-2 border-b-4 border-2 rounded-2xl border-stuff-light shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                <div className="w-1/3 truncate" title={attr.name}>{attr.name}</div>
                <div className="w-1/3 flex gap-2 items-center truncate" title={attr.type}>{getAttributeIcon(attr.type)}{(() => {
                  const typeLabels: Record<string, string> = {
                    text: "texto",
                    number: "numérico",
                    boolean: "booleano",
                    date: "data",
                    metric: "métrica",
                    select: "seleção",
                    multiselection: "seleção múltipla",
                    timemetric: "tempo métrico",
                    file: "arquivo",
                    rfid: "rfid",
                  };
                  return typeLabels[attr.type] || attr.type;
                })()}</div>
                <div className="w-1/3 truncate" title={(() => {
                  if (attr.type === "metric") {
                    const scale = attr.value ?? "";
                    const unitLabels: Record<string, string> = {
                      ton: "tonelada",
                      kilogram: "quilograma",
                      gram: "grama",
                      kilometer: "quilômetro",
                      meter: "metro",
                      centimeter: "centímetro",
                      square_meter: "metro quadrado",
                      cubic_meter: "metro cúbico",
                      mile: "milha",
                      feet: "pé",
                      degree: "grau",
                      liter: "litro",
                    };
                    const unit = attr.unit ? (unitLabels[attr.unit] || attr.unit) : "";
                    return `${scale} ${unit}`.trim();
                  }
                  if (attr.type === "timemetric") {
                    let scale = "";
                    if (attr.value && typeof attr.value === "object" && attr.value !== null) {
                      scale = attr.value.scale ?? attr.value.value ?? "";
                    } else if (typeof attr.value === "number" || typeof attr.value === "string") {
                      scale = String(attr.value);
                    }
                    let unit = "";
                    if (attr.value && typeof attr.value === "object" && attr.value !== null && typeof attr.value.unit === "string" && attr.value.unit) {
                      unit = attr.value.unit;
                    } else if (typeof attr.unit === "string" && attr.unit) {
                      unit = attr.unit;
                    } else if (typeof attr.timeUnit === "string" && attr.timeUnit) {
                      unit = attr.timeUnit;
                    }
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
                    return `${scale} ${unitLabel}`.trim();
                  }
                  return String(attr.value);
                })()}>{(() => {
                  if (attr.type === "metric") {
                    const scale = attr.value ?? "";
                    const unitLabels: Record<string, string> = {
                      ton: "tonelada",
                      kilogram: "quilograma",
                      gram: "grama",
                      kilometer: "quilômetro",
                      meter: "metro",
                      centimeter: "centímetro",
                      square_meter: "metro quadrado",
                      cubic_meter: "metro cúbico",
                      mile: "milha",
                      feet: "pé",
                      degree: "grau",
                      liter: "litro",
                    };
                    const unit = attr.unit ? (unitLabels[attr.unit] || attr.unit) : "";
                    return `${scale} ${unit}`.trim();
                  }
                  if (attr.type === "timemetric") {
                    let scale = "";
                    if (attr.value && typeof attr.value === "object" && attr.value !== null) {
                      scale = attr.value.scale ?? attr.value.value ?? "";
                    } else if (typeof attr.value === "number" || typeof attr.value === "string") {
                      scale = String(attr.value);
                    }
                    let unit = "";
                    if (attr.value && typeof attr.value === "object" && attr.value !== null && typeof attr.value.unit === "string" && attr.value.unit) {
                      unit = attr.value.unit;
                    } else if (typeof attr.unit === "string" && attr.unit) {
                      unit = attr.unit;
                    } else if (typeof attr.timeUnit === "string" && attr.timeUnit) {
                      unit = attr.timeUnit;
                    }
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
                    return `${scale} ${unitLabel}`.trim();
                  }
                  return String(attr.value);
                })()}</div>
                <div className="w-1/6 flex justify-center gap-2">
                  <Button className="py-2" type="button" palette="danger" size="sm" onClick={() => onRemoveAttribute(idx)}><Trash2 /></Button>
                  <Button
                    type="button"
                    palette="default"
                    size="sm"
                    className="py-2"
                    onClick={() => {
                      if (window && window.dispatchEvent) {
                        window.dispatchEvent(new CustomEvent('editCopiedAttribute', { detail: { idx } }));
                      }
                    }}
                  >
                    <Pencil />
                  </Button>
                </div>
              </div>
            ))
          )}
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