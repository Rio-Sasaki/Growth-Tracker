'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Timer, User } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'ホーム', icon: Home },
  { href: '/books', label: '読書', icon: BookOpen },
  { href: '/study', label: '学習', icon: Timer },
  { href: '/profile', label: 'プロフィール', icon: User },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 text-xs ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
