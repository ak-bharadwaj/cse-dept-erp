"use client";
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  BarChart3, Users, UserPlus, FileText, ShieldAlert,
  Search, Shield, Check, X, Plus, Upload, BookOpen
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminPortal() {
  const ctx = useAppContext();
  const {
    activeTab, setActiveTab, user,
    students, faculties, subjects, allocations, auditLogs, documents, assessments, analytics,
    showFacultyModal, setShowFacultyModal, newFaculty, setNewFaculty, handleCreateFaculty,
    showSubjectModal, setShowSubjectModal, newSubject, setNewSubject, handleCreateSubject,
    showAssessmentModal, setShowAssessmentModal, newAssessment, setNewAssessment, handleCreateAssessment,
    showDocModal, setShowDocModal, newDoc, setNewDoc, docFile, setDocFile, handleUploadDoc,
    showNotification
  } = ctx;

  const renderSidebar = () => {
    return (
      <aside className="w-64 border-r border-slate-800 p-4 space-y-2 flex flex-col bg-slate-900/50">
        <div className="p-3 mb-6 bg-gradient-to-r from-red-500/10 to-indigo-500/10 rounded-xl border border-red-500/20">
          <p className="text-xs text-red-400 font-bold uppercase tracking-wider">Logged In As</p>
          <h4 className="text-sm font-bold text-white truncate">{user?.username}</h4>
          <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-semibold inline-block mt-1">
            Department Admin (HOD)
          </span>
        </div>

        <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <BarChart3 className="w-4 h-4" /> Dept. Overview
        </button>

        <button onClick={() => setActiveTab('students')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'students' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <Users className="w-4 h-4" /> Student Roster
        </button>

        <button onClick={() => setActiveTab('faculty')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'faculty' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <UserPlus className="w-4 h-4" /> Faculty Workloads
        </button>

        <button onClick={() => setActiveTab('documents')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'documents' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <FileText className="w-4 h-4" /> Doc Repository
        </button>

        <button onClick={() => setActiveTab('audit-logs')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'audit-logs' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <ShieldAlert className="w-4 h-4" /> Security Audit Logs
        </button>
      </aside>
    );
  };

  // Process data for analytics chart
  // Fallback mock analytics chart data if analytics.subjectAnalytics is empty
  const chartData = analytics?.subjectAnalytics && analytics.subjectAnalytics.length > 0 
    ? analytics.subjectAnalytics 
    : [
        { subjectCode: 'CS-201', averageMarks: 24.5, passPercentage: 88 },
        { subjectCode: 'CS-202', averageMarks: 21.2, passPercentage: 79 },
        { subjectCode: 'CS-203', averageMarks: 26.8, passPercentage: 94 },
        { subjectCode: 'CS-204', averageMarks: 18.9, passPercentage: 68 }
      ];

  const topperList = analytics?.toppers && analytics.toppers.length > 0
    ? analytics.toppers
    : (students ? students.slice(0, 3).map((s: any, idx: number) => ({ name: s.name, rollNumber: s.rollNumber, cgpa: (9.6 - idx * 0.3).toFixed(2) })) : []);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800">
      {renderSidebar()}
      
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* ==================== DASHBOARD OVERVIEW ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="text-teal-400 w-5 h-5" /> HOD Command Center
                </h2>
                <p className="text-xs text-slate-400">Department metrics, real-time workload audits, and academic results analytics</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowSubjectModal(true)} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded text-xs font-bold transition-all flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Subject
                </button>
                <button onClick={() => setShowAssessmentModal(true)} className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3 py-2 rounded text-xs font-bold hover:bg-teal-500/20 transition-all flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> New Assessment
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-panel p-5 space-y-2 border border-slate-800 bg-slate-900/20 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Department Student Roll</p>
                <h3 className="text-3xl font-extrabold text-teal-400">{students?.length || 0}</h3>
                <p className="text-xs text-slate-400">Onboarded learners</p>
              </div>

              <div className="glass-panel p-5 space-y-2 border border-slate-800 bg-slate-900/20 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Faculty Roster</p>
                <h3 className="text-3xl font-extrabold text-indigo-400">{faculties?.length || 0}</h3>
                <p className="text-xs text-slate-400">Instructors and professors</p>
              </div>

              <div className="glass-panel p-5 space-y-2 border border-slate-800 bg-slate-900/20 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Course Modules</p>
                <h3 className="text-3xl font-extrabold text-teal-400">{subjects?.length || 0}</h3>
                <p className="text-xs text-slate-400">Published in syllabus</p>
              </div>

              <div className="glass-panel p-5 space-y-2 border border-slate-800 bg-slate-900/20 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Audit Logs Count</p>
                <h3 className="text-3xl font-extrabold text-rose-400">{auditLogs?.length || 0}</h3>
                <p className="text-xs text-slate-400">Logged security operations</p>
              </div>
            </div>

            {/* Result Analytics Chart & Toppers List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="glass-panel p-5 border border-slate-800 bg-slate-900/20 rounded-xl space-y-4 lg:col-span-2">
                <h4 className="text-sm font-bold text-white">Subject Pass Rate Analytics (%)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="subjectCode" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                      <Bar dataKey="passPercentage" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Pass Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel p-5 border border-slate-800 bg-slate-900/20 rounded-xl space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Academic Toppers
                </h4>
                <div className="space-y-3">
                  {topperList.length === 0 ? (
                    <p className="text-slate-500 text-xs">No grades computed yet.</p>
                  ) : (
                    topperList.map((top: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <h5 className="font-bold text-white">{idx+1}. {top.name}</h5>
                          <span className="text-[10px] text-slate-400 font-mono">{top.rollNumber}</span>
                        </div>
                        <span className="text-teal-400 font-extrabold bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/20">
                          {top.cgpa} CGPA
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Modals for Create Subject */}
            {showSubjectModal && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-sm space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Add New Subject</h3>
                  <form onSubmit={handleCreateSubject} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Subject Code</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newSubject.code} onChange={e => setNewSubject({...newSubject, code: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Subject Name</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Semester Allocation</label>
                      <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newSubject.semester} onChange={e => setNewSubject({...newSubject, semester: parseInt(e.target.value)})} required />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowSubjectModal(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancel</button>
                      <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded font-bold">Add</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modals for Create Assessment */}
            {showAssessmentModal && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Configure CIA Assessment</h3>
                  <form onSubmit={handleCreateAssessment} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Assessment Name</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newAssessment.name} onChange={e => setNewAssessment({...newAssessment, name: e.target.value})} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">Max Marks</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newAssessment.maxMarks} onChange={e => setNewAssessment({...newAssessment, maxMarks: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Passing Marks</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newAssessment.passingMarks} onChange={e => setNewAssessment({...newAssessment, passingMarks: e.target.value})} required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Target Course Subject</label>
                      <select className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newAssessment.subjectId} onChange={e => setNewAssessment({...newAssessment, subjectId: e.target.value})} required>
                        <option value="">-- Choose Subject --</option>
                        {subjects?.map((sub: any) => (
                          <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowAssessmentModal(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancel</button>
                      <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded font-bold">Configure</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== STUDENT ROSTER ==================== */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="text-teal-400 w-5 h-5" /> Student Master Roster
              </h2>
              <p className="text-xs text-slate-400">View and audit all registered, pending, and approved student records</p>
            </div>

            <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="p-4">Roll Number</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Batch / Section</th>
                    <th className="p-4">Guardian Name</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {students?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No student records found.</td>
                    </tr>
                  ) : (
                    students?.map((stud: any) => (
                      <tr key={stud.id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-mono font-bold text-white">{stud.rollNumber}</td>
                        <td className="p-4 text-slate-300 font-medium">{stud.name}</td>
                        <td className="p-4 text-slate-400">Batch {stud.batch} - Sec {stud.section}</td>
                        <td className="p-4 text-slate-400">{stud.guardianName}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${stud.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {stud.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== FACULTY WORKLOADS ==================== */}
        {activeTab === 'faculty' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="text-teal-400 w-5 h-5" /> Faculty Directory & Workloads
                </h2>
                <p className="text-xs text-slate-400">Audit staff credentials and designated weekly instructional workload hours</p>
              </div>
              <button onClick={() => setShowFacultyModal(true)} className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-lg text-xs font-bold hover:bg-teal-500/20 transition-all flex items-center gap-2">
                Register Faculty
              </button>
            </div>

            <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="p-4">Faculty Name</th>
                    <th className="p-4">Employee ID</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">Experience / Qualification</th>
                    <th className="p-4">Workload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {faculties?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">No faculty records found.</td>
                    </tr>
                  ) : (
                    faculties?.map((fac: any) => (
                      <tr key={fac.id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-bold text-white">{fac.name}</td>
                        <td className="p-4 text-slate-300 font-mono">{fac.employeeId}</td>
                        <td className="p-4 text-slate-300 font-semibold text-teal-400">{fac.designation}</td>
                        <td className="p-4 text-slate-400">{fac.experience} Yrs - {fac.qualification}</td>
                        <td className="p-4 font-bold text-indigo-400">{fac.workload} Hrs/Week</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Register Faculty Modal */}
            {showFacultyModal && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Register Faculty Member</h3>
                  <form onSubmit={handleCreateFaculty} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Full Name</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newFaculty.name} onChange={e => setNewFaculty({...newFaculty, name: e.target.value})} required />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Employee ID</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newFaculty.employeeId} onChange={e => setNewFaculty({...newFaculty, employeeId: e.target.value})} required />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Official Email</label>
                      <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newFaculty.officialEmail} onChange={e => setNewFaculty({...newFaculty, officialEmail: e.target.value})} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">Qualification</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newFaculty.qualification} onChange={e => setNewFaculty({...newFaculty, qualification: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Workload (Hrs/Week)</label>
                        <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newFaculty.workload} onChange={e => setNewFaculty({...newFaculty, workload: parseInt(e.target.value)})} required />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowFacultyModal(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancel</button>
                      <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded font-bold">Register</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== DOC REPOSITORY ==================== */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="text-teal-400 w-5 h-5" /> Document Repository & Publisher
                </h2>
                <p className="text-xs text-slate-400">Publish department syllabus, circulars, and assessment templates</p>
              </div>
              <button onClick={() => setShowDocModal(true)} className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-lg text-xs font-bold hover:bg-teal-500/20 transition-all flex items-center gap-2">
                Upload New Document
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documents?.length === 0 ? (
                <p className="text-slate-500 text-xs col-span-2 text-center p-8 bg-slate-900/10 rounded-xl border border-slate-800">No documents uploaded.</p>
              ) : (
                documents?.map((doc: any) => (
                  <div key={doc.id} className="glass-panel p-5 border border-slate-800 bg-slate-900/20 rounded-xl flex items-start gap-4 animate-fadeIn">
                    <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-bold text-white truncate">{doc.title}</h4>
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold tracking-wider uppercase">{doc.category}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{doc.description}</p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] text-slate-500">Visibility: <span className="text-amber-400 font-semibold">{doc.visibility}</span></span>
                        <a href={`http://localhost:3001/uploads/${doc.filePath}`} target="_blank" rel="noreferrer" className="text-teal-400 text-xs font-bold hover:underline flex items-center gap-1">
                          View File
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Document Upload Modal */}
            {showDocModal && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Publish Department Document</h3>
                  <form onSubmit={handleUploadDoc} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Document Title</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">Category</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newDoc.category} onChange={e => setNewDoc({...newDoc, category: e.target.value})}>
                          <option value="SYLLABUS">Syllabus</option>
                          <option value="CIRCULAR">Circular / Notice</option>
                          <option value="TEMPLATE">Assessment Template</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Visibility Rules</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newDoc.visibility} onChange={e => setNewDoc({...newDoc, visibility: e.target.value})}>
                          <option value="PUBLIC">Public Website</option>
                          <option value="STUDENT">Approved Students</option>
                          <option value="FACULTY">Faculty Members</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Description</label>
                      <textarea className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 h-16" value={newDoc.description} onChange={e => setNewDoc({...newDoc, description: e.target.value})} required />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Upload Document File (PDF / Word)</label>
                      <input type="file" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" onChange={e => setDocFile(e.target.files ? e.target.files[0] : null)} required />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowDocModal(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancel</button>
                      <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded font-bold">Publish</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== AUDIT LOGS ==================== */}
        {activeTab === 'audit-logs' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="text-teal-400 w-5 h-5" /> Security Operation Logs
              </h2>
              <p className="text-xs text-slate-400">Verifiable immutable logs of administrative updates, registrations, and csv modifications</p>
            </div>

            <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Operation Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {auditLogs?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">No system operations logged yet.</td>
                    </tr>
                  ) : (
                    auditLogs?.map((log: any) => (
                      <tr key={log.id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 text-slate-400 font-mono">{log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}</td>
                        <td className="p-4 text-slate-300 font-bold">{log.user?.username || "SYSTEM"}</td>
                        <td className="p-4 font-semibold text-teal-400">{log.action}</td>
                        <td className="p-4 text-slate-400 leading-relaxed max-w-sm truncate" title={log.details}>{log.details}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
