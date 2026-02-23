'use client';

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { PenTool, Trash2 } from 'lucide-react';

interface StepSignatureProps {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const StepSignature: React.FC<StepSignatureProps> = ({ updateFormData, onNext, onBack }) => {
  const sigPad = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClear = () => {
    sigPad.current?.clear();
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      const signatureData = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
      updateFormData({ signatureBase64: signatureData });
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <PenTool className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Sign Acknowledgement</h2>
        <p className="text-gray-500 text-sm">Sign below to confirm you have read the California Workplace - Know Your Rights Act notice.</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white p-1">
        <SignatureCanvas
          ref={sigPad}
          canvasProps={{
            className: "w-full h-64 cursor-crosshair rounded bg-slate-50"
          }}
          onEnd={() => setIsEmpty(sigPad.current?.isEmpty() ?? true)}
        />
        <div className="text-xs text-gray-400 text-center py-2 border-t border-gray-100">
          Sign above inside the box
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button onClick={handleClear} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
          <Trash2 size={16} className="inline mr-2" />Clear
        </button>
        <div className="flex gap-3">
          <button onClick={onBack} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Back</button>
          <button onClick={handleSave} disabled={isEmpty} className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};