'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';

export const StepEmployeeInfo = ({ formData, updateFormData, onNext }: {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
}) => {
  const [errors, setErrors] = useState<{firstName?: string; lastName?: string; email?: string}>({});

  const handleNext = () => {
    const newErrors: {firstName?: string; lastName?: string; email?: string} = {};
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.email?.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Employee Information</h2>
        <p className="text-gray-500 text-sm">Please enter your information to begin the compliance process.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName ?? ''}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="e.g. Jane"
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName ?? ''}
              onChange={(e) => updateFormData({ lastName: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="e.g. Doe"
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email ?? ''}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="e.g. jane.doe@company.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.department ?? ''}
            onChange={(e) => updateFormData({ department: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            placeholder="e.g. Operations"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleNext}
          className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
