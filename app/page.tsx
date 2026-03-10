import { Suspense } from 'react';
import ComplianceWizard from './ComplianceWizard';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-100 text-gray-400 text-sm">Loading...</div>}>
      <ComplianceWizard />
    </Suspense>
  );
}