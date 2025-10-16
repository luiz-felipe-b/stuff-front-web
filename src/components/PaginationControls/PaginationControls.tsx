import React from "react";
import Button from "../Button/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <Button
        size="sm"
        palette="default"
        variant="primary"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft />
      </Button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`px-2 py-1 rounded ${page === i + 1 ? 'bg-stuff-primary text-white font-bold' : 'bg-stuff-gray-50 text-stuff-mid cursor-pointer'}`}
          onClick={() => onPageChange(i + 1)}
          disabled={page === i + 1}
          style={{ minWidth: 32 }}
        >
          {i + 1}
        </button>
      ))}
      <Button
        size="sm"
        palette="default"
        variant="primary"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default PaginationControls;
