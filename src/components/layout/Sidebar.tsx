'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, Timer, User, Sprout, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

const navItems = [
  { href: '/dashboard', label: 'ホーム', icon: Home },
  { href: '/books', label: '読書', icon: BookOpen },
  { href: '/study', label: '学習', icon: Timer },
  { href: '/profile', label: 'プロフィール', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-blue-600 flex items-center gap-2">
          Growth Tracker
          <Sprout size={18} className="text-green-500" />
        </h1>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 mt-auto"
      >
        <LogOut size={18} />
        <span>ログアウト</span>
      </button>
    </aside>
  );
}
