'use client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { FolderOpen, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function DashboardAsideNavbar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white h-screen ml-3">
      <h1 className="text-2xl font-bold mt-5">VolunteerConnect</h1>
      <nav className="flex flex-col mt-12">
        <Link
          href="/dashboard/projects"
          className={clsx(
            'flex gap-3 p-2',
            pathname === '/dashboard/projects' && 'bg-gray-300'
          )}
        >
          <FolderOpen /> Proyectos
        </Link>
        <a
          className="flex gap-3 p-2 cursor-pointer"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut /> Cerrar Sesión
        </a>
      </nav>
    </aside>
  );
}
