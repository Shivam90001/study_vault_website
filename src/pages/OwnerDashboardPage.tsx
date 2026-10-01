import React, { useEffect, useRef, useState } from 'react';
import { 
  ShieldCheck, 
  LogOut, 
  Upload, 
  Plus, 
  Trash2, 
  FileText, 
  HelpCircle, 
  KeyRound, 
  Save, 
  CheckCircle2, 
  Eye, 
  ArrowLeft,
  Layers,
  Sparkles,
  Lock,
  Image as ImageIcon,
  GraduationCap,
  Calendar,
  BookOpen,
  FileCheck,
  Search,
  Activity,
  Users,
  Smartphone,
  Monitor,
  Clock,
  RotateCcw,
  TrendingUp,
  Flame,
  Bell,
  Download,
  Archive,
  ChevronDown
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { DocumentType, FileFormat, VisitorActivity } from '../types';

export const OwnerDashboardPage: React.FC = () => {
  const { 
    logoutOwner, 
    courses, 
    semesters, 
    subjects, 
    documents, 
    mcqs,
    addCourse,
    deleteCourse,
    addSemester,
    deleteSemester,
    addSubject,
    deleteSubject,
    addDocument, 
    updateDocument,
    deleteDocument,
    addMCQ,
    deleteMCQ,
    notices,
    addNotice,
    deleteNotice,
    toggleNoticeActive,
    siteConfig,
    updateSiteConfig,
    ownerCredentials,
    contentSyncStatus,
    updateOwnerCredentials,
    navigateTo,
    openDocument,
    analytics,
    clearAnalyticsHistory
  } = useVault();

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'resources' | 'courses' | 'semesters' | 'subjects' | 'mcqs' | 'notices' | 'security'>('analytics');
  const [activityFilter, setActivityFilter] = useState<'ALL' | 'DOCUMENT_VIEW' | 'NAVIGATION' | 'MCQ_PRACTICE'>('ALL');

  // Notice form state
  const [noticeMsg, setNoticeMsg] = useState('');
  const [noticeBadge, setNoticeBadge] = useState('Notice');

  // Feedback notifications
  const [successMsg, setSuccessMsg] = useState('');
  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // --- FORM STATE: ADD RESOURCE (Syllabus, PYQ, Notes, Photos) ---
  const initialResourceCourseId = courses[0]?.id || '';
  const initialResourceSemesterId = semesters.find(s => s.courseId === initialResourceCourseId)?.id || '';
  const initialResourceSubject = subjects.find(s => s.courseId === initialResourceCourseId && s.semesterId === initialResourceSemesterId);
  const [resCourseId, setResCourseId] = useState(initialResourceCourseId);
  const [resSemesterId, setResSemesterId] = useState(initialResourceSemesterId);
  const [resSubjectId, setResSubjectId] = useState(initialResourceSubject?.id || '');
  const [resSubjectQuery, setResSubjectQuery] = useState(initialResourceSubject ? `${initialResourceSubject.code} - ${initialResourceSubject.name}` : '');
  const [isResSubjectOpen, setIsResSubjectOpen] = useState(false);
  const [resType, setResType] = useState<DocumentType>('notes');
  const [resUnit, setResUnit] = useState<number | 'all'>(1);
  const [resTitle, setResTitle] = useState('');
  const [resAuthor, setResAuthor] = useState('Verified Faculty');
  const [resFormat, setResFormat] = useState<FileFormat>('pdf');
  const [resPages, setResPages] = useState(24);
  const [resSummary, setResSummary] = useState('');
  const [resFiles, setResFiles] = useState<File[]>([]);
  const [isUploadingResource, setIsUploadingResource] = useState(false);
  const [resourceAssignmentDrafts, setResourceAssignmentDrafts] = useState<Record<string, { subjectId: string; type: DocumentType }>>({});
  const filePickerRef = useRef<HTMLInputElement>(null);
  const photoPickerRef = useRef<HTMLInputElement>(null);

  // Keep selected files local until their shared resource metadata is ready to publish.
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pickedFiles = Array.from(e.currentTarget.files || []);
    if (!pickedFiles.length) return;

    setResFiles(currentFiles => {
      const existingFiles = new Set(currentFiles.map(file => `${file.name}:${file.size}:${file.lastModified}`));
      const newFiles = pickedFiles.filter(file => !existingFiles.has(`${file.name}:${file.size}:${file.lastModified}`));
      return [...currentFiles, ...newFiles];
    });
    const firstFile = pickedFiles[0];
    const extension = firstFile.name.split('.').pop()?.toLowerCase();
    setResFormat(extension && /^[a-z0-9]{1,12}$/.test(extension) ? extension : 'file');
    e.currentTarget.value = '';
  };

  const handleAddResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || isUploadingResource) return;
    if (!resFilteredSubjects.some(subject => subject.id === resSubjectId)) {
      showNotification('Please select a subject from the subject list.');
      return;
    }

    setIsUploadingResource(true);
    const filesToPublish: Array<File | null> = resFiles.length ? resFiles : [null];
    let publishedCount = 0;
    try {
      for (const file of filesToPublish) {
        let uploadedFile: { fileUrl: string; contentType: string } | undefined;
        if (file) {
          const response = await fetch('/api/uploads', {
            method: 'POST',
            headers: {
              'Content-Type': file.type || 'application/octet-stream',
              'X-File-Name': encodeURIComponent(file.name)
            },
            body: file
          });
          if (!response.ok) {
            const result = await response.json().catch(() => null) as { error?: string } | null;
            throw new Error(result?.error || `Upload failed for ${file.name}. Please sign in again and retry.`);
          }
          uploadedFile = await response.json() as { fileUrl: string; contentType: string };
        }

        const extension = file?.name.split('.').pop()?.toLowerCase();
        const fileFormat = extension && /^[a-z0-9]{1,12}$/.test(extension) ? extension : resFormat;
        const fileTitle = file?.name.replace(/\.[^.]+$/, '') || file?.name || resTitle.trim();
        const title = file && filesToPublish.length > 1 ? `${resTitle.trim()} - ${fileTitle}` : resTitle.trim();
        addDocument({
          title,
          courseId: resCourseId,
          semesterId: resSemesterId,
          subjectId: resSubjectId,
          type: resType,
          unit: resUnit,
          fileFormat,
          fileName: file?.name || `${resTitle}.${fileFormat}`,
          fileUrl: uploadedFile?.fileUrl,
          fileMimeType: uploadedFile?.contentType,
          fileSize: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '3.5 MB',
          pagesCount: resPages || 15,
          author: resAuthor || 'StudyVault Faculty',
          tags: [resType.toUpperCase(), fileFormat.toUpperCase(), 'Verified'],
          summary: resSummary || `${title} official resource uploaded for university preparation.`,
          previewPages: [
            {
              pageNumber: 1,
              title: `${title} - Overview`,
              content: [resSummary || 'Protected university notes and study resources.']
            }
          ]
        });
        publishedCount += 1;
        if (file) {
          setResFiles(currentFiles => currentFiles.filter(selectedFile => selectedFile !== file));
        }
      }

      setResTitle('');
      setResSummary('');
      setResFiles([]);
      showNotification(`${publishedCount} resource${publishedCount === 1 ? '' : 's'} uploaded and published for all visitors.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Resource could not be uploaded.';
      showNotification(publishedCount
        ? `${publishedCount} resource${publishedCount === 1 ? '' : 's'} published; remaining selected files are kept. ${message}`
        : message);
    } finally {
      setIsUploadingResource(false);
    }
  };

  // --- FORM STATE: ADD COURSE ---
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseDuration, setNewCourseDuration] = useState(4);
  const [newCourseSemesters, setNewCourseSemesters] = useState(8);
  const [newCourseCategory, setNewCourseCategory] = useState<'Engineering' | 'Computer Applications' | 'Management' | 'Pharmacy'>('Engineering');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim() || !newCourseCode.trim()) return;

    addCourse({
      name: newCourseName,
      code: newCourseCode,
      durationYears: newCourseDuration,
      totalSemesters: newCourseSemesters,
      category: newCourseCategory,
      description: newCourseDesc || `${newCourseName} curriculum study vault.`,
      icon: 'GraduationCap'
    });

    setNewCourseName('');
    setNewCourseCode('');
    setNewCourseDesc('');
    showNotification(`Course ${newCourseCode} added successfully with ${newCourseSemesters} semesters!`);
  };

  // --- FORM STATE: ADD SEMESTER ---
  const [semCourseTarget, setSemCourseTarget] = useState(courses[0]?.id || 'btech');
  const [semNumber, setSemNumber] = useState(1);
  const [semName, setSemName] = useState('Semester 1');
  const [semYear, setSemYear] = useState('Year 1');

  const handleAddSemesterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSemester({
      courseId: semCourseTarget,
      semesterNumber: semNumber,
      name: semName,
      academicYear: semYear
    });
    showNotification(`Semester "${semName}" added!`);
  };

  // --- FORM STATE: ADD SUBJECT ---
  const [subCourseTarget, setSubCourseTarget] = useState(courses[0]?.id || 'btech');
  const [subSemesterTarget, setSubSemesterTarget] = useState('btech-sem3');
  const [subCode, setSubCode] = useState('');
  const [subName, setSubName] = useState('');
  const [subCredits, setSubCredits] = useState(4);
  const [subUnits, setSubUnits] = useState(5);
  const [subDesc, setSubDesc] = useState('');

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCode.trim() || !subName.trim()) return;

    addSubject({
      courseId: subCourseTarget,
      semesterId: subSemesterTarget,
      code: subCode,
      name: subName,
      credits: subCredits,
      unitsCount: subUnits,
      description: subDesc || `${subName} curriculum subject syllabus and notes.`
    });

    setSubCode('');
    setSubName('');
    setSubDesc('');
    showNotification(`Subject "${subCode}: ${subName}" added!`);
  };

  // --- FORM STATE: ADD MCQ ---
  const [mcqCourseId, setMcqCourseId] = useState(courses[0]?.id || 'btech');
  const [mcqSemesterId, setMcqSemesterId] = useState('btech-sem3');
  const [mcqSubjectId, setMcqSubjectId] = useState('sub-btech-dsa');
  const [mcqUnit, setMcqUnit] = useState<number | 'all'>(1);
  const [mcqQuestion, setMcqQuestion] = useState('');
  const [mcqOptA, setMcqOptA] = useState('');
  const [mcqOptB, setMcqOptB] = useState('');
  const [mcqOptC, setMcqOptC] = useState('');
  const [mcqOptD, setMcqOptD] = useState('');
  const [mcqCorrectIndex, setMcqCorrectIndex] = useState(0);
  const [mcqExplanation, setMcqExplanation] = useState('');

  const handleAddMCQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcqQuestion.trim() || !mcqOptA.trim() || !mcqOptB.trim()) return;

    addMCQ({
      courseId: mcqCourseId,
      semesterId: mcqSemesterId,
      subjectId: mcqSubjectId,
      unit: mcqUnit,
      question: mcqQuestion,
      options: [mcqOptA, mcqOptB, mcqOptC || 'Option C', mcqOptD || 'Option D'],
      correctOptionIndex: mcqCorrectIndex,
      explanation: mcqExplanation || 'Standard university question explanation.'
    });

    setMcqQuestion('');
    setMcqOptA('');
    setMcqOptB('');
    setMcqOptC('');
    setMcqOptD('');
    setMcqExplanation('');
    showNotification('MCQ added successfully!');
  };

  // --- SECURITY & SETTINGS STATE ---
  const [newUsername, setNewUsername] = useState(ownerCredentials.username);
  const [newPass1, setNewPass1] = useState(ownerCredentials.passwordPrimary);
  const [newPass2, setNewPass2] = useState(ownerCredentials.passwordSecondary);
  const [siteTitle, setSiteTitle] = useState(siteConfig.siteName);
  const [siteTagline, setSiteTagline] = useState(siteConfig.siteTagline);
  const [noticeText, setNoticeText] = useState(siteConfig.announcementText);
  const [noticeActive, setNoticeActive] = useState(siteConfig.isAnnouncementActive);

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateOwnerCredentials({
        username: newUsername,
        passwordPrimary: newPass1,
        passwordSecondary: newPass2
      });
      showNotification('Owner credentials (1 Username + 2 Passwords) updated!');
    } catch {
      showNotification('Could not update credentials. Please sign in again and retry.');
    }
  };

  const handleUpdateSite = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig({
      siteName: siteTitle,
      siteTagline: siteTagline,
      announcementText: noticeText,
      isAnnouncementActive: noticeActive
    });
    showNotification('Website branding & notice updated!');
  };

  // Helper filters
  const resFilteredSemesters = semesters.filter(s => s.courseId === resCourseId);
  const resFilteredSubjects = subjects.filter(s => s.courseId === resCourseId && s.semesterId === resSemesterId);
  const selectedResourceSubject = resFilteredSubjects.find(subject => subject.id === resSubjectId);
  const resSubjectOptions = resSubjectQuery === (selectedResourceSubject ? `${selectedResourceSubject.code} - ${selectedResourceSubject.name}` : '')
    ? resFilteredSubjects
    : resFilteredSubjects.filter(subject => `${subject.code} - ${subject.name}`.toLowerCase().includes(resSubjectQuery.trim().toLowerCase()));

  useEffect(() => {
    const courseId = courses.some(course => course.id === resCourseId) ? resCourseId : courses[0]?.id || '';
    const courseSemesters = semesters.filter(semester => semester.courseId === courseId);
    const semesterId = courseSemesters.some(semester => semester.id === resSemesterId)
      ? resSemesterId
      : courseSemesters[0]?.id || '';
    const availableSubjects = subjects.filter(subject => subject.courseId === courseId && subject.semesterId === semesterId);
    const selectedSubject = availableSubjects.find(subject => subject.id === resSubjectId) || availableSubjects[0];
    const subjectId = selectedSubject?.id || '';

    if (courseId !== resCourseId) setResCourseId(courseId);
    if (semesterId !== resSemesterId) setResSemesterId(semesterId);
    if (subjectId !== resSubjectId) setResSubjectId(subjectId);
    if (!resSubjectId || (selectedSubject && selectedSubject.id !== resSubjectId)) {
      setResSubjectQuery(selectedSubject ? `${selectedSubject.code} - ${selectedSubject.name}` : '');
    }
  }, [courses, semesters, subjects]);

  const subFilteredSemesters = semesters.filter(s => s.courseId === subCourseTarget);

  const [searchDocTerm, setSearchDocTerm] = useState('');
  const filteredDocuments = documents.filter(d => 
    d.title.toLowerCase().includes(searchDocTerm.toLowerCase()) ||
    d.author.toLowerCase().includes(searchDocTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 py-6">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">Owner Control Center</h1>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                Master Privileges
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Add or remove courses, semesters, subjects, syllabus, PYQs, and notes. (Downloads disabled for users).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/studyvault-complete-website.zip"
            download="studyvault-complete-website.zip"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20"
            title="Download complete website source code as ZIP file"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </a>

          <button
            onClick={() => navigateTo({ view: 'courses' })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={logoutOwner}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      <div className={`p-3.5 rounded-2xl border text-xs font-semibold ${
        contentSyncStatus === 'saved'
          ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
          : contentSyncStatus === 'saving' || contentSyncStatus === 'loading'
            ? 'bg-slate-900 border-slate-700 text-slate-300'
            : contentSyncStatus === 'local'
              ? 'bg-amber-950/50 border-amber-500/30 text-amber-300'
              : 'bg-rose-950/50 border-rose-500/30 text-rose-300'
      }`}>
        {contentSyncStatus === 'saved' && 'Changes are saved and shared with all visitors.'}
        {contentSyncStatus === 'saving' && 'Saving changes for all visitors...'}
        {contentSyncStatus === 'loading' && 'Loading shared website content...'}
        {contentSyncStatus === 'local' && 'This device has not published its existing content yet.'}
        {contentSyncStatus === 'error' && 'Shared save failed. Check the server connection and sign in again.'}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-indigo-300" />
          <span>Visitor Analytics & Activity ({analytics.totalVisits})</span>
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'notices'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notices & Announcements ({notices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'resources'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Syllabus, PYQs & Notes ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'courses'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Courses ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('semesters')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'semesters'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Semesters ({semesters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'subjects'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Subjects ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mcqs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'mcqs'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Practice MCQs ({mcqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'security'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Security & Branding</span>
        </button>
      </div>

      {/* TAB 0: VISITOR ANALYTICS & ACTIVITY LOG */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-2 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Total Website Visits</span>
                <span className="text-2xl sm:text-3xl font-black text-white">{analytics.totalVisits}</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium block">
                Total page sessions loaded
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-2 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Unique Browsers</span>
                <span className="text-2xl sm:text-3xl font-black text-white">{analytics.uniqueVisitors}</span>
              </div>
              <span className="text-[11px] text-indigo-400 font-medium block">
                Anonymous browser IDs
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-2 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Resources Opened</span>
                <span className="text-2xl sm:text-3xl font-black text-white">{analytics.totalDocumentViews}</span>
              </div>
              <span className="text-[11px] text-amber-400 font-medium block">
                Opened in the protected reader
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-2 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">MCQs Practiced</span>
                <span className="text-2xl sm:text-3xl font-black text-white">{analytics.totalMCQAttempts}</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium block">
                Quiz questions solved
              </span>
            </div>
          </div>

          {/* Activity Log: What People Visited */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Live Visitor Activity Timeline
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Anonymous browser activity, refreshed every 3 seconds. No names or IP addresses are stored.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    if (confirm('Clear the visitor activity history log?')) {
                      try {
                        await clearAnalyticsHistory();
                        showNotification('Activity history cleared.');
                      } catch {
                        showNotification('Could not clear activity history. Please sign in again.');
                      }
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Log</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setActivityFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  activityFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                All Actions ({analytics.activities.length})
              </button>
              <button
                onClick={() => setActivityFilter('DOCUMENT_VIEW')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  activityFilter === 'DOCUMENT_VIEW' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Notes & Syllabus Read
              </button>
              <button
                onClick={() => setActivityFilter('NAVIGATION')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  activityFilter === 'NAVIGATION' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Courses & Subjects
              </button>
              <button
                onClick={() => setActivityFilter('MCQ_PRACTICE')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  activityFilter === 'MCQ_PRACTICE' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                MCQs Practiced
              </button>
            </div>

            {/* Activities List */}
            <div className="space-y-3">
              {analytics.activities
                .filter(act => {
                  if (activityFilter === 'ALL') return true;
                  if (activityFilter === 'DOCUMENT_VIEW') return act.action === 'DOCUMENT_VIEW';
                  if (activityFilter === 'MCQ_PRACTICE') return act.action === 'MCQ_PRACTICE';
                  if (activityFilter === 'NAVIGATION') return ['COURSE_VISIT', 'SEMESTER_VISIT', 'SUBJECT_VISIT', 'PAGE_VISIT'].includes(act.action);
                  return true;
                })
                .map((act) => {
                  let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                  let label = 'Site Visit';

                  if (act.action === 'DOCUMENT_VIEW') {
                    badgeColor = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                    label = 'Opened Resource';
                  } else if (act.action === 'MCQ_PRACTICE') {
                    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                    label = 'MCQ Practice';
                  } else if (act.action === 'COURSE_VISIT') {
                    badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
                    label = 'Course';
                  } else if (act.action === 'SEMESTER_VISIT') {
                    badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
                    label = 'Semester';
                  } else if (act.action === 'SUBJECT_VISIT') {
                    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                    label = 'Subject';
                  }

                  return (
                    <div
                      key={act.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${badgeColor}`}>
                            {label}
                          </span>
                          <span className="font-bold text-white text-sm">
                            {act.title}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {act.details}
                        </p>
                        {act.visitorId && (
                          <p className="text-[10px] text-slate-500 font-mono">
                            Visitor {act.visitorId.slice(0, 8).toUpperCase()}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-500 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-900">
                        <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-md text-slate-400">
                          {act.deviceType === 'Mobile' ? <Smartphone className="w-3 h-3 text-indigo-400" /> : <Monitor className="w-3 h-3 text-indigo-400" />}
                          <span>{act.deviceType}</span>
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{Number.isNaN(Date.parse(act.timestamp)) ? act.timestamp : new Date(act.timestamp).toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}

              {analytics.activities.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No activity logs recorded yet. Visit some courses and notes to see real-time updates!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: NOTICES & ANNOUNCEMENTS */}
      {activeTab === 'notices' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Add Notice Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Publish New Announcement / Notice</h3>
              </div>
              <span className="text-xs text-slate-400">
                Displays in the top notice bar across the website
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!noticeMsg.trim()) return;
                addNotice(noticeMsg, noticeBadge);
                setNoticeMsg('');
                showNotification('Notice published live to top announcement bar!');
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">Notice Text *</label>
                  <input
                    type="text"
                    required
                    value={noticeMsg}
                    onChange={(e) => setNoticeMsg(e.target.value)}
                    placeholder="e.g. 2026 Semester Examination schedule announced for all courses..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Badge Tag</label>
                  <select
                    value={noticeBadge}
                    onChange={(e) => setNoticeBadge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white font-medium"
                  >
                    <option value="Notice">Notice</option>
                    <option value="Exam Update">Exam Update</option>
                    <option value="Urgent">Urgent</option>
                    <option value="New Notes">New Notes</option>
                    <option value="Syllabus 2026">Syllabus 2026</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer shadow-md transition-all active:scale-95"
              >
                Add Live Notice
              </button>
            </form>
          </div>

          {/* Existing Notices List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white">Active & Past Announcements ({notices.length})</h3>

            <div className="space-y-3">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        {n.badgeText}
                      </span>
                      <span className="text-[11px] text-slate-500">{n.date}</span>
                      {n.isActive && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                          Live on Top Bar
                        </span>
                      )}
                    </div>
                    <p className="text-white font-medium leading-relaxed">
                      {n.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        toggleNoticeActive(n.id);
                        showNotification(n.isActive ? 'Notice hidden from top bar.' : 'Notice activated on top bar!');
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer text-xs transition-colors ${
                        n.isActive
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {n.isActive ? 'Active (Click to Hide)' : 'Set Active'}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Remove this notice: "${n.text.substring(0, 30)}..."?`)) {
                          deleteNotice(n.id);
                          showNotification('Notice removed.');
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/20 cursor-pointer"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {notices.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No announcements currently added. Use the form above to add your first notice.
                </div>
              )}
            </div>
          </div>

          {/* Download Complete Website ZIP Box */}
          <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Archive className="w-5 h-5" />
                  <span className="text-base text-white font-extrabold">Complete Website Codebase (.ZIP)</span>
                </div>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Download the complete standalone source code archive of StudyVault with all components, data models, syllabus, PYQs, MCQs, and styles ready to deploy or edit in VS Code.
                </p>
              </div>

              <a
                href="/studyvault-complete-website.zip"
                download="studyvault-complete-website.zip"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Website ZIP (82 KB)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: RESOURCES (Upload PDF, DOCX, JPG, PNG + Manage) */}
      {activeTab === 'resources' && (
        <div className="space-y-8">
          {/* Upload Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Upload New Syllabus, PYQ, Notes or Photo</h3>
              </div>
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">
                Shared with all visitors
              </span>
            </div>

            <form onSubmit={handleAddResourceSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Course</label>
                  <select
                    value={resCourseId}
                    onChange={(e) => {
                      const courseId = e.target.value;
                      const semester = semesters.find(s => s.courseId === courseId);
                      const subject = subjects.find(sub => sub.courseId === courseId && sub.semesterId === semester?.id);
                      setResCourseId(courseId);
                      setResSemesterId(semester?.id || '');
                      setResSubjectId(subject?.id || '');
                      setResSubjectQuery(subject ? `${subject.code} - ${subject.name}` : '');
                      setIsResSubjectOpen(false);
                    }}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Semester</label>
                  <select
                    value={resSemesterId}
                    onChange={(e) => {
                      const semesterId = e.target.value;
                      const subject = subjects.find(sub => sub.courseId === resCourseId && sub.semesterId === semesterId);
                      setResSemesterId(semesterId);
                      setResSubjectId(subject?.id || '');
                      setResSubjectQuery(subject ? `${subject.code} - ${subject.name}` : '');
                      setIsResSubjectOpen(false);
                    }}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    {resFilteredSemesters.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Subject</label>
                  <div
                    className="relative"
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsResSubjectOpen(false);
                    }}
                  >
                    <div className="flex w-full items-center rounded-xl border border-slate-700/80 bg-slate-950 focus-within:border-indigo-500">
                      <input
                        type="text"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={isResSubjectOpen}
                        aria-controls="resource-subject-options"
                        autoComplete="off"
                        value={resSubjectQuery}
                        onFocus={() => setIsResSubjectOpen(true)}
                        onChange={(e) => {
                          const query = e.target.value;
                          const matchingSubject = resFilteredSubjects.find(subject => `${subject.code} - ${subject.name}`.toLowerCase() === query.trim().toLowerCase());
                          setResSubjectQuery(query);
                          setResSubjectId(matchingSubject?.id || '');
                          setIsResSubjectOpen(true);
                        }}
                        placeholder={resFilteredSubjects.length ? 'Search or choose a subject...' : 'No subjects in this semester'}
                        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-white outline-none placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        aria-label={isResSubjectOpen ? 'Close subject list' : 'Open subject list'}
                        aria-expanded={isResSubjectOpen}
                        onClick={() => setIsResSubjectOpen(open => !open)}
                        className="flex h-9 w-10 shrink-0 items-center justify-center text-slate-400 hover:text-white"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${isResSubjectOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    {isResSubjectOpen && (
                      <div id="resource-subject-options" role="listbox" className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 p-1 shadow-xl">
                        {resSubjectOptions.length ? resSubjectOptions.map(subject => {
                          const label = `${subject.code} - ${subject.name}`;
                          return (
                            <button
                              key={subject.id}
                              type="button"
                              role="option"
                              aria-selected={subject.id === resSubjectId}
                              onClick={() => {
                                setResSubjectId(subject.id);
                                setResSubjectQuery(label);
                                setIsResSubjectOpen(false);
                              }}
                              className="block w-full rounded-lg px-3 py-2 text-left text-white hover:bg-slate-800 aria-selected:bg-slate-800"
                            >
                              {label}
                            </button>
                          );
                        }) : (
                          <p className="px-3 py-2 text-slate-400">
                            {resFilteredSubjects.length ? 'No matching subjects.' : 'Add a subject to this course and semester first.'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Resource Category</label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value as DocumentType)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="syllabus">Syllabus</option>
                    <option value="pyq">PYQ (Question Paper)</option>
                    <option value="notes">Notes (Handwritten)</option>
                    <option value="photo">Photo / Diagram</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Unit</label>
                  <select
                    value={resUnit}
                    onChange={(e) => setResUnit(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="all">Full Syllabus / All Units</option>
                    <option value={1}>Unit 1</option>
                    <option value={2}>Unit 2</option>
                    <option value={3}>Unit 3</option>
                    <option value={4}>Unit 4</option>
                    <option value={5}>Unit 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">File Format</label>
                  <select
                    value={resFormat}
                    onChange={(e) => setResFormat(e.target.value as FileFormat)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white uppercase font-mono"
                  >
                    {!['pdf', 'jpg', 'png', 'docx'].includes(resFormat) && <option value={resFormat}>{resFormat.toUpperCase()} File</option>}
                    <option value="pdf">PDF Document</option>
                    <option value="jpg">JPG Image</option>
                    <option value="png">PNG Image</option>
                    <option value="docx">DOCX File</option>
                  </select>
                </div>
              </div>

              {/* File Attachment / File Picker */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-slate-700 space-y-3">
                <label className="block text-slate-300 font-bold">
                  Attach files or photos (up to 50 MB each)
                </label>
                <input
                  type="file"
                  ref={filePickerRef}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={photoPickerRef}
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => filePickerRef.current?.click()}
                    disabled={isUploadingResource}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"
                  >
                    <FileText className="h-4 w-4" />
                    Choose files
                  </button>
                  <button
                    type="button"
                    onClick={() => photoPickerRef.current?.click()}
                    disabled={isUploadingResource}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Choose photos from gallery
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Select multiple photos, PDFs, or supported files. Each selected file is published as a separate resource with the course and subject chosen above.
                </p>
                {resFiles.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-bold text-emerald-400">{resFiles.length} file{resFiles.length === 1 ? '' : 's'} selected</p>
                    <ul className="space-y-1">
                      {resFiles.map((file, index) => (
                        <li key={`${file.name}:${file.size}:${file.lastModified}`} className="flex items-center justify-between gap-2 text-[11px] text-slate-300">
                          <span className="flex min-w-0 items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                            <span className="truncate">{file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)</span>
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove ${file.name}`}
                            disabled={isUploadingResource}
                            onClick={() => setResFiles(currentFiles => currentFiles.filter((_, fileIndex) => fileIndex !== index))}
                            className="shrink-0 text-rose-400 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="e.g. Unit 2: Stacks & Queue Handwritten Notes"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Summary / Concept Overview</label>
                <textarea
                  rows={2}
                  value={resSummary}
                  onChange={(e) => setResSummary(e.target.value)}
                  placeholder="Key topics, exam derivations, and formulas..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isUploadingResource}
                className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold cursor-pointer shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:cursor-wait disabled:opacity-60"
              >
                {isUploadingResource ? 'Uploading...' : 'Publish Resource to Website'}
              </button>
            </form>
          </div>

          {/* List of Existing Materials with Delete Action */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Existing Study Materials ({documents.length})
                </h3>
                <p className="mt-1 text-[11px] text-slate-400">Download a separate copy of your site data and uploaded files.</p>
              </div>
              <a
                href="/api/owner/backup"
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-600/15 px-3 py-2 text-xs font-bold text-indigo-200 hover:bg-indigo-600/25"
              >
                <Download className="h-4 w-4" />
                Download full backup
              </a>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchDocTerm}
                  onChange={(e) => setSearchDocTerm(e.target.value)}
                  placeholder="Search resources..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Assign To</th>
                    <th className="py-3 px-4">Section</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-normal">
                  {filteredDocuments.map(doc => {
                    const assignment = resourceAssignmentDrafts[doc.id] || { subjectId: doc.subjectId, type: doc.type };
                    const assignmentChanged = assignment.subjectId !== doc.subjectId || assignment.type !== doc.type;

                    return (
                      <tr key={doc.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 max-w-sm truncate font-medium text-white">
                          {doc.title}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold uppercase bg-slate-800 px-2 py-0.5 rounded text-indigo-400">
                            {doc.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 uppercase font-mono font-bold text-emerald-400">
                          {doc.fileFormat}
                        </td>
                        <td className="min-w-64 py-3 px-4">
                          <select
                            aria-label={`Assign ${doc.title} to a subject`}
                            value={assignment.subjectId}
                            onChange={e => setResourceAssignmentDrafts(current => ({
                              ...current,
                              [doc.id]: { ...assignment, subjectId: e.target.value }
                            }))}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-white"
                          >
                            {courses.map(course => {
                              const courseSubjects = subjects.filter(subject => subject.courseId === course.id);
                              return (
                                <optgroup key={course.id} label={course.name}>
                                  {courseSubjects.map(subject => {
                                    const semester = semesters.find(item => item.id === subject.semesterId);
                                    return <option key={subject.id} value={subject.id}>{semester?.name || 'Semester'} / {subject.code} - {subject.name}</option>;
                                  })}
                                </optgroup>
                              );
                            })}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            aria-label={`Choose section for ${doc.title}`}
                            value={assignment.type}
                            onChange={e => setResourceAssignmentDrafts(current => ({
                              ...current,
                              [doc.id]: { ...assignment, type: e.target.value as DocumentType }
                            }))}
                            className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-white"
                          >
                            <option value="syllabus">Syllabus</option>
                            <option value="pyq">PYQ</option>
                            <option value="notes">Notes</option>
                            <option value="mcq">MCQ</option>
                            <option value="photo">Photo</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          {doc.unit === 'all' ? 'All' : `Unit ${doc.unit}`}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {assignmentChanged && (
                            <button
                              onClick={() => {
                                const subject = subjects.find(item => item.id === assignment.subjectId);
                                if (!subject) {
                                  showNotification('Choose a valid subject before saving.');
                                  return;
                                }
                                updateDocument(doc.id, {
                                  courseId: subject.courseId,
                                  semesterId: subject.semesterId,
                                  subjectId: subject.id,
                                  type: assignment.type
                                });
                                setResourceAssignmentDrafts(current => {
                                  const { [doc.id]: _saved, ...remaining } = current;
                                  return remaining;
                                });
                                showNotification('Resource moved to the selected course and section.');
                              }}
                              className="mr-2 rounded-lg bg-indigo-600 px-2.5 py-1.5 font-bold text-white hover:bg-indigo-500"
                            >
                              Save
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (confirm(`Remove "${doc.title}"?`)) {
                                try {
                                  await deleteDocument(doc.id);
                                  showNotification('Resource and uploaded file removed.');
                                } catch (error) {
                                  showNotification(error instanceof Error ? error.message : 'Resource could not be removed.');
                                }
                              }
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-950/40 px-2 py-1.5 text-rose-400 hover:bg-rose-900/60 cursor-pointer"
                            title="Delete resource and uploaded file"
                            aria-label={`Delete ${doc.title} and its uploaded file`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COURSES (Add & Remove) */}
      {activeTab === 'courses' && (
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              <span>Add New Course / Program</span>
            </h3>

            <form onSubmit={handleAddCourseSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Course Code (e.g. B.Tech, M.Tech, BCA)</label>
                  <input
                    type="text"
                    required
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="e.g. B.Tech"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Full Course Name</label>
                  <input
                    type="text"
                    required
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="e.g. Bachelor of Technology (CSE)"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Computer Applications">Computer Applications</option>
                    <option value="Management">Management</option>
                    <option value="Pharmacy">Pharmacy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Total Semesters</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={newCourseSemesters}
                    onChange={(e) => setNewCourseSemesters(parseInt(e.target.value) || 6)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Duration (Years)</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={newCourseDuration}
                    onChange={(e) => setNewCourseDuration(parseInt(e.target.value) || 3)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <input
                  type="text"
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="Overview of this program curriculum..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
              >
                Create Course
              </button>
            </form>
          </div>

          {/* Existing Courses */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white">Active Courses ({courses.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(c => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-400 block mb-1">{c.code}</span>
                    <h4 className="font-bold text-white text-sm">{c.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{c.totalSemesters} Semesters • {c.durationYears} Years</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete course "${c.code}" and its semesters?`)) {
                        deleteCourse(c.id);
                        showNotification(`Course ${c.code} deleted.`);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SEMESTERS (Add & Remove) */}
      {activeTab === 'semesters' && (
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              <span>Add New Semester to Course</span>
            </h3>

            <form onSubmit={handleAddSemesterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Target Course</label>
                  <select
                    value={semCourseTarget}
                    onChange={(e) => setSemCourseTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.code}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Semester Number</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={semNumber}
                    onChange={(e) => {
                      const num = parseInt(e.target.value) || 1;
                      setSemNumber(num);
                      setSemName(`Semester ${num}`);
                      setSemYear(`Year ${Math.ceil(num / 2)}`);
                    }}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Semester Name</label>
                  <input
                    type="text"
                    value={semName}
                    onChange={(e) => setSemName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={semYear}
                    onChange={(e) => setSemYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
              >
                Add Semester
              </button>
            </form>
          </div>

          {/* Existing Semesters */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white">Active Semesters ({semesters.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {semesters.map(s => {
                const c = courses.find(course => course.id === s.courseId);

                return (
                  <div key={s.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-indigo-400 font-bold block">{c?.code || s.courseId}</span>
                      <span className="text-xs font-bold text-white">{s.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${s.name}?`)) {
                          deleteSemester(s.id);
                          showNotification('Semester deleted.');
                        }
                      }}
                      className="p-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUBJECTS (Add & Remove) */}
      {activeTab === 'subjects' && (
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              <span>Add New Subject</span>
            </h3>

            <form onSubmit={handleAddSubjectSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Course</label>
                  <select
                    value={subCourseTarget}
                    onChange={(e) => {
                      setSubCourseTarget(e.target.value);
                      const sems = semesters.filter(s => s.courseId === e.target.value);
                      if (sems.length > 0) setSubSemesterTarget(sems[0].id);
                    }}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.code}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Semester</label>
                  <select
                    value={subSemesterTarget}
                    onChange={(e) => setSubSemesterTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    {subFilteredSemesters.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    placeholder="e.g. KCS-301"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">Subject Name</label>
                  <input
                    type="text"
                    required
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    placeholder="e.g. Data Structures & Algorithms"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Credits</label>
                  <input
                    type="number"
                    value={subCredits}
                    onChange={(e) => setSubCredits(parseInt(e.target.value) || 4)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={subDesc}
                  onChange={(e) => setSubDesc(e.target.value)}
                  placeholder="Key topics covered..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
              >
                Add Subject
              </button>
            </form>
          </div>

          {/* Existing Subjects */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white">Active Subjects ({subjects.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {subjects.map(sub => (
                <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-400 block mb-0.5">{sub.code}</span>
                    <h4 className="font-bold text-white text-xs">{sub.name}</h4>
                    <span className="text-[10px] text-slate-500">{sub.credits} Credits</span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete subject "${sub.code}"?`)) {
                        deleteSubject(sub.id);
                        showNotification('Subject deleted.');
                      }
                    }}
                    className="p-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MCQs (Add & Remove) */}
      {activeTab === 'mcqs' && (
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>Create Practice MCQ Question</span>
            </h3>

            <form onSubmit={handleAddMCQSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Course</label>
                  <select
                    value={mcqCourseId}
                    onChange={(e) => setMcqCourseId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.code}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Semester</label>
                  <select
                    value={mcqSemesterId}
                    onChange={(e) => setMcqSemesterId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    {semesters.filter(s => s.courseId === mcqCourseId).map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Subject</label>
                  <select
                    value={mcqSubjectId}
                    onChange={(e) => setMcqSubjectId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    {subjects.filter(sub => sub.semesterId === mcqSemesterId).map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.code} - {sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Unit</label>
                  <select
                    value={mcqUnit}
                    onChange={(e) => setMcqUnit(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="all">Full Syllabus</option>
                    <option value={1}>Unit 1</option>
                    <option value={2}>Unit 2</option>
                    <option value={3}>Unit 3</option>
                    <option value={4}>Unit 4</option>
                    <option value={5}>Unit 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Question *</label>
                <textarea
                  rows={2}
                  required
                  value={mcqQuestion}
                  onChange={(e) => setMcqQuestion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={mcqOptA}
                  onChange={(e) => setMcqOptA(e.target.value)}
                  placeholder="Option A"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                />
                <input
                  type="text"
                  required
                  value={mcqOptB}
                  onChange={(e) => setMcqOptB(e.target.value)}
                  placeholder="Option B"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                />
                <input
                  type="text"
                  value={mcqOptC}
                  onChange={(e) => setMcqOptC(e.target.value)}
                  placeholder="Option C"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                />
                <input
                  type="text"
                  value={mcqOptD}
                  onChange={(e) => setMcqOptD(e.target.value)}
                  placeholder="Option D"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Correct Answer</label>
                  <select
                    value={mcqCorrectIndex}
                    onChange={(e) => setMcqCorrectIndex(parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Explanation</label>
                  <input
                    type="text"
                    value={mcqExplanation}
                    onChange={(e) => setMcqExplanation(e.target.value)}
                    placeholder="Solution explanation..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
              >
                Save MCQ Question
              </button>
            </form>
          </div>

          {/* List MCQs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white">Active MCQs ({mcqs.length})</h3>
            <div className="space-y-3">
              {mcqs.map((m, idx) => (
                <div key={m.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span className="text-indigo-400 font-bold block mb-1">Q{idx + 1}</span>
                    <p className="text-white font-semibold">{m.question}</p>
                    <span className="text-[11px] text-emerald-400 block mt-1">
                      Correct Answer: Option {String.fromCharCode(65 + m.correctOptionIndex)} ({m.options[m.correctOptionIndex]})
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      deleteMCQ(m.id);
                      showNotification('MCQ deleted.');
                    }}
                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY & BRANDING */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Credentials */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-400" />
              <span>Configure 1 Username & 2 Passwords</span>
            </h3>

            <form onSubmit={handleUpdateSecurity} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Owner Username</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Password 1 (Primary Key)</label>
                <input
                  type="text"
                  required
                  value={newPass1}
                  onChange={(e) => setNewPass1(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Password 2 (Secondary Security Key)</label>
                <input
                  type="text"
                  required
                  value={newPass2}
                  onChange={(e) => setNewPass2(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
              >
                Update Credentials
              </button>
            </form>
          </div>

          {/* Branding */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Save className="w-5 h-5 text-indigo-400" />
              <span>Website Title & Top Notice</span>
            </h3>

            <form onSubmit={handleUpdateSite} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Website Name</label>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Tagline</label>
                <input
                  type="text"
                  value={siteTagline}
                  onChange={(e) => setSiteTagline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-bold">Top Notice Announcement</label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-indigo-400">
                    <input
                      type="checkbox"
                      checked={noticeActive}
                      onChange={(e) => setNoticeActive(e.target.checked)}
                    />
                    <span>Show Notice</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
              >
                Save Live Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
