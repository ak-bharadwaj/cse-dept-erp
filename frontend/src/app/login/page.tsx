"use client";
import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { 
    loginUsername, setLoginUsername, 
    loginPassword, setLoginPassword, 
    errorMsg, handleLogin, token, loading 
  } = useAppContext();
  const router = useRouter();

  // Redirect reactive to token state
  useEffect(() => {
    if (token) {
      router.push('/portal');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <form onSubmit={handleLogin} className="glass-panel p-8 w-full max-w-md space-y-6 border border-slate-800 rounded-xl bg-slate-900/40">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white">ERP Portal Access</h3>
          <p className="text-xs text-slate-400">Computer Science & Engineering Department</p>
        </div>

        {errorMsg && (
          <div className="text-rose-400 bg-rose-500/10 border border-rose-500/20 text-xs p-3 rounded-lg text-center font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Username / ID</label>
            <input 
              type="text" 
              value={loginUsername} 
              onChange={(e) => setLoginUsername(e.target.value)} 
              placeholder="e.g. admin or faculty@cse.edu" 
              className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-xs text-white focus:border-teal-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Security Password</label>
            <input 
              type="password" 
              value={loginPassword} 
              onChange={(e) => setLoginPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-xs text-white focus:border-teal-500 transition-colors"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 p-3 font-bold text-xs rounded-lg flex justify-center items-center gap-2 transition-all cursor-pointer"
        >
          {loading ? (
            <span>Logging in...</span>
          ) : (
            <>
              <LogIn className="w-4 h-4" /> Login to Account
            </>
          )}
        </button>
      </form>
    </div>
  );
}
