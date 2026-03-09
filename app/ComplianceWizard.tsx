'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { StepEmployeeInfo } from '@/components/steps/StepEmployeeInfo';
import { StepNotice } from '@/components/steps/StepNotice';
import { StepSignature } from '@/components/steps/StepSignature';
import { StepContact } from '@/components/steps/StepContact';
import { StepSuccess } from '@/components/steps/StepSuccess';
import { motion, AnimatePresence } from 'framer-motion';

interface ComplianceFormData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  signatureBase64: string | null;
  contactName: string;
  contactPhone: string;
  contactRelationship: string;
  authorizeDetention: boolean;
  selectedLanguage: string;
  prospectId: string;
}

type WizardStep = 1 | 2 | 3 | 4 | 5;

const INITIAL_DATA: ComplianceFormData = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  signatureBase64: null,
  contactName: '',
  contactPhone: '',
  contactRelationship: '',
  authorizeDetention: false,
  selectedLanguage: 'en',
  prospectId: '',
};

export default function ComplianceWizard() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<ComplianceFormData>(INITIAL_DATA);

  // Capture prospect ID from URL ?prospect=abc123
  useEffect(() => {
    const prospect = searchParams.get('prospect') ?? '';
    if (prospect) {
      setFormData(prev => ({ ...prev, prospectId: prospect }));
    }
  }, [searchParams]);

  const updateFormData = (updates: Partial<ComplianceFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5) as WizardStep);
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1) as WizardStep);

  const progress = ((currentStep - 1) / 4) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-100">

      {/* Header */}
      <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Hard hat icon in brand orange */}
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow">
            <span className="text-white font-bold text-sm">SPB</span>
          </div>
          <div>
            <div className="text-gray-900 font-bold tracking-tight leading-tight">Sierra Pacific Builders</div>
            <div className="text-xs text-gray-500">Employee Compliance Portal</div>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Step {currentStep} of 5
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">

        {/* Progress Bar — brand orange */}
        <div className="h-1.5 bg-gray-100 w-full">
          <motion.div
            className="h-full bg-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <StepEmployeeInfo formData={formData} updateFormData={updateFormData} onNext={nextStep} />
              )}
              {currentStep === 2 && (
                <StepNotice formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />
              )}
              {currentStep === 3 && (
                <StepSignature formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />
              )}
              {currentStep === 4 && (
                <StepContact formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />
              )}
              {currentStep === 5 && (
                <StepSuccess formData={formData} updateFormData={updateFormData} onNext={() => {}} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Sierra Pacific Builders &mdash; Powered by <span className="font-medium text-orange-500">ElevaiteHR</span>
      </div>
    </div>
  );
}
