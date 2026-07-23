
"use client";
import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import StudentPortal from '../../components/StudentPortal';
import FacultyPortal from '../../components/FacultyPortal';
import OperatorPortal from '../../components/OperatorPortal';
import AdminPortal from '../../components/AdminPortal';
import { LogOut } from 'lucide-react';

export default function PortalWrapper() {
  const { user, handleLogout } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    // If no user, redirect to login
    // For demo purposes, we will assume user is set if logged in.
  }, [user]);

  if (!user) {
    return <div className="text-white p-10">Loading Portal...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="glass-panel p-4 flex justify-between">
        <h1 className="font-bold">Portal</h1>
        <button onClick={() => { handleLogout(); router.push('/'); }} className="text-rose-400 flex gap-2">
          <LogOut /> Logout
        </button>
      </header>
      <div className="flex-1 p-4">
        {user.role === 'STUDENT' && <StudentPortal />}
        {user.role === 'FACULTY' && <FacultyPortal />}
        {user.role === 'DATA_ENTRY' && <OperatorPortal />}
        {['SUPER_ADMIN', 'HOD'].includes(user.role) && <AdminPortal />}
      </div>
    </div>
  );
}
