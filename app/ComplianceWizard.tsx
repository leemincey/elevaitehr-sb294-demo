'use client';

import React, { useState } from 'react';
import { StepNotice } from '@/components/steps/StepNotice';
import { StepSignature } from '@/components/steps/StepSignature';
import { StepContact } from '@/components/steps/StepContact';
import { StepSuccess } from '@/components/steps/StepSuccess';
import { motion, AnimatePresence } from 'framer-motion';

export interface ComplianceFormData {
  // Employee identity — collected in StepContact
  employeeName: string;
  employeeEmail: string;
  // Signature — collected in StepSignature
  signatureBase64: string | null;
  // Emergency contact — collected in StepContact
  contactName: string;
  contactPhone: string;
  contactRelationship: string;
  authorizeDetention: boolean;
}

type WizardStep = 1 | 2 | 3 | 4;

const INITIAL_DATA: ComplianceFormData = {
  employeeName: '',
  employeeEmail: '',
  signatureBase64: null,
  contactName: '',
  contactPhone: '',
  contactRelationship: '',
  authorizeDetention: false,
};

export default function ComplianceWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<ComplianceFormData>(INITIAL_DATA);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateFormData = (updates: Partial<ComplianceFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () =>
    setCurrentStep(prev => Math.min(prev + 1, 4) as WizardStep);

  const prevStep = () =>
    setCurrentStep(prev => Math.max(prev - 1, 1) as WizardStep);

  // ── Final submit — called by StepContact on "Submit Compliance" ─────────────
  const handleFinalSubmit = async (): Promise<void> => {
    setSubmitError(null);

    const res = await fetch('/api/records/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeName: formData.employeeName,
        employeeEmail: formData.employeeEmail,
        signatureBase64: formData.signatureBase64,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactRelationship: formData.contactRelationship,
        authorizeDetention: formData.authorizeDetention,
        language: 'en',
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setSubmitError(json.error ?? 'Something went wrong. Please try again.');
      throw new Error(json.error); // StepContact catches this to stop its loader
    }

    // Success → advance to StepSuccess
    nextStep();
  };

  const progress = ((currentStep - 1) / 3) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">

      {/* Header */}
      <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">HR</span>
          </div>
          <span className="text-gray-900 font-semibold tracking-tight">ElevaiteHR</span>
        </div>
        <div className="text-sm text-gray-500">Step {currentStep} of 4</div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">

        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-100 w-full">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
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
                <StepNotice
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextStep}
                />
              )}
              {currentStep === 2 && (
                <StepSignature
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {currentStep === 3 && (
                <StepContact
                  formData={formData}
                  updateFormData={updateFormData}
                  onSubmit={handleFinalSubmit}
                  onBack={prevStep}
                  submitError={submitError}
                />
              )}
              {currentStep === 4 && (
                <StepSuccess formData={formData} updateFormData={updateFormData} onNext={() => {}} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} ElevaiteHR. Secure &amp; Compliance Ready.
      </div>
    </div>
  );
}