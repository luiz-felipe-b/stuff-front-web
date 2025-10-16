"use client";

import React from "react";
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
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stuff-black/40">
      <div className="bg-stuff-white rounded-xl p-6 min-w-[320px] flex flex-col gap-4 border-2 border-stuff-light shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
        <div className="text-lg text-stuff-light font-extrabold mb-2">Confirmação</div>
        <div className="mb-4 text-stuff-mid">{message}</div>
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
