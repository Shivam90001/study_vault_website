import { VisitorActivity, AnalyticsData } from '../types';

export const INITIAL_ANALYTICS: AnalyticsData = {
  totalVisits: 142,
  uniqueVisitors: 89,
  totalDocumentViews: 326,
  totalMCQAttempts: 74,
  activities: [
    {
      id: 'act-1',
      timestamp: '2 mins ago',
      action: 'DOCUMENT_VIEW',
      title: 'Read Handwritten Notes',
      details: 'Unit 1: Arrays, Address Calculation & Linked Lists (DSA)',
      deviceType: 'Mobile'
    },
    {
      id: 'act-2',
      timestamp: '8 mins ago',
      action: 'MCQ_PRACTICE',
      title: 'Practiced MCQ Quiz',
      details: 'Attempted Q1 in Operating Systems (KCS-401)',
      deviceType: 'Mobile'
    },
    {
      id: 'act-3',
      timestamp: '15 mins ago',
      action: 'DOCUMENT_VIEW',
      title: 'Viewed Solved Question Paper (PYQ)',
      details: 'DSA End-Semester Exam Paper 2025 (PTU Solved)',
      deviceType: 'Desktop'
    },
    {
      id: 'act-4',
      timestamp: '28 mins ago',
      action: 'SUBJECT_VISIT',
      title: 'Opened Subject Catalog',
      details: 'B.Tech • Semester 3 • Data Structures & Algorithms',
      deviceType: 'Mobile'
    },
    {
      id: 'act-5',
      timestamp: '42 mins ago',
      action: 'DOCUMENT_VIEW',
      title: 'Read Syllabus',
      details: 'D.Pharma Pharmaceutics Official PCI Syllabus',
      deviceType: 'Desktop'
    },
    {
      id: 'act-6',
      timestamp: '1 hour ago',
      action: 'COURSE_VISIT',
      title: 'Explored Course Semesters',
      details: 'Selected BCA - Bachelor of Computer Applications (6 Semesters)',
      deviceType: 'Mobile'
    },
    {
      id: 'act-7',
      timestamp: '2 hours ago',
      action: 'PAGE_VISIT',
      title: 'New Student Session Opened',
      details: 'Visitor landed on StudyVault Homepage (Step 1: Select Course)',
      deviceType: 'Desktop'
    }
  ]
};
