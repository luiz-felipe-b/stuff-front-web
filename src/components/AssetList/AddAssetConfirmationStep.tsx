import React from "react";
import Button from "../Button/Button";
import { Pencil } from "lucide-react";
import { getAttributeIcon } from "@/util/getAttributeIcon";

export interface AddAssetConfirmationStepProps {
  loading: boolean;
  newAsset: { name: string; description: string };
  attributes: any[];
  onBack: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const AddAssetConfirmationStep: React.FC<AddAssetConfirmationStepProps> = ({
  loading,
  newAsset,
  attributes,
  onBack,
  onConfirm,
  onCancel,
}) => (
  <div className="flex flex-col gap-6 p-6">
    <div className="flex flex-col gap-2">
      <p className="font-extrabold text-stuff-light">Dados do novo ativo</p>
      <div className="flex flex-col border-2 border-b-4 border-stuff-light rounded-2xl p-4 bg-stuff-white">
        <div className="flex flex-col md:flex-row md:gap-8 gap-2">
          <div>
            <div className="font-semibold text-stuff-light">nome</div>
            <div className="text-stuff-black text-base">{newAsset.name}</div>
          </div>
          <div>
            <div className="font-semibold text-stuff-light">descrição</div>
            <div className="text-stuff-black text-base">{newAsset.description}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="flex flex-col gap-2">
      <div className="text-stuff-light font-extrabold">Atributos</div>
      <div className="max-h-48 overflow-y-auto custom-scrollbar border-2 border-t-8 border-stuff-light rounded-2xl w-full bg-stuff-white p-2">
        <div className="flex font-semibold text-stuff-light rounded px-2 py-2 mb-2">
          <div className="w-1/3">nome</div>
          <div className="w-1/3">tipo</div>
          <div className="w-1/3">valor</div>
        </div>
        {attributes.length === 0 ? (
          <div className="text-stuff-mid">nenhum atributo.</div>
        ) : (
          attributes.map((attr, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2 px-4 py-2 border-b-4 border-2 rounded-2xl border-stuff-light shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
              <div className="w-1/3 truncate" title={attr.name}>{attr.name}</div>
              <div className="w-1/3 truncate flex gap-2" title={attr.type}>{getAttributeIcon(attr.type)}{(() => {
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
            </div>
          ))
        )}
      </div>
    </div>
    <div className="flex justify-end gap-3 mt-4">
      <Button
        type="button"
        palette="danger"
        size="md"
        onClick={onCancel}
        disabled={loading}
        className="font-bold"
      >cancelar</Button>
      <Button
        type="button"
        palette="default"
        size="md"
        onClick={onBack}
        disabled={loading}
        className="font-bold"
      >voltar</Button>
      <Button
        type="button"
        palette="success"
        size="md"
        onClick={onConfirm}
        disabled={loading}
        className="font-bold"
      >criar</Button>
    </div>
  </div>
);

export default AddAssetConfirmationStep;
