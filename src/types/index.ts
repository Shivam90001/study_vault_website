export type DocumentType = 'syllabus' | 'pyq' | 'notes' | 'mcq' | 'photo';
export type FileFormat = string;

export interface UploadedAttachment {
  fileName: string;
  fileUrl: string;
  fileMimeType: string;
  fileFormat: FileFormat;
  fileSize: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  durationYears: number;
  totalSemesters: number;
  category: 'Engineering' | 'Computer Applications' | 'Management' | 'Pharmacy';
  icon: string;
}

export interface Semester {
  id: string;
  courseId: string;
  semesterNumber: number;
  name: string;
  academicYear: string;
}

export interface Subject {
  id: string;
  courseId: string;
  semesterId: string;
  code: string;
  name: string;
  credits: number;
  description: string;
  unitsCount: number;
}

export interface MCQQuestion {
  id: string;
  subjectId: string;
  courseId: string;
  semesterId: string;
  unit: number | 'all';
  question: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  explanation: string;
}

export interface StudyDocument {
  id: string;
  title: string;
  courseId: string;
  semesterId: string;
  subjectId: string;
  type: DocumentType;
  unit: number | 'all';
  fileFormat: FileFormat;
  fileName?: string;
  fileDataUrl?: string;
  fileUrl?: string;
  fileMimeType?: string;
  attachments?: UploadedAttachment[];
  fileSize: string;
  pagesCount: number;
  author: string;
  authorCollege?: string;
  viewsCount: number;
  uploadDate: string;
  tags: string[];
  summary: string;
  keyTopics?: string[];
  imageUrl?: string;
  previewPages?: Array<{
    pageNumber: number;
    title: string;
    content: string[];
    formula?: string;
    diagramNote?: string;
  }>;
}

export interface NoticeItem {
  id: string;
  text: string;
  date: string;
  badgeText: string;
  isActive: boolean;
}

export interface VisitorActivity {
  id: string;
  visitorId?: string;
  timestamp: string;
  action: 'PAGE_VISIT' | 'COURSE_VISIT' | 'SEMESTER_VISIT' | 'SUBJECT_VISIT' | 'DOCUMENT_VIEW' | 'MCQ_PRACTICE';
  title: string;
  details: string;
  deviceType: 'Mobile' | 'Desktop';
}

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  totalDocumentViews: number;
  totalMCQAttempts: number;
  activities: VisitorActivity[];
}

export interface OwnerCredentials {
  username: string;
  passwordPrimary: string;
  passwordSecondary: string;
}

export interface SiteConfig {
  siteName: string;
  siteTagline: string;
  announcementText: string;
  isAnnouncementActive: boolean;
}

export type ViewState = 
  | { view: 'courses' }
  | { view: 'semesters'; courseId: string }
  | { view: 'subjects'; courseId: string; semesterId: string }
  | { view: 'subject-content'; courseId: string; semesterId: string; subjectId: string }
  | { view: 'bookmarks' }
  | { view: 'owner-login' }
  | { view: 'owner-dashboard' };
