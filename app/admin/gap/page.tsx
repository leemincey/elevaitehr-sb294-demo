import { Suspense } from 'react';
import GapAnalysisClient from './GapAnalysisClient';

export default function GapAnalysisPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-sm text-gray-400">Loading…</div>}>
      <GapAnalysisClient />
    </Suspense>
  );
}
