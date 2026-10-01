import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Course, 
  Semester, 
  Subject, 
  StudyDocument, 
  MCQQuestion,
  SiteConfig, 
  OwnerCredentials,
  ViewState,
  VisitorActivity,
  AnalyticsData,
  NoticeItem
} from '../types';
import { INITIAL_COURSES, INITIAL_SEMESTERS, INITIAL_SUBJECTS } from '../data/courses';
import { INITIAL_DOCUMENTS } from '../data/mockDocuments';
import { INITIAL_MCQS } from '../data/mockMCQs';
import { INITIAL_SITE_CONFIG, INITIAL_OWNER_CREDENTIALS, INITIAL_NOTICES } from '../data/site';
import { getVisitorId, sendAnalyticsEvent } from '../analytics';

interface VaultContextType {
  courses: Course[];
  semesters: Semester[];
  subjects: Subject[];
  documents: StudyDocument[];
  mcqs: MCQQuestion[];
  siteConfig: SiteConfig;
  notices: NoticeItem[];
  activeNotice: NoticeItem | null;
  ownerCredentials: OwnerCredentials;
  contentSyncStatus: 'loading' | 'local' | 'saving' | 'saved' | 'error';
  isOwnerLoggedIn: boolean;
  bookmarks: string[];
  viewState: ViewState;
  selectedDocument: StudyDocument | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Notice Management (Owner Control)
  addNotice: (text: string, badgeText: string) => void;
  deleteNotice: (id: string) => void;
  toggleNoticeActive: (id: string) => void;

  // Analytics & Activity Tracking
  analytics: AnalyticsData;
  trackActivity: (action: VisitorActivity['action'], title: string, details: string) => void;
  recordMCQAttempt: (question: string, subjectName: string) => void;
  clearAnalyticsHistory: () => Promise<void>;

  // Navigation
  navigateTo: (viewState: ViewState) => void;
  goBack: () => void;
  openDocument: (doc: StudyDocument) => void;
  closeDocument: () => void;
  
  // Bookmarks
  toggleBookmark: (docId: string) => void;
  isBookmarked: (docId: string) => boolean;

  // Owner Authentication (1 Username + 2 Passwords)
  loginOwner: (username: string, pass1: string, pass2: string) => Promise<boolean>;
  logoutOwner: () => void;
  updateOwnerCredentials: (creds: OwnerCredentials) => Promise<void>;

  // Full Owner Content CRUD
  addCourse: (course: Omit<Course, 'id'>) => void;
  deleteCourse: (courseId: string) => void;

  addSemester: (semester: Omit<Semester, 'id'>) => void;
  deleteSemester: (semesterId: string) => void;

  addSubject: (subject: Omit<Subject, 'id'>) => void;
  deleteSubject: (subjectId: string) => void;

  addDocument: (doc: Omit<StudyDocument, 'id' | 'viewsCount' | 'uploadDate'>) => void;
  updateDocument: (id: string, updates: Partial<Pick<StudyDocument, 'courseId' | 'semesterId' | 'subjectId' | 'type'>>) => void;
  deleteDocument: (id: string) => Promise<void>;
  
  addMCQ: (mcq: Omit<MCQQuestion, 'id'>) => void;
  deleteMCQ: (id: string) => void;

  updateSiteConfig: (config: Partial<SiteConfig>) => void;
  resetToDefaults: () => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COURSES: 'studyvault_courses_v3',
  SEMESTERS: 'studyvault_semesters_v3',
  SUBJECTS: 'studyvault_subjects_v3',
  DOCUMENTS: 'studyvault_documents_v3',
  MCQS: 'studyvault_mcqs_v3',
  CONFIG: 'studyvault_config_v3',
  NOTICES: 'studyvault_notices_v1',
  CREDENTIALS: 'studyvault_owner_creds_v3',
  OWNER_AUTH: 'studyvault_is_owner_v3',
  BOOKMARKS: 'studyvault_bookmarks_v3',
  ANALYTICS: 'studyvault_analytics_v1',
};

interface SharedContent {
  courses: Course[];
  semesters: Semester[];
  subjects: Subject[];
  documents: StudyDocument[];
  mcqs: MCQQuestion[];
  siteConfig: SiteConfig;
  notices: NoticeItem[];
}

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COURSES;
  });

  const [semesters, setSemesters] = useState<Semester[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SEMESTERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SEMESTERS;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SUBJECTS;
  });

  const [documents, setDocuments] = useState<StudyDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DOCUMENTS;
  });

  const [mcqs, setMcqs] = useState<MCQQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MCQS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MCQS;
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SITE_CONFIG;
  });

  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_NOTICES;
  });

  const [ownerCredentials, setOwnerCredentials] = useState<OwnerCredentials>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_OWNER_CREDENTIALS;
  });

  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.OWNER_AUTH) === 'true';
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['doc-dsa-u1-notes', 'doc-dsa-pyq-2025'];
  });

  // Visitor Tracking & Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => {
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      totalDocumentViews: 0,
      totalMCQAttempts: 0,
      activities: []
    };
  });

  const [viewState, setViewState] = useState<ViewState>({ view: 'courses' });
  const [selectedDocument, setSelectedDocument] = useState<StudyDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentSyncStatus, setContentSyncStatus] = useState<VaultContextType['contentSyncStatus']>('loading');
  const [sharedContentReady, setSharedContentReady] = useState(false);
  const hasSharedContent = useRef(false);
  const sharedContentSnapshot = useRef<string | null>(null);
  const contentSaveQueue = useRef<Promise<void>>(Promise.resolve());

  const applySharedContent = (content: SharedContent) => {
    const snapshot = JSON.stringify(content);
    if (sharedContentSnapshot.current === snapshot) return;
    sharedContentSnapshot.current = snapshot;
    hasSharedContent.current = true;
    setCourses(content.courses);
    setSemesters(content.semesters);
    setSubjects(content.subjects);
    setDocuments(content.documents);
    setMcqs(content.mcqs);
    setSiteConfig(content.siteConfig);
    setNotices(content.notices);
    setContentSyncStatus('saved');
  };

  // Active Notice (first active item)
  const activeNotice = notices.find(n => n.isActive) || null;

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEMESTERS, JSON.stringify(semesters));
  }, [semesters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MCQS, JSON.stringify(mcqs));
  }, [mcqs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(ownerCredentials));
  }, [ownerCredentials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OWNER_AUTH, isOwnerLoggedIn ? 'true' : 'false');
  }, [isOwnerLoggedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    let cancelled = false;
    const loadSharedContent = async () => {
      try {
        const response = await fetch('/api/content', { cache: 'no-store' });
        if (!response.ok) throw new Error('Shared content could not be loaded.');
        const { content } = await response.json() as { content: SharedContent | null };
        if (cancelled) return;
        if (content) {
          applySharedContent(content);
        } else {
          setContentSyncStatus('local');
        }
      } catch {
        if (!cancelled) setContentSyncStatus('error');
      } finally {
        if (!cancelled) setSharedContentReady(true);
      }
    };

    void loadSharedContent();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sharedContentReady || isOwnerLoggedIn) return;
    let cancelled = false;

    const refreshSharedContent = async () => {
      try {
        const response = await fetch('/api/content', { cache: 'no-store' });
        if (!response.ok) return;
        const { content } = await response.json() as { content: SharedContent | null };
        if (!cancelled && content) applySharedContent(content);
      } catch {}
    };

    const intervalId = window.setInterval(refreshSharedContent, 5000);
    window.addEventListener('focus', refreshSharedContent);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshSharedContent);
    };
  }, [sharedContentReady, isOwnerLoggedIn]);

  useEffect(() => {
    if (!isOwnerLoggedIn || !sharedContentReady || !hasSharedContent.current) return;
    let cancelled = false;
    const content: SharedContent = { courses, semesters, subjects, documents, mcqs, siteConfig, notices };
    setContentSyncStatus('saving');

    contentSaveQueue.current = contentSaveQueue.current
      .catch(() => {})
      .then(async () => {
        const response = await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(content)
        });
        if (!response.ok) throw new Error('Shared content could not be saved.');
        if (!cancelled) setContentSyncStatus('saved');
      })
      .catch(() => {
        if (!cancelled) setContentSyncStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [courses, semesters, subjects, documents, mcqs, siteConfig, notices, isOwnerLoggedIn, sharedContentReady]);

  // Record one anonymous browsing session per tab.
  useEffect(() => {
    if (isOwnerLoggedIn) return;
    try {
      if (sessionStorage.getItem('studyvault_visit_recorded_v1')) return;
      sessionStorage.setItem('studyvault_visit_recorded_v1', 'true');
    } catch {}

    void sendAnalyticsEvent({
      action: 'PAGE_VISIT',
      title: 'Visitor opened the website',
      details: 'Landed on the StudyVault course directory'
    });
  }, [isOwnerLoggedIn]);

  useEffect(() => {
    if (!isOwnerLoggedIn) return;
    let cancelled = false;

    const refreshAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (response.status === 401) {
          setIsOwnerLoggedIn(false);
          return;
        }
        if (!response.ok) return;
        const data = await response.json() as AnalyticsData;
        if (!cancelled) setAnalytics(data);
      } catch {}
    };

    void refreshAnalytics();
    const intervalId = window.setInterval(refreshAnalytics, 3000);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isOwnerLoggedIn]);

  // Keyboard shortcut to open Owner Login: Ctrl + Shift + O or Alt + O
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'O' || e.key === 'o')) {
        e.preventDefault();
        setViewState({ view: isOwnerLoggedIn ? 'owner-dashboard' : 'owner-login' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOwnerLoggedIn]);

  // Notice Management Methods
  const addNotice = (text: string, badgeText: string) => {
    const newNotice: NoticeItem = {
      id: `notice-${Date.now()}`,
      text: text.trim(),
      badgeText: badgeText.trim() || 'Notice',
      date: new Date().toISOString().split('T')[0],
      isActive: true
    };
    // Make new notice active and uncheck others if preferred, or keep multiple
    setNotices(prev => [newNotice, ...prev]);
    // Also sync siteConfig announcement text
    setSiteConfig(prev => ({
      ...prev,
      announcementText: text.trim(),
      isAnnouncementActive: true
    }));
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const toggleNoticeActive = (id: string) => {
    setNotices(prev => prev.map(n => {
      if (n.id === id) {
        const nextState = !n.isActive;
        if (nextState) {
          setSiteConfig(c => ({ ...c, announcementText: n.text, isAnnouncementActive: true }));
        }
        return { ...n, isActive: nextState };
      }
      return n;
    }));
  };

  // Activity tracking helper
  const trackActivity = (action: VisitorActivity['action'], title: string, details: string) => {
    if (isOwnerLoggedIn) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const newAct: VisitorActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      visitorId: getVisitorId(),
      timestamp: new Date().toISOString(),
      action,
      title,
      details,
      deviceType: isMobile ? 'Mobile' : 'Desktop'
    };

    void sendAnalyticsEvent({ action, title, details });
    setAnalytics(prev => ({
      ...prev,
      activities: [newAct, ...prev.activities.slice(0, 49)]
    }));
  };

  const recordMCQAttempt = (question: string, subjectName: string) => {
    trackActivity('MCQ_PRACTICE', `Practiced MCQ in ${subjectName}`, `Question: "${question.substring(0, 60)}..."`);
    setAnalytics(prev => ({
      ...prev,
      totalMCQAttempts: prev.totalMCQAttempts + 1
    }));
  };

  const clearAnalyticsHistory = async (): Promise<void> => {
    const response = await fetch('/api/analytics', { method: 'DELETE' });
    if (!response.ok) throw new Error('Analytics history could not be cleared.');
    setAnalytics(await response.json() as AnalyticsData);
  };

  // Navigation handlers
  const navigateTo = (newView: ViewState) => {
    if (newView.view === 'courses') {
      trackActivity('COURSE_VISIT', 'Browsing All Courses', 'Viewed course catalog');
    } else if (newView.view === 'semesters') {
      const c = courses.find(course => course.id === newView.courseId);
      trackActivity('SEMESTER_VISIT', `Selected ${c?.code || newView.courseId}`, `Browsing semesters list`);
    } else if (newView.view === 'subjects') {
      const c = courses.find(course => course.id === newView.courseId);
      const s = semesters.find(sem => sem.id === newView.semesterId);
      trackActivity('SUBJECT_VISIT', `Opened ${c?.code || ''} ${s?.name || ''}`, 'Viewing available curriculum subjects');
    } else if (newView.view === 'subject-content') {
      const sub = subjects.find(subject => subject.id === newView.subjectId);
      trackActivity('SUBJECT_VISIT', `Opened Subject: ${sub?.code || ''} - ${sub?.name || ''}`, 'Viewing Syllabus, PYQs, Notes & MCQs');
    }

    setViewState(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    switch (viewState.view) {
      case 'subject-content':
        navigateTo({
          view: 'subjects',
          courseId: viewState.courseId,
          semesterId: viewState.semesterId
        });
        break;
      case 'subjects':
        navigateTo({
          view: 'semesters',
          courseId: viewState.courseId
        });
        break;
      case 'semesters':
        navigateTo({ view: 'courses' });
        break;
      case 'bookmarks':
      case 'owner-login':
      case 'owner-dashboard':
        navigateTo({ view: 'courses' });
        break;
      default:
        navigateTo({ view: 'courses' });
        break;
    }
  };

  const openDocument = (doc: StudyDocument) => {
    setSelectedDocument(doc);
    setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, viewsCount: d.viewsCount + 1 } : d));
    trackActivity('DOCUMENT_VIEW', `Opened ${doc.type.toUpperCase()}: ${doc.title}`, `Opened in reader: ${doc.fileName || doc.title} (${doc.fileFormat.toUpperCase()})`);
    setAnalytics(prev => ({
      ...prev,
      totalDocumentViews: prev.totalDocumentViews + 1
    }));
  };

  const closeDocument = () => {
    setSelectedDocument(null);
  };

  const toggleBookmark = (docId: string) => {
    setBookmarks(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const isBookmarked = (docId: string) => bookmarks.includes(docId);

  const loginOwner = async (username: string, pass1: string, pass2: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/owner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, passwordPrimary: pass1, passwordSecondary: pass2 })
      });
      if (!response.ok) return false;

      const contentResponse = await fetch('/api/content', { cache: 'no-store' });
      if (contentResponse.ok) {
        const { content } = await contentResponse.json() as { content: SharedContent | null };
        if (content) {
          applySharedContent(content);
        } else {
          const legacyContent: SharedContent = { courses, semesters, subjects, documents, mcqs, siteConfig, notices };
          const migrationResponse = await fetch('/api/content', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(legacyContent)
          });
          if (!migrationResponse.ok) throw new Error('Your existing owner content could not be published.');
          applySharedContent(legacyContent);
        }
        setSharedContentReady(true);
      } else {
        setContentSyncStatus('error');
      }

      setIsOwnerLoggedIn(true);
      navigateTo({ view: 'owner-dashboard' });
      return true;
    } catch {
      return false;
    }
  };

  const logoutOwner = () => {
    void fetch('/api/owner/logout', { method: 'POST' }).catch(() => {});
    setIsOwnerLoggedIn(false);
    if (viewState.view === 'owner-dashboard') {
      navigateTo({ view: 'courses' });
    }
  };

  const updateOwnerCredentials = async (creds: OwnerCredentials): Promise<void> => {
    const response = await fetch('/api/owner/credentials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds)
    });
    if (!response.ok) throw new Error('Owner credentials could not be saved.');
    setOwnerCredentials(creds);
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourseId = `course-${Date.now()}`;
    const newCourse: Course = { ...courseData, id: newCourseId };
    setCourses(prev => [...prev, newCourse]);

    const generatedSemesters: Semester[] = Array.from({ length: courseData.totalSemesters }, (_, i) => ({
      id: `${newCourseId}-sem${i + 1}`,
      courseId: newCourseId,
      semesterNumber: i + 1,
      name: `Semester ${i + 1}`,
      academicYear: `Year ${Math.ceil((i + 1) / 2)}`
    }));
    setSemesters(prev => [...prev, ...generatedSemesters]);
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setSemesters(prev => prev.filter(s => s.courseId !== courseId));
    setSubjects(prev => prev.filter(sub => sub.courseId !== courseId));
    setDocuments(prev => prev.filter(d => d.courseId !== courseId));
    setMcqs(prev => prev.filter(m => m.courseId !== courseId));
  };

  const addSemester = (semData: Omit<Semester, 'id'>) => {
    const newSem: Semester = {
      ...semData,
      id: `sem-${Date.now()}`
    };
    setSemesters(prev => [...prev, newSem]);
  };

  const deleteSemester = (semesterId: string) => {
    setSemesters(prev => prev.filter(s => s.id !== semesterId));
    setSubjects(prev => prev.filter(sub => sub.semesterId !== semesterId));
    setDocuments(prev => prev.filter(d => d.semesterId !== semesterId));
    setMcqs(prev => prev.filter(m => m.semesterId !== semesterId));
  };

  const addSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSub: Subject = {
      ...subjectData,
      id: `sub-${Date.now()}`
    };
    setSubjects(prev => [...prev, newSub]);
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    setDocuments(prev => prev.filter(d => d.subjectId !== subjectId));
    setMcqs(prev => prev.filter(m => m.subjectId !== subjectId));
  };

  const addDocument = (docData: Omit<StudyDocument, 'id' | 'viewsCount' | 'uploadDate'>) => {
    const newDoc: StudyDocument = {
      ...docData,
      id: `doc-${crypto.randomUUID()}`,
      viewsCount: 1,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const updateDocument = (id: string, updates: Partial<Pick<StudyDocument, 'courseId' | 'semesterId' | 'subjectId' | 'type'>>) => {
    setDocuments(prev => prev.map(document => document.id === id ? { ...document, ...updates } : document));
  };

  const deleteDocument = async (id: string) => {
    const document = documents.find(item => item.id === id);
    const uploadedFileUrls = new Set([
      document?.fileUrl,
      ...(document?.attachments?.map(attachment => attachment.fileUrl) || [])
    ].filter((fileUrl): fileUrl is string => Boolean(fileUrl?.startsWith('/api/uploads/'))));
    for (const fileUrl of uploadedFileUrls) {
      const response = await fetch(fileUrl, { method: 'DELETE' });
      if (!response.ok) throw new Error('An attached uploaded file could not be removed from storage.');
    }
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
    }
  };

  const addMCQ = (mcqData: Omit<MCQQuestion, 'id'>) => {
    const newMCQ: MCQQuestion = {
      ...mcqData,
      id: `mcq-${Date.now()}`
    };
    setMcqs(prev => [...prev, newMCQ]);
  };

  const deleteMCQ = (id: string) => {
    setMcqs(prev => prev.filter(m => m.id !== id));
  };

  const updateSiteConfig = (updated: Partial<SiteConfig>) => {
    setSiteConfig(prev => ({ ...prev, ...updated }));
  };

  const resetToDefaults = () => {
    setCourses(INITIAL_COURSES);
    setSemesters(INITIAL_SEMESTERS);
    setSubjects(INITIAL_SUBJECTS);
    setDocuments(INITIAL_DOCUMENTS);
    setMcqs(INITIAL_MCQS);
    setSiteConfig(INITIAL_SITE_CONFIG);
    setNotices(INITIAL_NOTICES);
    setOwnerCredentials(INITIAL_OWNER_CREDENTIALS);
    setBookmarks(['doc-dsa-u1-notes', 'doc-dsa-pyq-2025']);
    setAnalytics({
      totalVisits: 0,
      uniqueVisitors: 0,
      totalDocumentViews: 0,
      totalMCQAttempts: 0,
      activities: []
    });
    localStorage.clear();
  };

  return (
    <VaultContext.Provider
      value={{
        courses,
        semesters,
        subjects,
        documents,
        mcqs,
        siteConfig,
        notices,
        activeNotice,
        addNotice,
        deleteNotice,
        toggleNoticeActive,
        ownerCredentials,
        contentSyncStatus,
        isOwnerLoggedIn,
        bookmarks,
        viewState,
        selectedDocument,
        searchQuery,
        setSearchQuery,
        analytics,
        trackActivity,
        recordMCQAttempt,
        clearAnalyticsHistory,
        navigateTo,
        goBack,
        openDocument,
        closeDocument,
        toggleBookmark,
        isBookmarked,
        loginOwner,
        logoutOwner,
        updateOwnerCredentials,
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
        updateSiteConfig,
        resetToDefaults
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
