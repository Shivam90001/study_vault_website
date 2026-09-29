import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Bookmark, 
  ShieldCheck, 
  LogOut,
  X,
  ChevronRight,
  SlidersHorizontal,
  Lock
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const Header: React.FC = () => {
  const {
    siteConfig,
    activeNotice,
    bookmarks,
    isOwnerLoggedIn,
    logoutOwner,
    navigateTo,
    viewState,
    searchQuery,
    setSearchQuery,
    subjects,
    documents,
    openDocument
  } = useVault();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filter search results
  const searchResults = searchQuery.trim().length > 1 ? {
    subjects: subjects.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 4),
    documents: documents.filter(d => 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 5)
  } : null;

  const currentNoticeText = activeNotice?.text || siteConfig.announcementText;
  const currentBadge = activeNotice?.badgeText || 'Notice';
  const showNotice = Boolean(activeNotice?.isActive ?? siteConfig.isAnnouncementActive);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Announcement Bar */}
      {showNotice && currentNoticeText && (
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-indigo-900/60 border-b border-indigo-500/20 px-4 py-1.5 text-xs text-indigo-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="bg-indigo-500 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                {currentBadge}
              </span>
              <span className="truncate">{currentNoticeText}</span>
            </div>

            {/* Owner status badge if logged in */}
            {isOwnerLoggedIn && (
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded shrink-0 ml-2">
                Owner Mode Active
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo({ view: 'courses' })}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors block">
                {siteConfig.siteName}
              </span>
              <p className="text-[11px] text-slate-400 line-clamp-1 hidden sm:block">
                {siteConfig.siteTagline}
              </p>
            </div>
          </button>

          {/* Discreet portal key outside the brand button */}
          <button
            type="button"
            onClick={() => navigateTo({ view: isOwnerLoggedIn ? 'owner-dashboard' : 'owner-login' })}
            className="w-2 h-2 rounded-full bg-slate-800 hover:bg-indigo-500 cursor-pointer transition-colors self-start mt-2"
            title="Portal Key"
          />
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block relative">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search syllabus, notes, PYQs, subjects..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Instant Search Results Dropdown */}
          {isSearchOpen && searchResults && (
            <div 
              className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 max-h-96 overflow-y-auto"
              onMouseLeave={() => setIsSearchOpen(false)}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Search Results
                </span>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              {searchResults.subjects.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-bold text-indigo-400 mb-1">Subjects</div>
                  {searchResults.subjects.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        navigateTo({
                          view: 'subject-content',
                          courseId: s.courseId,
                          semesterId: s.semesterId,
                          subjectId: s.id
                        });
                        setIsSearchOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between group cursor-pointer"
                    >
                      <span className="text-slate-200 group-hover:text-indigo-300 font-medium">
                        {s.code}: {s.name}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                    </button>
                  ))}
                </div>
              )}

              {searchResults.documents.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-purple-400 mb-1">Materials</div>
                  {searchResults.documents.map(d => (
                    <button
                      key={d.id}
                      onClick={() => {
                        openDocument(d);
                        setIsSearchOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between group cursor-pointer"
                    >
                      <div className="truncate mr-2">
                        <span className="text-slate-200 group-hover:text-purple-300 block truncate font-medium">
                          {d.title}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase">{d.type}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {searchResults.subjects.length === 0 && searchResults.documents.length === 0 && (
                <div className="text-center py-4 text-slate-400 text-xs">
                  No matching subjects or materials found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-3">
          {/* Bookmarks */}
          <button
            onClick={() => navigateTo({ view: 'bookmarks' })}
            className={`p-2 rounded-lg relative cursor-pointer transition-colors ${
              viewState.view === 'bookmarks'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Saved Notes"
          >
            <Bookmark className="w-5 h-5" />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* If Owner is Logged In: Show Owner Control Bar */}
          {isOwnerLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTo({ view: 'owner-dashboard' })}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-3 py-2 rounded-lg cursor-pointer shadow-md shadow-emerald-600/20"
                title="Open Owner Dashboard"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Owner Dashboard</span>
                <span className="sm:hidden">Owner</span>
              </button>

              <button
                onClick={logoutOwner}
                className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 cursor-pointer transition-colors"
                title="Logout Owner"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
