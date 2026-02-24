'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Loader2 } from 'lucide-react';
import type { ComplianceFormData } from '@/app/ComplianceWizard';

interface StepContactProps {
  formData: ComplianceFormData;
  updateFormData: (updates: Partial<ComplianceFormData>) => void;
  onSubmit: () => Promise<void>;
  onBack?: () => void;
  submitError: string | null;
}

export const StepContact = ({
  formData,
  updateFormData,
  onSubmit,
  onBack,
  submitError,
}: StepContactProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    employeeName?: string;
    contactName?: string;
    contactPhone?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Your full name is required.';
    }
    if (formData.authorizeDetention) {
      if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required.';
      if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required.';
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch {
      // Error is displayed via submitError prop from ComplianceWizard
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 bg-amber-100 rounded-full">
            <ShieldAlert className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Information</h2>
        <p className="text-gray-500 text-sm">
          Please provide your details and optional emergency contact to complete compliance.
        </p>
      </div>

      {/* ── Employee identity ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
        <h3 className="font-medium text-gray-900 pb-3 border-b border-gray-100">Your Details</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.employeeName}
            onChange={(e) => updateFormData({ employeeName: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 ${
              errors.employeeName ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g. Alex Johnson"
          />
          {errors.employeeName && (
            <p className="text-red-500 text-xs mt-1">{errors.employeeName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Email <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="email"
            value={formData.employeeEmail}
            onChange={(e) => updateFormData({ employeeEmail: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            placeholder="e.g. alex@company.com"
          />
        </div>
      </div>

      {/* ── Emergency contact ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="space-y-1 flex-1">
            <h3 className="font-medium text-gray-900">Authorize Detention Notification</h3>
            <p className="text-sm text-gray-500">
              I authorize my employer to notify this contact if I am arrested or detained at the worksite.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={formData.authorizeDetention}
              onChange={(e) => updateFormData({ authorizeDetention: e.target.checked })}
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name {formData.authorizeDetention && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => updateFormData({ contactName: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 ${
                errors.contactName ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="e.g. Jane Doe"
            />
            {errors.contactName && (
              <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number {formData.authorizeDetention && <span className="text-red-500">*</span>}
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => updateFormData({ contactPhone: e.target.value })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 ${
                  errors.contactPhone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="e.g. (555) 123-4567"
              />
              {errors.contactPhone && (
                <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.contactRelationship}
                onChange={(e) => updateFormData({ contactRelationship: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                placeholder="e.g. Spouse, Parent"
              />
            </div>
          </div>
        </div>

        {!formData.authorizeDetention && (
          <div className="bg-gray-50 p-3 rounded-md flex items-start text-xs text-gray-500">
            <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-gray-400" />
            <p>No emergency contact will be kept on file. You may update this later via HR.</p>
          </div>
        )}
      </div>

      {/* ── API error ─────────────────────────────────────────────────────── */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {submitError}
        </div>
      )}

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-75 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting…
            </>
          ) : (
            'Submit Compliance'
          )}
        </button>
      </div>
    </div>
  );
};