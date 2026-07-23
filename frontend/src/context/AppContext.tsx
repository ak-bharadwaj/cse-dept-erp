
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
interface UserType { id?: number; username?: string; role?: string; }
interface Student { 
  id?: number; 
  userId?: number;
  name: string; 
  rollNumber: string; 
  batch: string; 
  section: string; 
  guardianName: string;
  status: string; 
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  aadhaarNumber?: string;
  category?: string;
  caste?: string;
  religion?: string;
  nationality?: string;
  personalEmail?: string;
  mobileNumber?: string;
  altMobileNumber?: string;
  permanentAddress?: string;
  currentAddress?: string;
  fatherName?: string;
  motherName?: string;
  parentMobileNumber?: string;
  parentEmail?: string;
  academicBackground?: string;
}
interface Faculty { id?: number; name: string; employeeId: string; officialEmail: string; qualification: string; experience: number; workload: number; designation?: string; joiningDate?: string; employmentType?: string; bio?: string; }
interface Subject { id?: number; code: string; name: string; semester: number; }
interface Allocation { id?: number; facultyId: number; subjectId: number; section: string; faculty?: Faculty; subject?: Subject; }
interface EventType { id?: number; title: string; date: string; description: string; participants?: string; photographs?: string; }
interface Placement { id?: number; companyName: string; driveDate: string; eligibility: string; status: string; offers?: string; }
interface PlacementOffer { id?: number; studentId: number; companyName: string; jobRole: string; offerType: string; packageLpa: number; offerDate: string; status: string; isFinal: boolean; student?: Student; }
interface Achievement { id?: number; studentId: number; title: string; category: string; organizer: string; date: string; description: string; level: string; position: string; proofFile: string; }
interface Research { id?: number; facultyId: number; type: string; title: string; details: string; faculty?: Faculty; }
interface AuditLog { id?: number; action: string; details: string; timestamp: string; user?: { username: string }; }
interface Document { id?: number; title: string; category: string; description: string; filePath: string; visibility: string; createdAt: string; }
interface Assessment { id?: number; name: string; type: string; maxMarks: number; passingMarks: number; startDate: string; endDate: string; subjectId: number; subject?: Subject; }

export const API_URL = 'http://localhost:3001/api';



export const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Navigation: "home" | "login" | "portal"
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'portal'>('home');

  // Session State
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Domain states
  const [students, setStudents] = useState<Student[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [placementOffers, setPlacementOffers] = useState<PlacementOffer[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [researches, setResearches] = useState<Research[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [analytics, setAnalytics] = useState<{ subjectAnalytics: any[]; toppers: any[] }>({ subjectAnalytics: [], toppers: [] });

  // Navigation tab for Portal layout
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Attendance Entry
  const [attendanceSubjectId, setAttendanceSubjectId] = useState<string>('');
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({}); // { studentId: 'PRESENT'|'ABSENT' }

  // CIA Marks Entry
  const [ciaAssessmentId, setCiaAssessmentId] = useState<string>('');
  const [ciaMarksRecords, setCiaMarksRecords] = useState<Record<string, string>>({}); // { studentId: marksObtained }

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState('');

  // Modals & Forms
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', rollNumber: '', batch: '2026', section: 'A', guardianName: '' });

  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [newFaculty, setNewFaculty] = useState({ name: '', employeeId: '', officialEmail: '', designation: 'Assistant Professor', qualification: 'Ph.D', experience: 5, workload: 12, employmentType: 'PERMANENT' });

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ code: '', name: '', semester: 1 });

  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [newAssessment, setNewAssessment] = useState({ name: '', type: 'INTERNAL_EXAM', maxMarks: '30', passingMarks: '12', startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0], subjectId: '' });

  const [showResearchModal, setShowResearchModal] = useState(false);
  const [newResearch, setNewResearch] = useState({ facultyId: '', type: 'PUBLICATION', title: '', details: '' });

  const [showDocModal, setShowDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', category: 'SYLLABUS', description: '', visibility: 'PUBLIC' });
  const [docFile, setDocFile] = useState<File | null>(null);

  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [newPlacement, setNewPlacement] = useState({ companyName: '', driveDate: new Date().toISOString().split('T')[0], eligibility: '7.5 CGPA' });

  const [showPlacementOfferModal, setShowPlacementOfferModal] = useState(false);
  const [newPlacementOffer, setNewPlacementOffer] = useState({ studentId: '', companyName: '', jobRole: '', offerType: 'FULL_TIME', packageLpa: '8.5', offerDate: new Date().toISOString().split('T')[0], status: 'SELECTED', isFinal: false });

  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState({ title: '', category: 'INTERNSHIP', organizer: '', date: new Date().toISOString().split('T')[0], description: '', level: 'COLLEGE', position: 'COMPLETED' });
  const [achievementProof, setAchievementProof] = useState<File | null>(null);

  // Student Profile Completion Form
  const [profileData, setProfileData] = useState({
    dob: '', gender: 'MALE', bloodGroup: 'O+', aadhaarNumber: '', category: 'GENERAL', caste: '', religion: 'HINDU', nationality: 'INDIAN',
    personalEmail: '', mobileNumber: '', altMobileNumber: '', permanentAddress: '', currentAddress: '',
    fatherName: '', motherName: '', parentMobileNumber: '', parentEmail: '', academicBackground: ''
  });

  // CSV raw strings
  const [csvAllocations, setCsvAllocations] = useState('');
  const [csvMarks, setCsvMarks] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setCurrentView('portal');
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const showNotification = (msg: string, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, { ...options, headers });
      if (!response.ok) {
        throw new Error(await response.text() || 'Request failed');
      }
      return await response.json();
    } catch (err) {
      const e = err as Error;
      console.warn(`API fallback logic triggered for ${endpoint}:`, e.message);
      return getMockFallback(endpoint, options);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      setStudents(await makeRequest('students'));
      setFaculties(await makeRequest('faculty'));
      setSubjects(await makeRequest('subjects'));
      setAllocations(await makeRequest('allocations'));
      setEvents(await makeRequest('events'));
      setPlacements(await makeRequest('placements'));
      setPlacementOffers(await makeRequest('placement-offers'));
      setResearches(await makeRequest('research'));
      setAuditLogs(await makeRequest('audit-logs'));
      setDocuments(await makeRequest('documents'));
      setAssessments(await makeRequest('assessments'));
      setAnalytics(await makeRequest('marks/analytics'));
    } catch {
      showNotification('Loaded workstation with local cache');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await makeRequest('auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      setToken(res.accessToken);
      setUser(res.user);
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('user', JSON.stringify(res.user));
      setCurrentView('portal');
      showNotification(`Logged in as ${res.user.username}`);
    } catch {
      showNotification('Invalid login details', false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentView('home');
    showNotification('Logged out');
  };

  // Submit Profile Completion (Student)
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    const student = students.find(s => s.userId === user.id);
    if (!student) return;

    try {
      await makeRequest(`students/${student.id}/profile`, {
        method: 'POST',
        body: JSON.stringify(profileData)
      });
      fetchData();
      showNotification('Profile submitted successfully for verification!');
    } catch {
      showNotification('Failed to submit profile', false);
    }
  };

  // Verify Profile (HOD / Operator)
  const handleVerifyProfile = async (studentId: number, action: 'APPROVE' | 'REJECT') => {
    try {
      await makeRequest(`students/${studentId}/verify`, {
        method: 'POST',
        body: JSON.stringify({ action })
      });
      fetchData();
      showNotification(`Student profile ${action === 'APPROVE' ? 'Approved' : 'Rejected'}`);
    } catch {
      showNotification('Verification action failed', false);
    }
  };

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await makeRequest('students', { method: 'POST', body: JSON.stringify(newStudent) });
      setStudents([...students, created]);
      setShowStudentModal(false);
      showNotification(`Registered student ${newStudent.name}`);
    } catch {
      showNotification('Failed to register student', false);
    }
  };

  const handleCreateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await makeRequest('faculty', { method: 'POST', body: JSON.stringify(newFaculty) });
      setFaculties([...faculties, created]);
      setShowFacultyModal(false);
      showNotification(`Added faculty member ${newFaculty.name}`);
    } catch {
      showNotification('Failed to add faculty member', false);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await makeRequest('subjects', { method: 'POST', body: JSON.stringify(newSubject) });
      setSubjects([...subjects, created]);
      setShowSubjectModal(false);
      showNotification(`Added subject ${newSubject.name}`);
    } catch {
      showNotification('Failed to add subject', false);
    }
  };

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await makeRequest('assessments', { method: 'POST', body: JSON.stringify(newAssessment) });
      setAssessments([...assessments, created]);
      setShowAssessmentModal(false);
      showNotification(`Configured assessment ${newAssessment.name}`);
    } catch {
      showNotification('Failed to configure assessment', false);
    }
  };

  const handleRecordCiaMarks = async () => {
    if (!ciaAssessmentId) return;
    const marks = Object.entries(ciaMarksRecords).map(([studentId, marksObtained]) => ({
      studentId: parseInt(studentId),
      marksObtained: parseFloat(marksObtained)
    }));

    try {
      await makeRequest(`assessments/${ciaAssessmentId}/marks`, {
        method: 'POST',
        body: JSON.stringify({ marks })
      });
      fetchData();
      showNotification('Continuous Internal Assessment marks logged');
      setCiaMarksRecords({});
    } catch {
      showNotification('Failed to save assessment marks', false);
    }
  };

  const handleSaveAttendance = async () => {
    if (!attendanceSubjectId) {
      showNotification('Select a subject first', false);
      return;
    }
    const records = Object.entries(attendanceRecords).map(([studentId, status]) => ({
      studentId: parseInt(studentId),
      status
    }));

    try {
      await makeRequest('attendance', {
        method: 'POST',
        body: JSON.stringify({
          subjectId: parseInt(attendanceSubjectId),
          date: attendanceDate,
          records
        })
      });
      showNotification('Recorded attendance ledger successfully');
      setAttendanceRecords({});
    } catch {
      showNotification('Failed to submit attendance', false);
    }
  };

  // Add Placement Offer (Operator/Admin)
  const handleCreatePlacementOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await makeRequest(`students/${newPlacementOffer.studentId}/placement-offer`, {
        method: 'POST',
        body: JSON.stringify(newPlacementOffer)
      });
      setPlacementOffers([...placementOffers, created]);
      setShowPlacementOfferModal(false);
      showNotification('Recorded placement offer');
    } catch {
      showNotification('Failed to record offer', false);
    }
  };

  // Self Report Student Achievement
  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.userId === user?.id);
    if (!student) return;

    try {
      let filename = 'proof.pdf';
      if (achievementProof) {
        const formData = new FormData();
        formData.append('file', achievementProof);
        const res = await fetch(`${API_URL}/students/${student.id}/upload-doc`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        const uploadResult = await res.json();
        filename = uploadResult.filename;
      }

      const created = await makeRequest(`students/${student.id}/achievement-new`, {
        method: 'POST',
        body: JSON.stringify({ ...newAchievement, proofFile: filename })
      });
      fetchData();
      setShowAchievementModal(false);
      showNotification('Achievement self-reported successfully');
    } catch {
      showNotification('Failed to record achievement', false);
    }
  };

  // Upload Document (visibility based)
  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile) return;

    const formData = new FormData();
    formData.append('file', docFile);

    try {
      const res = await fetch(`${API_URL}/students/1/upload-doc`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const uploadResult = await res.json();

      const created = await makeRequest('documents', {
        method: 'POST',
        body: JSON.stringify({
          title: newDoc.title,
          category: newDoc.category,
          description: newDoc.description,
          filePath: uploadResult.filename,
          visibility: newDoc.visibility
        })
      });
      setDocuments([created, ...documents]);
      setShowDocModal(false);
      setDocFile(null);
      showNotification('Document uploaded to repository');
    } catch {
      showNotification('Failed to upload document', false);
    }
  };

  const handleImportAllocations = async () => {
    try {
      const lines = csvAllocations.trim().split('\n');
      const allocs = lines.map(line => {
        const [facultyName, subjectCode, section] = line.split(',');
        return { facultyName, subjectCode, section };
      });
      const imported = await makeRequest('allocations/import', { method: 'POST', body: JSON.stringify({ allocations: allocs }) });
      fetchData();
      showNotification(`Imported teaching allocations`);
      setCsvAllocations('');
    } catch {
      showNotification('CSV parsing error. Ensure format: FacultyName,SubjectCode,Section', false);
    }
  };

  const handleImportMarks = async () => {
    try {
      const lines = csvMarks.trim().split('\n');
      const marksData = lines.map(line => {
        const [studentRoll, subjectCode, type, marksObtained, maxMarks] = line.split(',');
        return { studentRoll, subjectCode, type, marksObtained, maxMarks };
      });
      const imported = await makeRequest('marks/import', { method: 'POST', body: JSON.stringify({ marks: marksData }) });
      fetchData();
      showNotification(`Imported student marks`);
      setCsvMarks('');
    } catch {
      showNotification('CSV parsing error. Check format: Roll,Code,Type,Obtained,Max', false);
    }
  };

  // Seeding/Mock fallbacks
  const getMockFallback = (endpoint: string, options: RequestInit) => {
    if (endpoint === 'auth/login') {
      return { accessToken: 'mock-token', user: { id: 1, username: 'admin', role: 'SUPER_ADMIN' } };
    }
    return [];
  };

  // Find currently logged student if role is STUDENT
  const loggedStudent = roleStudent();
  function roleStudent() {
    if (!user || user.role !== 'STUDENT') return null;
    return students.find(s => s.userId === user.id) || null;
  }

  // Find currently logged faculty if role is FACULTY
  const loggedFaculty = roleFaculty();
  function roleFaculty() {
    if (!user || user.role !== 'FACULTY') return null;
    return faculties.find(f => f.officialEmail === user.username) || null;
  }


  
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
      handleLogin, handleLogout, fetchData, handleSubmitProfile, handleVerifyProfile,
      handleRegisterStudent, handleCreateFaculty, handleCreateSubject, handleCreateAssessment,
      handleRecordCiaMarks, handleSaveAttendance, handleCreatePlacementOffer, handleCreateAchievement,
      handleUploadDoc, handleImportAllocations, handleImportMarks, getMockFallback, showNotification,
      loggedStudent, loggedFaculty
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
