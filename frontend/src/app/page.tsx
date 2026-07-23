
"use client";
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useRouter } from 'next/navigation';
import { Database, ChevronRight, LogIn } from 'lucide-react';

export default function Home() {
  const { currentView, setCurrentView, token, user } = useAppContext();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="glass-panel border-b border-white/5 py-4 px-6 flex items-center justify-between sticky top-0 z-30 bg-slate-900/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-teal-500 to-indigo-500 rounded-lg text-white">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">CSE Department ERP</h1>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
              Public Portal
            </span>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <button onClick={() => router.push('/login')} className="glass-btn py-1.5 px-3 text-xs flex items-center gap-1">
            <LogIn className="w-3.5 h-3.5" /> Portal Login
          </button>
        </nav>
      </header>
      <main className="flex-1 space-y-12 pb-12">
        <section className="relative py-20 overflow-hidden border-b border-white/5 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950">
          <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Shaping the Pioneers of Digital Transformation
            </h2>
            <div className="flex justify-center gap-4 pt-4">
              <button onClick={() => router.push('/login')} className="glass-btn py-3 px-6 font-bold flex items-center gap-2">
                Access Student/Faculty ERP <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
