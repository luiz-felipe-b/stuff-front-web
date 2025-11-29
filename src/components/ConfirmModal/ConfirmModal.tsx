"use client";

import React, { useRef, useEffect } from "react";
import Button from "../Button/Button";

import type { ButtonPalette } from "../Button/types/Button.types";

interface ConfirmModalProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  cancelPalette?: ButtonPalette;
  confirmPalette?: ButtonPalette;
  children?: React.ReactNode; // Added children prop
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  message,
  onConfirm,
  onCancel,
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  cancelPalette = "success",
  confirmPalette = "danger",
  children, // Added children to destructured props
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stuff-black/40">
      <div ref={modalRef} className="bg-stuff-white rounded-xl p-6 min-w-[320px] flex flex-col gap-4 border-2 border-stuff-light shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
        <div className="text-lg text-stuff-light font-extrabold mb-2">Confirmação</div>
        <div className="mb-4 text-stuff-mid">{message}</div>
          {children && <div className="flex flex-col gap-4 mb-4">{children}</div>}
        <div className="flex gap-2 justify-end">
          <Button
            palette={cancelPalette}
            size="md"
            className="px-4 py-2"
            onClick={onCancel}
          >{cancelLabel}</Button>
          <Button
            palette={confirmPalette}
            size="md"
            className="px-4 py-2"
            onClick={onConfirm}
          >{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
