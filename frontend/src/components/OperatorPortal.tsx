"use client";
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  BarChart3, UserCheck, Plus, Briefcase, FileSpreadsheet,
  Users, User, Key, Check, X, ShieldAlert, ArrowUpRight
} from 'lucide-react';

export default function OperatorPortal() {
  const ctx = useAppContext();
  const {
    activeTab, setActiveTab, user,
    students, placements, placementOffers,
    showStudentModal, setShowStudentModal, newStudent, setNewStudent, handleRegisterStudent,
    handleVerifyProfile,
    showPlacementOfferModal, setShowPlacementOfferModal, newPlacementOffer, setNewPlacementOffer, handleCreatePlacementOffer,
    csvAllocations, setCsvAllocations, handleImportAllocations,
    csvMarks, setCsvMarks, handleImportMarks, showNotification
  } = ctx;

  const pendingVerification = students ? students.filter((s: any) => s.status === 'UNDER_VERIFICATION' || s.status === 'PENDING_PROFILE') : [];

  const renderSidebar = () => {
    return (
      <aside className="w-64 border-r border-slate-800 p-4 space-y-2 flex flex-col bg-slate-900/50">
        <div className="p-3 mb-6 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 rounded-xl border border-teal-500/20">
          <p className="text-xs text-teal-400 font-bold uppercase tracking-wider">Logged In As</p>
          <h4 className="text-sm font-bold text-white truncate">{user?.username}</h4>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold inline-block mt-1">
            Data Entry Operator
          </span>
        </div>

        <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <BarChart3 className="w-4 h-4" /> Operator Dashboard
        </button>

        <button onClick={() => setActiveTab('students')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'students' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <UserCheck className="w-4 h-4" /> Verify Students ({pendingVerification.length})
        </button>

        <button onClick={() => setActiveTab('placements')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'placements' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <Briefcase className="w-4 h-4" /> Placements Offers
        </button>

        <button onClick={() => setActiveTab('csv-imports')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'csv-imports' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <FileSpreadsheet className="w-4 h-4" /> Batch CSV Imports
        </button>
      </aside>
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800">
      {renderSidebar()}
      
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* ==================== DASHBOARD TAB ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="text-teal-400 w-5 h-5" /> Data Operator Control Room
              </h2>
              <p className="text-xs text-slate-400">Perform student onboarding, verify uploads, and log marks data</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-5 space-y-2 border border-slate-800 bg-slate-900/20 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Verification Queue</p>
                <h3 className="text-3xl font-extrabold text-amber-400">{pendingVerification.length}</h3>
                <p className="text-xs text-slate-400">Pending student registration records</p>
              </div>

              <div className="glass-panel p-5 space-y-2 border border-slate-800 bg-slate-900/20 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Registered Students</p>
                <h3 className="text-3xl font-extrabold text-teal-400">{students?.length || 0}</h3>
                <p className="text-xs text-slate-400">Approved and onboarded learners</p>
              </div>

              <div className="glass-panel p-5 space-y-2 border border-slate-800 bg-slate-900/20 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Registered Drives</p>
                <h3 className="text-3xl font-extrabold text-indigo-400">{placements?.length || 0}</h3>
                <p className="text-xs text-slate-400">Eligible placement drives on records</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STUDENTS VERIFICATION QUEUE ==================== */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserCheck className="text-teal-400 w-5 h-5" /> Onboarding Verification Queue
                </h2>
                <p className="text-xs text-slate-400">Review student profile details and approve academic status</p>
              </div>
              <button onClick={() => setShowStudentModal(true)} className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-lg text-xs font-bold hover:bg-teal-500/20 transition-all flex items-center gap-2">
                Register Student
              </button>
            </div>

            <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="p-4">Roll Number</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Batch / Section</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {pendingVerification.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">No student profiles pending verification.</td>
                    </tr>
                  ) : (
                    pendingVerification.map((stud: any) => (
                      <tr key={stud.id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-mono font-bold text-white">{stud.rollNumber}</td>
                        <td className="p-4 text-slate-300 font-medium">{stud.name}</td>
                        <td className="p-4 text-slate-400">Batch {stud.batch} - Sec {stud.section}</td>
                        <td className="p-4 text-slate-400">{stud.personalEmail || "N/A"}</td>
                        <td className="p-4 text-slate-400">{stud.mobileNumber || "N/A"}</td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleVerifyProfile(stud.id, 'APPROVE')} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded text-[10px] font-bold hover:bg-emerald-500/20 transition-colors flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button onClick={() => handleVerifyProfile(stud.id, 'REJECT')} className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded text-[10px] font-bold hover:bg-rose-500/20 transition-colors flex items-center gap-1">
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Register Student Modal */}
            {showStudentModal && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Onboard New Student</h3>
                  <form onSubmit={handleRegisterStudent} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Full Name</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} required />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Roll Number</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newStudent.rollNumber} onChange={e => setNewStudent({...newStudent, rollNumber: e.target.value})} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">Batch Year</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newStudent.batch} onChange={e => setNewStudent({...newStudent, batch: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Section</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newStudent.section} onChange={e => setNewStudent({...newStudent, section: e.target.value})} required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Guardian Name</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newStudent.guardianName} onChange={e => setNewStudent({...newStudent, guardianName: e.target.value})} required />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowStudentModal(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancel</button>
                      <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded font-bold">Onboard</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== PLACEMENTS OFFERS TAB ==================== */}
        {activeTab === 'placements' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="text-teal-400 w-5 h-5" /> Placement Records
                </h2>
                <p className="text-xs text-slate-400">Log campus selections and packages for students</p>
              </div>
              <button onClick={() => setShowPlacementOfferModal(true)} className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-lg text-xs font-bold hover:bg-teal-500/20 transition-all flex items-center gap-2">
                Record Placement Offer
              </button>
            </div>

            <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="p-4">Roll Number</th>
                    <th className="p-4">Student</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Package</th>
                    <th className="p-4">Finalized Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {placementOffers?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">No placement offers recorded.</td>
                    </tr>
                  ) : (
                    placementOffers?.map((off: any) => (
                      <tr key={off.id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-mono font-bold text-white">{off.student?.rollNumber || "N/A"}</td>
                        <td className="p-4 text-slate-300 font-medium">{off.student?.name || "N/A"}</td>
                        <td className="p-4 text-slate-300">{off.companyName}</td>
                        <td className="p-4 text-slate-400">{off.jobRole}</td>
                        <td className="p-4 text-indigo-400 font-bold">{off.packageLpa} LPA</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${off.isFinal ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                            {off.isFinal ? 'FINAL OFFER' : 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Record Placement Offer Modal */}
            {showPlacementOfferModal && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Record Selection Offer</h3>
                  <form onSubmit={handleCreatePlacementOffer} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Select Student</label>
                      <select className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newPlacementOffer.studentId} onChange={e => setNewPlacementOffer({...newPlacementOffer, studentId: e.target.value})} required>
                        <option value="">-- Choose student --</option>
                        {students?.filter((s: any) => s.status === 'APPROVED').map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Company Name</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newPlacementOffer.companyName} onChange={e => setNewPlacementOffer({...newPlacementOffer, companyName: e.target.value})} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">Job Role</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newPlacementOffer.jobRole} onChange={e => setNewPlacementOffer({...newPlacementOffer, jobRole: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Package (LPA)</label>
                        <input type="number" step="0.1" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newPlacementOffer.packageLpa} onChange={e => setNewPlacementOffer({...newPlacementOffer, packageLpa: e.target.value})} required />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isFinal" checked={newPlacementOffer.isFinal} onChange={e => setNewPlacementOffer({...newPlacementOffer, isFinal: e.target.checked})} />
                      <label htmlFor="isFinal" className="text-slate-300 select-none">Mark as final accepted offer</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowPlacementOfferModal(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancel</button>
                      <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded font-bold">Record</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== BATCH CSV IMPORTS TAB ==================== */}
        {activeTab === 'csv-imports' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="text-teal-400 w-5 h-5" /> Batch CSV Textarea Imports
              </h2>
              <p className="text-xs text-slate-400">Import records by pasting comma-separated values directly below</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teaching Allocations */}
              <div className="glass-panel p-5 border border-slate-800 bg-slate-900/20 rounded-xl space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Import Faculty Allocations</h4>
                  <span className="text-[10px] text-slate-400">Format: FacultyName,SubjectCode,Section (e.g. Dr. Raman,CS-201,A)</span>
                </div>
                <textarea className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs font-mono h-40" placeholder="Dr. Raman,CS-201,A&#10;Prof. Anjali,CS-202,B" value={csvAllocations} onChange={e => setCsvAllocations(e.target.value)} />
                <button onClick={handleImportAllocations} className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-2 rounded text-xs font-bold transition-all">
                  Process Allocations
                </button>
              </div>

              {/* Marks */}
              <div className="glass-panel p-5 border border-slate-800 bg-slate-900/20 rounded-xl space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Import Student Academic Marks</h4>
                  <span className="text-[10px] text-slate-400">Format: StudentRoll,SubjectCode,Type,Obtained,Max (e.g. CSE-001,CS-201,INTERNAL,25,30)</span>
                </div>
                <textarea className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs font-mono h-40" placeholder="CSE-001,CS-201,INTERNAL,25,30&#10;CSE-002,CS-201,INTERNAL,28,30" value={csvMarks} onChange={e => setCsvMarks(e.target.value)} />
                <button onClick={handleImportMarks} className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-2 rounded text-xs font-bold transition-all">
                  Process Marks Dataset
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
