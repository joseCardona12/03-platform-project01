import React from 'react';
import AuthGuard from './guard/AuthGuard';
import DashboardAsideNavbar from '@/ui/organisms/common/DashboardAsideNavbar';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className='flex'>
        <DashboardAsideNavbar />
        {children}
      </div>
    </AuthGuard>
  );
}
