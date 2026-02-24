'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const StepContact = ({ formData, updateFormData, onSubmit, onBack, submitError }: {
  formData: any;
  updateFormData: (updates: any) => void;
  onSubmit: () => Promise<void>;
  onBack?: () => void;
  submitError: string | null;
  onBack?: () => void;
}) => {
  const [errors, setErrors] = useState<{name?: string; phone?: string}>({});
  const [submitting, setSubmitting] = useState(false);

  const handleNext = async () => {
    const newErrors: {name?: string; phone?: string} = {};
    if (formData.authorizeDetention) {
      if (!formData.contactName.trim()) newErrors.name = "Contact name is required.";
      if (!formData.contactPhone.trim()) newErrors.phone = "Phone number is required.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      await fetch('/api/records/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          department: formData.department,
          signatureBase64: formData.signatureBase64,
          contactName: formData.contactName,
          contactPhone: formData.contactPhone,
          contactRelationship: formData.contactRelationship,
          authorizeDetention: formData.authorizeDetention,
          languagePreference: formData.selectedLanguage ?? 'en',
        }),
      });
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
      await onSubmit();
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
        <h2 className="text-2xl font-bold text-gray-900">Emergency Designation</h2>
        <p className="text-gray-500 text-sm">
          The California Workplace - Know Your Rights Act requires us to offer you the option to designate an emergency contact.
        </p>
      </div>

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
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
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
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-600 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="e.g. Jane Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-600 ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="e.g. (555) 123-4567"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.contactRelationship}
                onChange={(e) => updateFormData({ contactRelationship: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-600"
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

      <div className="flex items-center justify-end gap-3 pt-4">
        <button onClick={onBack} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Back</button>
        <button
          onClick={handleNext}
          disabled={submitting}
          className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Compliance'}
        </button>
      </div>
    </div>
  );
};
