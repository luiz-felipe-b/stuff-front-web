import React from "react";
import Button from "../Button/Button";

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
    <p className="font-extrabold text-stuff-light">confirme os dados do novo ativo</p>
    <div className="flex flex-col border-2 border-b-4 border-stuff-light rounded-2xl p-4 bg-stuff-white">
      <div className="flex flex-col md:flex-row md:gap-8 gap-2">
        <div>
          <div className="font-semibold text-stuff-light">nome</div>
          <div className="text-stuff-light text-base">{newAsset.name}</div>
        </div>
        <div>
          <div className="font-semibold text-stuff-light">descrição</div>
          <div className="text-stuff-light text-base">{newAsset.description}</div>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <div className="text-stuff-light font-extrabold">atributos</div>
      <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {attributes.length === 0 ? (
          <div className="text-stuff-mid">Nenhum atributo.</div>
        ) : (
          attributes.map((attr, idx) => (
            <div key={idx} className="flex flex-col gap-2 border-2 border-b-4 border-stuff-light rounded-2xl p-4 bg-stuff-white">
              <div className="flex flex-col md:flex-row md:gap-8 gap-2">
                <div>
                  <span className="font-semibold text-stuff-light">Nome:</span> <span className="text-stuff-light">{attr.name}</span>
                </div>
                <div>
                  <span className="font-semibold text-stuff-light">Tipo:</span> <span className="text-stuff-light">{attr.type}</span>
                </div>
                <div>
                  <span className="font-semibold text-stuff-light">Valor:</span> <span className="text-stuff-light">{typeof attr.value === 'object' ? JSON.stringify(attr.value) : String(attr.value)}</span>
                </div>
                {attr.options && Array.isArray(attr.options) && attr.options.length > 0 && (
                  <div>
                    <span className="font-semibold text-stuff-white">Opções:</span> <span className="text-stuff-dark">{attr.options.join(", ")}</span>
                  </div>
                )}
              </div>
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
      >confirmar</Button>
    </div>
  </div>
);

export default AddAssetConfirmationStep;
