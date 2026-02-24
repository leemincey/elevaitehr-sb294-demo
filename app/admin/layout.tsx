import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ElevaiteHR Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">HR</span>
          </div>
          <span className="text-gray-900 font-semibold tracking-tight">ElevaiteHR</span>
          <span className="text-gray-300 mx-2">|</span>
          <span className="text-sm text-gray-500">Admin</span>
        </div>
        <span className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}