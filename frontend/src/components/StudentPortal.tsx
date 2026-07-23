"use client";
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  BarChart3, Award, Briefcase, FileText, AlertCircle, 
  Upload, User, Mail, Phone, Home, Shield, MapPin, Calendar, CheckCircle
} from 'lucide-react';

export default function StudentPortal() {
  const ctx = useAppContext();
  const {
    activeTab, setActiveTab, user,
    students, placements, placementOffers, achievements, documents,
    profileData, setProfileData, handleSubmitProfile, handleCreateAchievement,
    showAchievementModal, setShowAchievementModal, newAchievement, setNewAchievement,
    achievementProof, setAchievementProof, loggedStudent, showNotification
  } = ctx;

  const currentStudent = loggedStudent || (students && user ? students.find((s: any) => s.userId === user.id) : null);

  const renderSidebar = () => {
    return (
      <aside className="w-64 border-r border-slate-800 p-4 space-y-2 flex flex-col bg-slate-900/50">
        <div className="p-3 mb-6 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 rounded-xl border border-teal-500/20">
          <p className="text-xs text-teal-400 font-bold uppercase tracking-wider">Logged In As</p>
          <h4 className="text-sm font-bold text-white truncate">{currentStudent?.name || user?.username}</h4>
          <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-semibold inline-block mt-1">
            Student ({currentStudent?.rollNumber || "PENDING"})
          </span>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Status: <span className={currentStudent?.status === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400'}>{currentStudent?.status || 'PENDING'}</span></p>
        </div>

        <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <BarChart3 className="w-4 h-4" /> My Dashboard
        </button>

        {(!currentStudent || currentStudent.status === 'PENDING_PROFILE') && (
          <button onClick={() => setActiveTab('profile-completion')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'profile-completion' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20 animate-pulse' : 'text-slate-400 hover:bg-white/5'}`}>
            <AlertCircle className="w-4 h-4" /> Profile Completion
          </button>
        )}

        <button onClick={() => setActiveTab('achievements')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'achievements' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <Award className="w-4 h-4" /> My Achievements
        </button>

        <button onClick={() => setActiveTab('placement-offers')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'placement-offers' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <Briefcase className="w-4 h-4" /> Placement Offers
        </button>

        <button onClick={() => setActiveTab('documents')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-all ${activeTab === 'documents' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
          <FileText className="w-4 h-4" /> Documents
        </button>
      </aside>
    );
  };

  const myOffers = placementOffers ? placementOffers.filter((o: any) => o.studentId === currentStudent?.id) : [];
  const myAchievements = achievements ? achievements.filter((a: any) => a.studentId === currentStudent?.id) : [];
  const publicDocs = documents ? documents.filter((d: any) => d.visibility === 'PUBLIC' || d.visibility === 'STUDENT') : [];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800">
      {renderSidebar()}
      
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* ==================== DASHBOARD TAB ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="text-teal-400 w-5 h-5" /> Student Dashboard
              </h2>
              <p className="text-xs text-slate-400">View department overview and your status</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-5 space-y-2 border border-slate-800 bg-slate-900/20 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Verification Status</p>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${currentStudent?.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <h3 className="text-lg font-bold text-white uppercase">{currentStudent?.status || 'PENDING'}</h3>
                </div>
                <p className="text-xs text-slate-400">
                  {currentStudent?.status === 'APPROVED' 
                    ? 'Your profile is verified. You have full access to placement portals.' 
                    : 'Complete your profile information on the left to request HOD verification.'}
                </p>
              </div>

              <div className="glass-panel p-5 space-y-2 border border-slate-800 bg-slate-900/20 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">My Reported Achievements</p>
                <h3 className="text-3xl font-extrabold text-teal-400">{myAchievements.length}</h3>
                <p className="text-xs text-slate-400">Internships, conferences, and certifications logged</p>
              </div>

              <div className="glass-panel p-5 space-y-2 border border-slate-800 bg-slate-900/20 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Placement Drives</p>
                <h3 className="text-3xl font-extrabold text-indigo-400">{myOffers.length} offers</h3>
                <p className="text-xs text-slate-400">Official offers registered in ERP</p>
              </div>
            </div>

            {/* Profile Summary Card */}
            <div className="glass-panel p-6 border border-slate-800 bg-slate-900/20 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Academic Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Full Name</span>
                  <span className="text-white font-semibold">{currentStudent?.name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Roll Number</span>
                  <span className="text-white font-semibold">{currentStudent?.rollNumber || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Batch / Semester</span>
                  <span className="text-white font-semibold">{currentStudent?.batch || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Section Allocation</span>
                  <span className="text-white font-semibold">Section {currentStudent?.section || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== PROFILE COMPLETION TAB ==================== */}
        {activeTab === 'profile-completion' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertCircle className="text-amber-400 w-5 h-5" /> Profile Verification Details
              </h2>
              <p className="text-xs text-slate-400">Please provide all mandatory details to request HOD verification</p>
            </div>

            {currentStudent?.status === 'UNDER_VERIFICATION' ? (
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl text-center space-y-4 max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-md font-bold text-white">Under Verification</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your registration profile has been submitted to the Operator queue. The HOD will verify your Aadhaar, category and academic parameters before onboarding is approved.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProfile} className="space-y-6 max-w-4xl bg-slate-900/30 p-6 rounded-xl border border-slate-800/80">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date of Birth</label>
                    <input type="date" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" value={profileData.dob} onChange={e => setProfileData({...profileData, dob: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Gender</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" value={profileData.gender} onChange={e => setProfileData({...profileData, gender: e.target.value})} required>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Blood Group</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" placeholder="e.g. A+" value={profileData.bloodGroup} onChange={e => setProfileData({...profileData, bloodGroup: e.target.value})} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Aadhaar Number</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" placeholder="12 digit number" value={profileData.aadhaarNumber} onChange={e => setProfileData({...profileData, aadhaarNumber: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" value={profileData.category} onChange={e => setProfileData({...profileData, category: e.target.value})} required>
                      <option value="GENERAL">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Religion</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" value={profileData.religion} onChange={e => setProfileData({...profileData, religion: e.target.value})} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Personal Email</label>
                    <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" placeholder="student@gmail.com" value={profileData.personalEmail} onChange={e => setProfileData({...profileData, personalEmail: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mobile Number</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" placeholder="10-digit mobile" value={profileData.mobileNumber} onChange={e => setProfileData({...profileData, mobileNumber: e.target.value})} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Father's Name</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" value={profileData.fatherName} onChange={e => setProfileData({...profileData, fatherName: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mother's Name</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs" value={profileData.motherName} onChange={e => setProfileData({...profileData, motherName: e.target.value})} required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Permanent Address</label>
                  <textarea className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs h-20" value={profileData.permanentAddress} onChange={e => setProfileData({...profileData, permanentAddress: e.target.value})} required />
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="bg-teal-500 text-slate-950 px-5 py-2 rounded text-xs font-bold hover:bg-teal-400 transition-colors">
                    Submit Verification Request
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ==================== ACHIEVEMENTS TAB ==================== */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="text-teal-400 w-5 h-5" /> Self-Reported Achievements
                </h2>
                <p className="text-xs text-slate-400">Log internships, project accomplishments, or external certifications</p>
              </div>
              <button onClick={() => setShowAchievementModal(true)} className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-lg text-xs font-bold hover:bg-teal-500/20 transition-all flex items-center gap-2">
                Report Achievement
              </button>
            </div>

            {/* List of achievements */}
            <div className="bg-slate-900/30 rounded-xl border border-slate-800/80 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Organizer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Level / Position</th>
                    <th className="p-4">Proof File</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {myAchievements.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">No achievements self-reported yet.</td>
                    </tr>
                  ) : (
                    myAchievements.map((ach: any) => (
                      <tr key={ach.id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-bold text-white">{ach.title}</td>
                        <td className="p-4 text-slate-300">{ach.category}</td>
                        <td className="p-4 text-slate-300">{ach.organizer}</td>
                        <td className="p-4 text-slate-400">{ach.date}</td>
                        <td className="p-4 text-teal-400 font-semibold">{ach.level} / {ach.position}</td>
                        <td className="p-4 text-xs font-medium text-slate-400 truncate max-w-[120px]">{ach.proofFile}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Report Achievement Modal */}
            {showAchievementModal && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-xl space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Report New Achievement</h3>
                  <form onSubmit={handleCreateAchievement} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">Title</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newAchievement.title} onChange={e => setNewAchievement({...newAchievement, title: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Category</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newAchievement.category} onChange={e => setNewAchievement({...newAchievement, category: e.target.value})}>
                          <option value="INTERNSHIP">Internship</option>
                          <option value="CONFERENCE">Conference Paper</option>
                          <option value="HACKATHON">Hackathon Win</option>
                          <option value="CERTIFICATION">External Certification</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">Organizer</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newAchievement.organizer} onChange={e => setNewAchievement({...newAchievement, organizer: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Date</label>
                        <input type="date" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newAchievement.date} onChange={e => setNewAchievement({...newAchievement, date: e.target.value})} required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">Level</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newAchievement.level} onChange={e => setNewAchievement({...newAchievement, level: e.target.value})} placeholder="e.g. NATIONAL" required />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Position / Outcome</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" value={newAchievement.position} onChange={e => setNewAchievement({...newAchievement, position: e.target.value})} placeholder="e.g. WINNER" required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Description</label>
                      <textarea className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 h-16" value={newAchievement.description} onChange={e => setNewAchievement({...newAchievement, description: e.target.value})} required />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Upload Proof File (PDF / Image)</label>
                      <input type="file" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2" onChange={e => setAchievementProof(e.target.files ? e.target.files[0] : null)} />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowAchievementModal(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancel</button>
                      <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded font-bold">Report</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== PLACEMENT OFFERS TAB ==================== */}
        {activeTab === 'placement-offers' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="text-teal-400 w-5 h-5" /> Placement Offers Ledger
              </h2>
              <p className="text-xs text-slate-400">View official drive selection letters and packages recorded in ERP</p>
            </div>

            <div className="bg-slate-900/30 rounded-xl border border-slate-800/80 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="p-4">Company</th>
                    <th className="p-4">Designated Role</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Package (LPA)</th>
                    <th className="p-4">Offer Date</th>
                    <th className="p-4">Finalized Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {myOffers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">No placement offers registered.</td>
                    </tr>
                  ) : (
                    myOffers.map((off: any) => (
                      <tr key={off.id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-bold text-white">{off.companyName}</td>
                        <td className="p-4 text-slate-300">{off.jobRole}</td>
                        <td className="p-4 text-slate-300">{off.offerType}</td>
                        <td className="p-4 text-indigo-400 font-bold">{off.packageLpa} LPA</td>
                        <td className="p-4 text-slate-400">{off.offerDate}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${off.isFinal ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                            {off.isFinal ? 'FINAL OFFER' : 'PENDING ACCEPTANCE'}
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

        {/* ==================== DOCUMENTS TAB ==================== */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="text-teal-400 w-5 h-5" /> Syllabus & Central Documents
              </h2>
              <p className="text-xs text-slate-400">Download official CSE syllabus files and placement templates</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publicDocs.length === 0 ? (
                <p className="text-slate-500 text-xs col-span-2 text-center p-8 bg-slate-900/10 rounded-xl border border-slate-800">No syllabus or repository documents have been published.</p>
              ) : (
                publicDocs.map((doc: any) => (
                  <div key={doc.id} className="glass-panel p-5 border border-slate-800 bg-slate-900/20 rounded-xl flex items-start gap-4">
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
                        <span className="text-[10px] text-slate-500">Published: {doc.createdAt ? doc.createdAt.split('T')[0] : "N/A"}</span>
                        <a href={`http://localhost:3001/uploads/${doc.filePath}`} target="_blank" rel="noreferrer" className="text-teal-400 text-xs font-bold hover:underline flex items-center gap-1">
                          View File
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
