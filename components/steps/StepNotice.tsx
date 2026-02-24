'use client';
import React, { useState } from 'react';
import { ScrollText } from 'lucide-react';
import { NoticeAccordion } from '@/components/NoticeAccordion';

export const StepNotice = ({
  onNext,
}: {
  formData?: any;
  updateFormData?: (updates: any) => void;
  onNext: () => void;
  onBack?: () => void;
  onLanguageChange?: (code: string) => void;
  selectedLanguage?: string;
}) => {
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <ScrollText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">California Workplace - Know Your Rights (SB 294)</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Please review all sections below. Click each heading to expand and read.
        </p>
      </div>

      <div className="max-h-[60vh] overflow-y-auto pr-1">
        <NoticeAccordion onComplete={() => setIsCompleted(true)} />
      </div>

      <div className="sticky bottom-0 pt-4 pb-2 bg-white z-10">
        <button
          onClick={onNext}
          disabled={!isCompleted}
          className="w-full h-12 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompleted ? "I Acknowledge & Continue" : "Please Review All Sections"}
        </button>
      </div>
    </div>
  );
};
