const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('src/app/page.backup.tsx', 'utf8');

const componentsDir = path.join(__dirname, 'src', 'components');
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });

const contextDir = path.join(__dirname, 'src', 'context');
if (!fs.existsSync(contextDir)) fs.mkdirSync(contextDir, { recursive: true });

const loginDir = path.join(__dirname, 'src', 'app', 'login');
if (!fs.existsSync(loginDir)) fs.mkdirSync(loginDir, { recursive: true });

const portalDir = path.join(__dirname, 'src', 'app', 'portal');
if (!fs.existsSync(portalDir)) fs.mkdirSync(portalDir, { recursive: true });

function extractBalanced(str, startIndex, openChar='(', closeChar=')') {
  let count = 0;
  let inString = false;
  let stringChar = '';
  
  for (let i = startIndex; i < str.length; i++) {
    const char = str[i];
    
    if (inString) {
      if (char === stringChar && str[i-1] !== '\\') inString = false;
      continue;
    }
    
    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      stringChar = char;
      continue;
    }
    
    if (char === openChar) count++;
    else if (char === closeChar) {
      count--;
      if (count === 0) return str.slice(startIndex, i + 1);
    }
  }
  return '';
}

const importEnd = content.indexOf('interface UserType');
const componentStart = content.indexOf('export default function DepartmentERP() {');

let imports = content.slice(0, importEnd);
// Replace lucide-react imports to be universally available
const types = content.slice(importEnd, componentStart);

const stateStart = content.indexOf('  // Navigation:');
const stateEnd = content.indexOf('  return (', stateStart);
let stateLogic = content.slice(stateStart, stateEnd);

const contextCode = `
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
${types.replace('const API_URL', 'export const API_URL')}

export const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
${stateLogic}
  
  return (
    <AppContext.Provider value={{
      currentView, setCurrentView, token, setToken, user, setUser, loading, setLoading,
      errorMsg, setErrorMsg, successMsg, setSuccessMsg, loginUsername, setLoginUsername,
      loginPassword, setLoginPassword, students, setStudents, faculties, setFaculties,
      subjects, setSubjects, allocations, setAllocations, events, setEvents, placements, setPlacements,
      placementOffers, setPlacementOffers, achievements, setAchievements, researches, setResearches,
      auditLogs, setAuditLogs, documents, setDocuments, assessments, setAssessments, analytics, setAnalytics,
      activeTab, setActiveTab, attendanceSubjectId, setAttendanceSubjectId, attendanceDate, setAttendanceDate,
      attendanceRecords, setAttendanceRecords, ciaAssessmentId, setCiaAssessmentId, ciaMarksRecords, setCiaMarksRecords,
      studentSearch, setStudentSearch, showStudentModal, setShowStudentModal, newStudent, setNewStudent,
      showFacultyModal, setShowFacultyModal, newFaculty, setNewFaculty, showSubjectModal, setShowSubjectModal,
      newSubject, setNewSubject, showAssessmentModal, setShowAssessmentModal, newAssessment, setNewAssessment,
      showResearchModal, setShowResearchModal, newResearch, setNewResearch, showDocModal, setShowDocModal,
      newDoc, setNewDoc, docFile, setDocFile, showPlacementModal, setShowPlacementModal, newPlacement, setNewPlacement,
      showPlacementOfferModal, setShowPlacementOfferModal, newPlacementOffer, setNewPlacementOffer,
      showAchievementModal, setShowAchievementModal, newAchievement, setNewAchievement, achievementProof, setAchievementProof,
      profileData, setProfileData, csvAllocations, setCsvAllocations, csvMarks, setCsvMarks,
      handleLogout, fetchDashboardData, fetchMarksAnalytics, saveStudentProfile, recordAttendance,
      recordCIA, submitDocument, generatePDFReport, getMockFallback, showNotification,
      roleFaculty
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
`;
fs.writeFileSync(path.join(contextDir, 'AppContext.tsx'), contextCode);

// Layout wrap
const layoutPath = path.join(__dirname, 'src', 'app', 'layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
if (!layoutContent.includes('AppProvider')) {
  layoutContent = layoutContent.replace('export default function RootLayout', 'import { AppProvider } from "@/context/AppContext";\nexport default function RootLayout');
  layoutContent = layoutContent.replace('{children}', '<AppProvider>{children}</AppProvider>');
  fs.writeFileSync(layoutPath, layoutContent);
}

// Write the files by directly injecting useAppContext()
const createComponent = (name, blockIdentifier) => {
  const startIdx = content.indexOf(blockIdentifier);
  if (startIdx === -1) return;
  const braceStart = content.indexOf('(', startIdx);
  const block = extractBalanced(content, braceStart, '(', ')');
  
  const compCode = `
"use client";
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Users, Award, GraduationCap, Briefcase, FileText, 
  Search, ShieldAlert, LogOut, CheckCircle, Plus, Upload, 
  Database, BarChart3, BookOpen, Layers, UserCheck, 
  Check, X, LogIn, ChevronRight, Download, FileSpreadsheet,
  Clock, Shield, User, FileCode, CheckSquare, Sparkles,
  Calendar, File, AlertCircle, Eye, Globe
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ${name}() {
  const ctx = useAppContext();
  const {
    currentView, setCurrentView, token, setToken, user, setUser, loading, setLoading,
    errorMsg, setErrorMsg, successMsg, setSuccessMsg, loginUsername, setLoginUsername,
    loginPassword, setLoginPassword, students, setStudents, faculties, setFaculties,
    subjects, setSubjects, allocations, setAllocations, events, setEvents, placements, setPlacements,
    placementOffers, setPlacementOffers, achievements, setAchievements, researches, setResearches,
    auditLogs, setAuditLogs, documents, setDocuments, assessments, setAssessments, analytics, setAnalytics,
    activeTab, setActiveTab, attendanceSubjectId, setAttendanceSubjectId, attendanceDate, setAttendanceDate,
    attendanceRecords, setAttendanceRecords, ciaAssessmentId, setCiaAssessmentId, ciaMarksRecords, setCiaMarksRecords,
    studentSearch, setStudentSearch, showStudentModal, setShowStudentModal, newStudent, setNewStudent,
    showFacultyModal, setShowFacultyModal, newFaculty, setNewFaculty, showSubjectModal, setShowSubjectModal,
    newSubject, setNewSubject, showAssessmentModal, setShowAssessmentModal, newAssessment, setNewAssessment,
    showResearchModal, setShowResearchModal, newResearch, setNewResearch, showDocModal, setShowDocModal,
    newDoc, setNewDoc, docFile, setDocFile, showPlacementModal, setShowPlacementModal, newPlacement, setNewPlacement,
    showPlacementOfferModal, setShowPlacementOfferModal, newPlacementOffer, setNewPlacementOffer,
    showAchievementModal, setShowAchievementModal, newAchievement, setNewAchievement, achievementProof, setAchievementProof,
    profileData, setProfileData, csvAllocations, setCsvAllocations, csvMarks, setCsvMarks,
    handleLogout, fetchDashboardData, fetchMarksAnalytics, saveStudentProfile, recordAttendance,
    recordCIA, submitDocument, generatePDFReport, getMockFallback, showNotification,
    roleFaculty
  } = ctx;

  return ${block};
}
`;
  fs.writeFileSync(path.join(componentsDir, `${name}.tsx`), compCode);
}

createComponent('StudentPortal', "{user.role === 'STUDENT' && (");
createComponent('FacultyPortal', "{user.role === 'FACULTY' && (");
createComponent('OperatorPortal', "{user.role === 'DATA_ENTRY' && (");
createComponent('AdminPortal', "{['SUPER_ADMIN', 'HOD'].includes(user.role || '') && (");

// Main App component (page.tsx)
const pageCode = `
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
`;
fs.writeFileSync(path.join(__dirname, 'src', 'app', 'page.tsx'), pageCode);

const loginCode = `
"use client";
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { loginUsername, setLoginUsername, loginPassword, setLoginPassword, errorMsg } = useAppContext();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified for routing demonstration
    router.push('/portal');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <form onSubmit={handleLogin} className="glass-panel p-8 w-full max-w-md space-y-6">
        <h3 className="text-2xl font-bold text-white text-center">ERP Login</h3>
        {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
        <input 
          type="text" 
          value={loginUsername} 
          onChange={(e) => setLoginUsername(e.target.value)} 
          placeholder="Username / Roll No" 
          className="glass-input w-full p-3 rounded"
        />
        <input 
          type="password" 
          value={loginPassword} 
          onChange={(e) => setLoginPassword(e.target.value)} 
          placeholder="Password" 
          className="glass-input w-full p-3 rounded"
        />
        <button type="submit" className="glass-btn w-full p-3 font-bold text-teal-400 flex justify-center gap-2">
          <LogIn /> Login
        </button>
      </form>
    </div>
  );
}
`;
fs.writeFileSync(path.join(loginDir, 'page.tsx'), loginCode);

const portalCode = `
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
`;
fs.writeFileSync(path.join(portalDir, 'page.tsx'), portalCode);

console.log("Frontend refactored!");
