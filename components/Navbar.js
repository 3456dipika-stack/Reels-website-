'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Don't show the navbar on the login/register pages themselves
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 p-4 bg-transparent">
      <div className="container mx-auto flex justify-end items-center">
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-gray-700">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}