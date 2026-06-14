import Sidebar from '@/components/layout/Sidebar';
import Navigation from '@/components/layout/Navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
      <Navigation />
    </div>
  );
}
