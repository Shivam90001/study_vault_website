import { SiteConfig, OwnerCredentials, NoticeItem } from '../types';

export const INITIAL_SITE_CONFIG: SiteConfig = {
  siteName: 'StudyVault',
  siteTagline: 'Academic Notes, PYQs, Syllabus & MCQs Portal',
  announcementText: '2026 Updated Syllabus, Solved Previous Year Papers & Handwritten Notes are now available.',
  isAnnouncementActive: true
};

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'notice-1',
    text: '2026 Updated Syllabus, Solved Previous Year Papers & Handwritten Notes are now available.',
    date: '2026-09-29',
    badgeText: 'Notice',
    isActive: true
  },
  {
    id: 'notice-2',
    text: 'PTU Examination Solved Papers & 100-mark model papers added for B.Tech & BCA.',
    date: '2026-09-28',
    badgeText: 'Exam Update',
    isActive: false
  }
];

export const INITIAL_OWNER_CREDENTIALS: OwnerCredentials = {
  username: 'owner',
  passwordPrimary: 'vault2026',
  passwordSecondary: 'secure999'
};
