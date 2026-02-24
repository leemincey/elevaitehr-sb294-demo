import { Suspense } from 'react';
import RecordsClient from './RecordsClient';

export default function RecordsPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-sm text-gray-400">Loading…</div>}>
      <RecordsClient />
    </Suspense>
  );
}
