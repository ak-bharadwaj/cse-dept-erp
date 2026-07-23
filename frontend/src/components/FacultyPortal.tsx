"use client";
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  BarChart3, CheckSquare, Plus, Award, FileText, 
  User, Check, X, Shield, BookOpen, Layers, Calendar
} from 'lucide-react';

export default function FacultyPortal() {
  const ctx = useAppContext();
  const {
    activeTab, setActiveTab, user,
    faculties, subjects, allocations, students, assessments, researches, documents,
    attendanceSubjectId, setAttendanceSubjectId, attendanceDate, setAttendanceDate,
    attendanceRecords, setAttendanceRecords, handleSaveAttendance,
    ciaAssessmentId, setCiaAssessmentId, ciaMarksRecords, setCiaMarksRecords, handleRecordCiaMarks,
    showResearchModal, setShowResearchModal, newResearch, setNewResearch,
    loggedFaculty, showNotification, makeRequest, fetchData
  } = ctx;

  const currentFaculty = loggedFaculty || (faculties && user ? faculties.find((f: any) => f.officialEmail === user.username) : null);

  // Filter allocations belonging to this faculty
  const facultyAllocations = allocations ? allocations.filter((a: any) => a.facultyId === currentFaculty?.id) : [];

  // Filter students based on current selected allocation's section
  const selectedAllocation = facultyAllocations.find((a: any) => String(a.subjectId) === String(attendanceSubjectId));
  const sectionStudents = selectedAllocation && students ? students.filter((s: any) => s.section === selectedAllocation.section && s.status === 'APPROVED') : [];

  // Filter assessments for selected subject
  const selectedSubjectId = selectedAllocation?.subjectId;
  const filteredAssessments = assessments ? assessments.filter((a: any) => String(a.subjectId) === String(selectedSubjectId)) : [];

  // Local state for research paper create (using context handler fallback)
  const handleCreateResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFaculty?.id) return;
    try {
      await makeRequest('research', {
        method: 'POST',
        body: JSON.stringify({ ...newResearch, facultyId: currentFaculty.id })
      });
      fetchData();
      setShowResearchModal(false);
      showNotification('Research publication logged successfully');
    } catch {
      showNotification('Failed to submit publication details', false);
    }
  };

  const renderSidebar = () => {
    return (
      <aside className="w-64 border-r border-slate-800 p-4 space-y-2 flex flex-col bg-slate-900/50">
        <div className="p-3 mb-6 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 rounded-xl border border-teal-500/20">
          <p className="text-xs text-teal-400 font-bold uppercase tracking-wider">Logged In As</p>
          <h4 className="text-sm font-bold text-white truncate">{currentFaculty?.name || user?.username}</h4>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold inline-block mt-1">
            Faculty ({currentFaculty?.employeeId || "FACULTY"})
          </span>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Workload: <span className="text-teal-400 font-semibold">{currentFaculty?.workload || 0} hrs/week</span></p>
        </div>

        <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <BarChart3 className="w-4 h-4" /> Faculty Dashboard
        </button>

        <button onClick={() => setActiveTab('attendance')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'attendance' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <CheckSquare className="w-4 h-4" /> Log Attendance
        </button>

        <button onClick={() => setActiveTab('marks')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'marks' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <BookOpen className="w-4 h-4" /> CIA Marks Entry
        </button>

        <button onClick={() => setActiveTab('research')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'research' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <Award className="w-4 h-4" /> Research Work
        </button>
      </aside>
    );
  };

  const myResearches = researches ? researches.filter((r: any) => r.facultyId === currentFaculty?.id) : [];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800">
      {renderSidebar()}
      
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* ==================== DASHBOARD TAB ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="text-teal-400 w-5 h-5" /> Faculty Dashboard
              </h2>
              <p className="text-xs text-slate-400">Manage teaching assignments and log department details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-5 space-y-2 border border-slate-800 bg-slate-900/20 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Allocated Teaching Subjects</p>
                <h3 className="text-3xl font-extrabold text-teal-400">{facultyAllocations.length}</h3>
                <p className="text-xs text-slate-400">Class lectures and laboratory sessions mapped</p>
              </div>

              <div className="glass-panel p-5 space-y-2 border border-slate-800 bg-slate-900/20 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Publications logged</p>
                <h3 className="text-3xl font-extrabold text-indigo-400">{myResearches.length}</h3>
                <p className="text-xs text-slate-400">Journals, books, and conference papers</p>
              </div>

              <div className="glass-panel p-5 space-y-2 border border-slate-800 bg-slate-900/20 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Assigned Section Students</p>
                <h3 className="text-3xl font-extrabold text-teal-400">
                  {allocations && students ? students.filter((s: any) => facultyAllocations.some((a: any) => a.section === s.section) && s.status === 'APPROVED').length : 0}
                </h3>
                <p className="text-xs text-slate-400">Total active students under your mentorship</p>
              </div>
            </div>

            <div className="glass-panel p-6 border border-slate-800 bg-slate-900/20 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Allocated Subjects List</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {facultyAllocations.length === 0 ? (
                  <p className="text-slate-500">No teaching allocations recorded.</p>
                ) : (
                  facultyAllocations.map((alloc: any) => (
                    <div key={alloc.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white">{alloc.subject?.name} ({alloc.subject?.code})</h4>
                        <span className="text-[10px] text-slate-400">Semester {alloc.subject?.semester}</span>
                      </div>
                      <span className="text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">Section {alloc.section}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== ATTENDANCE ENTRY TAB ==================== */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckSquare className="text-teal-400 w-5 h-5" /> Log Class Attendance
              </h2>
              <p className="text-xs text-slate-400">Mark student presence for your allocated subject lectures</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/30 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Select Subject Allocation</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" value={attendanceSubjectId} onChange={e => { setAttendanceSubjectId(e.target.value); setAttendanceRecords({}); }}>
                  <option value="">-- Choose allocation --</option>
                  {facultyAllocations.map((alloc: any) => (
                    <option key={alloc.id} value={alloc.subjectId}>
                      {alloc.subject?.name} - Section {alloc.section}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Class Lecture Date</label>
                <input type="date" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} />
              </div>
            </div>

            {attendanceSubjectId && (
              <div className="space-y-4">
                <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-semibold">
                        <th className="p-4">Roll Number</th>
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Allocation</th>
                        <th className="p-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {sectionStudents.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500">No active students found in this allocated section.</td>
                        </tr>
                      ) : (
                        sectionStudents.map((stud: any) => {
                          const currentStatus = attendanceRecords[stud.id] || 'PRESENT';
                          return (
                            <tr key={stud.id} className="hover:bg-white/2 transition-colors">
                              <td className="p-4 font-mono font-bold text-white">{stud.rollNumber}</td>
                              <td className="p-4 text-slate-300 font-medium">{stud.name}</td>
                              <td className="p-4 text-slate-400">Section {stud.section}</td>
                              <td className="p-4">
                                <div className="flex justify-center gap-4">
                                  <button type="button" onClick={() => setAttendanceRecords({...attendanceRecords, [stud.id]: 'PRESENT'})} className={`px-4 py-1.5 rounded text-[10px] font-bold transition-all ${currentStatus === 'PRESENT' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                                    PRESENT
                                  </button>
                                  <button type="button" onClick={() => setAttendanceRecords({...attendanceRecords, [stud.id]: 'ABSENT'})} className={`px-4 py-1.5 rounded text-[10px] font-bold transition-all ${currentStatus === 'ABSENT' ? 'bg-rose-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                                    ABSENT
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {sectionStudents.length > 0 && (
                  <div className="flex justify-end">
                    <button onClick={handleSaveAttendance} className="bg-teal-500 text-slate-950 px-6 py-2.5 rounded text-xs font-bold hover:bg-teal-400 transition-colors">
                      Save Attendance Sheet
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== MARKS ENTRY TAB ==================== */}
        {activeTab === 'marks' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="text-teal-400 w-5 h-5" /> CIA Marks Logger
              </h2>
              <p className="text-xs text-slate-400">Enter Continuous Internal Assessment marks for your classes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/30 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Select Teaching Subject</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" value={attendanceSubjectId} onChange={e => { setAttendanceSubjectId(e.target.value); setCiaAssessmentId(''); setCiaMarksRecords({}); }}>
                  <option value="">-- Choose allocation --</option>
                  {facultyAllocations.map((alloc: any) => (
                    <option key={alloc.id} value={alloc.subjectId}>
                      {alloc.subject?.name} - Section {alloc.section}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Select Configured Assessment</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" value={ciaAssessmentId} onChange={e => { setCiaAssessmentId(e.target.value); setCiaMarksRecords({}); }} disabled={!attendanceSubjectId}>
                  <option value="">-- Choose Assessment --</option>
                  {filteredAssessments.map((ass: any) => (
                    <option key={ass.id} value={ass.id}>
                      {ass.name} (Max: {ass.maxMarks} marks)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {ciaAssessmentId && (
              <div className="space-y-4">
                <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-semibold">
                        <th className="p-4">Roll Number</th>
                        <th className="p-4">Student Name</th>
                        <th className="p-4 text-center">Marks Obtained</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {sectionStudents.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-8 text-center text-slate-500">No active students in this allocated section.</td>
                        </tr>
                      ) : (
                        sectionStudents.map((stud: any) => (
                          <tr key={stud.id} className="hover:bg-white/2 transition-colors">
                            <td className="p-4 font-mono font-bold text-white">{stud.rollNumber}</td>
                            <td className="p-4 text-slate-300 font-medium">{stud.name}</td>
                            <td className="p-4 flex justify-center">
                              <input type="number" step="0.5" className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-center text-xs text-teal-400 font-bold w-24" placeholder="0" value={ciaMarksRecords[stud.id] || ''} onChange={e => setCiaMarksRecords({...ciaMarksRecords, [stud.id]: e.target.value})} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {sectionStudents.length > 0 && (
                  <div className="flex justify-end">
                    <button onClick={handleRecordCiaMarks} className="bg-teal-500 text-slate-950 px-6 py-2.5 rounded text-xs font-bold hover:bg-teal-400 transition-colors">
                      Submit Assessment Marks
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== RESEARCH TAB ==================== */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="text-teal-400 w-5 h-5" /> Research & Academic Work
                </h2>
                <p className="text-xs text-slate-400">Log journals, conference articles, and intellectual property</p>
              </div>
              <button onClick={() => setShowResearchModal(true)} className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-lg text-xs font-bold hover:bg-teal-500/20 transition-all flex items-center gap-2">
                Log Publication
              </button>
            </div>

            <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="p-4">Title</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Details / Citations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {myResearches.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-500">No publications logged.</td>
                    </tr>
                  ) : (
                    myResearches.map((res: any) => (
                      <tr key={res.id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-bold text-white">{res.title}</td>
                        <td className="p-4 text-slate-300 font-bold text-teal-400">{res.type}</td>
                        <td className="p-4 text-slate-400">{res.details}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {showResearchModal && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-xl space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Log New Publication</h3>
                  <form onSubmit={handleCreateResearchSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Publication Type</label>
                      <select className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newResearch.type} onChange={e => setNewResearch({...newResearch, type: e.target.value})}>
                        <option value="PUBLICATION">Journal Article</option>
                        <option value="CONFERENCE_PAPER">Conference Proceedings</option>
                        <option value="PATENT">Intellectual Property / Patent</option>
                        <option value="BOOK_CHAPTER">Book Chapter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Title</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newResearch.title} onChange={e => setNewResearch({...newResearch, title: e.target.value})} required />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Citations & Details</label>
                      <textarea className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 h-20" value={newResearch.details} onChange={e => setNewResearch({...newResearch, details: e.target.value})} placeholder="e.g. Published in IEEE Transactions, Vol. 12, 2026." required />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowResearchModal(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancel</button>
                      <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded font-bold">Log Paper</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
