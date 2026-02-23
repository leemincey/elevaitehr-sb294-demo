export interface ComplianceFormData {
  signatureBase64: string | null;
  contactName: string;
  contactPhone: string;
  contactRelationship: string;
  authorizeDetention: boolean;
}

export type WizardStep = 1 | 2 | 3 | 4;

export interface StepProps {
  formData: ComplianceFormData;
  updateFormData: (updates: Partial<ComplianceFormData>) => void;
  onNext: () => void;
  onBack?: () => void;
}
