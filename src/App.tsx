/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { VaultProvider, useVault } from './context/VaultContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DocumentViewer } from './components/DocumentViewer';
import { SplashScreen } from './components/SplashScreen';

import { SelectCoursePage } from './pages/SelectCoursePage';
import { SelectSemesterPage } from './pages/SelectSemesterPage';
import { SelectSubjectPage } from './pages/SelectSubjectPage';
import { SubjectContentPage } from './pages/SubjectContentPage';
import { OwnerLoginPage } from './pages/OwnerLoginPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';

import { Bookmark, ArrowLeft, Eye } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    viewState, 
    navigateTo, 
    bookmarks, 
    documents, 
    openDocument, 
    toggleBookmark, 
    goBack,
    siteConfig,
    isOwnerLoggedIn
  } = useVault();

  // Intro Splash screen: show strictly ONCE per session
  const [showSplash, setShowSplash] = useState(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('studyvault_splash_seen')) {
        return false;
      }
    } catch {}
    return true;
  });
  const handleFinishSplash = useCallback(() => {
    setShowSplash(false);
    try {
      sessionStorage.setItem('studyvault_splash_seen', 'true');
    } catch {}
  }, []);

  const isOwnerView = viewState.view === 'owner-login' || viewState.view === 'owner-dashboard';

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const updateMonetagServiceWorker = async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      const monetagRegistrations = registrations.filter(registration =>
        [registration.active, registration.installing, registration.waiting].some(
          worker => worker && new URL(worker.scriptURL).pathname === '/sw.js'
        )
      );

      if (isOwnerLoggedIn || isOwnerView) {
        await Promise.all(monetagRegistrations.map(registration => registration.unregister()));
      } else {
        await navigator.serviceWorker.register('/sw.js');
      }
    };

    void updateMonetagServiceWorker().catch(error => {
      console.error('Could not update the Monetag service worker.', error);
    });
  }, [isOwnerLoggedIn, isOwnerView]);

  useEffect(() => {
    if (isOwnerLoggedIn) return;

    const adUrl = 'https://omg10.com/4/11922745';
    const handleAdClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const clickable = event.target.closest('[data-ad-trigger]');
      if (!clickable || clickable.matches(':disabled, [aria-disabled="true"]')) return;

      window.open(adUrl, '_blank', 'noopener,noreferrer');
    };

    document.addEventListener('click', handleAdClick, true);
    return () => document.removeEventListener('click', handleAdClick, true);
  }, [isOwnerLoggedIn]);

  const savedDocs = documents.filter(d => bookmarks.includes(d.id));

  return (
    <>
      {/* 4-Second Intro Screen (runs strictly once) */}
      {showSplash && (
        <SplashScreen
          siteName={siteConfig.siteName}
          siteTagline={siteConfig.siteTagline}
          onFinish={handleFinishSplash}
        />
      )}

      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page 1: Select Course */}
          {viewState.view === 'courses' && <SelectCoursePage />}

          {/* Page 2: Select Semester */}
          {viewState.view === 'semesters' && (
            <SelectSemesterPage courseId={viewState.courseId} />
          )}

          {/* Page 3: Select Subject */}
          {viewState.view === 'subjects' && (
            <SelectSubjectPage 
              courseId={viewState.courseId} 
              semesterId={viewState.semesterId} 
            />
          )}

          {/* Page 4: Subject Resources (Syllabus, PYQs, Notes, MCQs, Photos) */}
          {viewState.view === 'subject-content' && (
            <SubjectContentPage 
              courseId={viewState.courseId} 
              semesterId={viewState.semesterId} 
              subjectId={viewState.subjectId} 
            />
          )}

          {/* Owner Private Login (1 Username + 2 Passwords) */}
          {viewState.view === 'owner-login' && <OwnerLoginPage />}

          {/* Owner Private Control Center */}
          {viewState.view === 'owner-dashboard' && <OwnerDashboardPage />}

          {/* Bookmarks */}
          {viewState.view === 'bookmarks' && (
            <div className="space-y-6 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={goBack}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white cursor-pointer mb-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Bookmark className="w-6 h-6 text-amber-400 fill-amber-400" />
                    <span>Your Saved Study Resources ({savedDocs.length})</span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Saved materials for quick exam revision.
                  </p>
                </div>
              </div>

              {savedDocs.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
                  <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-white">No bookmarked notes yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click the bookmark icon on any note, syllabus, or PYQ to save it here.
                  </p>
                  <button
                    onClick={() => navigateTo({ view: 'courses' })}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Select Course
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedDocs.map(doc => (
                    <div
                      key={doc.id}
                      className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                            {doc.type}
                          </span>
                          <button
                            onClick={() => toggleBookmark(doc.id)}
                            className="text-amber-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                            title="Remove bookmark"
                          >
                            <Bookmark className="w-4 h-4 fill-amber-400" />
                          </button>
                        </div>

                        <h3 
                          onClick={() => openDocument(doc)}
                          className="text-base font-bold text-white hover:text-indigo-300 cursor-pointer line-clamp-2"
                        >
                          {doc.title}
                        </h3>

                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                          {doc.summary}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                        <div className="text-[11px] text-slate-500">
                          {doc.fileSize} • {doc.pagesCount} Pages • Protected View
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openDocument(doc)}
                            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View & Read</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>

        <Footer />

        {/* Universal Document & Photo Viewer */}
        <DocumentViewer />
      </div>
    </>
  );
};

export default function App() {
  return (
    <VaultProvider>
      <AppContent />
    </VaultProvider>
  );
}
