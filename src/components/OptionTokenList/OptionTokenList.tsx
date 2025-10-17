import { Cross, X } from "lucide-react";
import React from "react";

interface OptionTokenListProps {
  options: string[];
  value: string;
  onRemove: (option: string) => void;
}

const OptionTokenList: React.FC<OptionTokenListProps> = ({ options, value, onRemove }) => (
  <div className="flex flex-wrap gap-1 mb-1">
    {options.map((opt, idx) => (
      <span key={opt} className="bg-stuff-white border-2 border-b-4 px-2 py-1 rounded-lg text-stuff-light flex items-center gap-1">
        {opt}
        <button
          type="button"
          className="text-stuff-danger cursor-pointer ml-1 rounded-full hover:bg-stuff-high/40 p-1 flex items-center justify-center"
          onClick={() => onRemove(opt)}
        ><X size={12} strokeWidth="4"/></button>
      </span>
    ))}
  </div>
);

export default OptionTokenList;
