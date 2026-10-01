import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Bookmark, 
  Eye, 
  CheckCircle, 
  HelpCircle, 
  BookOpen, 
  Filter, 
  Layers, 
  Image as ImageIcon,
  Check, 
  X, 
  Plus,
  ShieldAlert,
  FileCheck
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { DocumentType } from '../types';

interface Props {
  courseId: string;
  semesterId: string;
  subjectId: string;
}

export const SubjectContentPage: React.FC<Props> = ({ courseId, semesterId, subjectId }) => {
  const { 
    courses, 
    semesters, 
    subjects, 
    documents, 
    mcqs, 
    navigateTo, 
    goBack, 
    openDocument, 
    isBookmarked, 
    toggleBookmark,
    isOwnerLoggedIn,
    recordMCQAttempt
  } = useVault();

  // Active resource tab: 'syllabus' | 'pyq' | 'notes' | 'mcq' | 'photo'
  const [activeTab, setActiveTab] = useState<DocumentType>('syllabus');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');

  // Interactive MCQ Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  const course = courses.find(c => c.id === courseId) || courses[0];
  const semester = semesters.find(s => s.id === semesterId) || semesters[0];
  const subject = subjects.find(s => s.id === subjectId) || subjects[0];

  // Filter documents for this subject & activeTab
  const subjectDocs = documents.filter(d => 
    d.subjectId === subject.id && 
    d.type === activeTab &&
    (selectedUnit === 'all' || d.unit === selectedUnit)
  );

  // Filter MCQs for this subject
  const subjectMCQs = mcqs.filter(m => 
    m.subjectId === subject.id &&
    (selectedUnit === 'all' || m.unit === selectedUnit)
  );

  // Counts for each tab
  const allSubjectDocs = documents.filter(d => d.subjectId === subject.id);
  const syllabusCount = allSubjectDocs.filter(d => d.type === 'syllabus').length;
  const pyqCount = allSubjectDocs.filter(d => d.type === 'pyq').length;
  const notesCount = allSubjectDocs.filter(d => d.type === 'notes').length;
  const mcqCount = mcqs.filter(m => m.subjectId === subject.id).length;
  const photosCount = allSubjectDocs.filter(d => d.type === 'photo').length;

  const handleSelectOption = (mcqId: string, optionIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [mcqId]: optionIndex }));
    setShowExplanations(prev => ({ ...prev, [mcqId]: true }));
    const questionItem = mcqs.find(m => m.id === mcqId);
    if (questionItem) {
      recordMCQAttempt(questionItem.question, subject.name);
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Back Button with Single Arrow */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>Back to Subjects</span>
        </button>

        <span className="text-xs text-slate-400 font-semibold">
          Step 4 of 4 • Subject Resources
        </span>
      </div>

      {/* Subject Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {subject.code}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-medium">
                {course.code}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-medium">
                {semester.name}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-medium">
                {subject.credits} Credits
              </span>
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                <FileCheck className="w-3 h-3" />
                <span>Protected Read-Only</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {subject.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {subject.description}
            </p>
          </div>

          {/* Quick Owner shortcut if logged in */}
          {isOwnerLoggedIn && (
            <button
              onClick={() => navigateTo({ view: 'owner-dashboard' })}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-md transition-all self-start md:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>Owner: Add Resource</span>
            </button>
          )}
        </div>
      </div>

      {/* Resource Tabs (Syllabus, PYQs, Notes, MCQs, Photos) */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* Tab 1: Syllabus */}
          <button
            data-ad-trigger
            onClick={() => {
              setActiveTab('syllabus');
              setSelectedUnit('all');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'syllabus'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5" />
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                activeTab === 'syllabus' ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {syllabusCount}
              </span>
            </div>
            <div>
              <div className="font-extrabold text-sm">Syllabus</div>
              <p className={`text-[11px] ${activeTab === 'syllabus' ? 'text-indigo-100' : 'text-slate-400'}`}>
                Official marking & topics
              </p>
            </div>
          </button>

          {/* Tab 2: PYQs */}
          <button
            data-ad-trigger
            onClick={() => {
              setActiveTab('pyq');
              setSelectedUnit('all');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'pyq'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5" />
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                activeTab === 'pyq' ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {pyqCount}
              </span>
            </div>
            <div>
              <div className="font-extrabold text-sm">PYQs</div>
              <p className={`text-[11px] ${activeTab === 'pyq' ? 'text-indigo-100' : 'text-slate-400'}`}>
                Solved question papers
              </p>
            </div>
          </button>

          {/* Tab 3: Notes */}
          <button
            data-ad-trigger
            onClick={() => {
              setActiveTab('notes');
              setSelectedUnit('all');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Layers className="w-5 h-5" />
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                activeTab === 'notes' ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {notesCount}
              </span>
            </div>
            <div>
              <div className="font-extrabold text-sm">Notes</div>
              <p className={`text-[11px] ${activeTab === 'notes' ? 'text-indigo-100' : 'text-slate-400'}`}>
                Handwritten & topper sheets
              </p>
            </div>
          </button>

          {/* Tab 4: MCQs */}
          <button
            data-ad-trigger
            onClick={() => {
              setActiveTab('mcq');
              setSelectedUnit('all');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'mcq'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <HelpCircle className="w-5 h-5" />
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                activeTab === 'mcq' ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {mcqCount}
              </span>
            </div>
            <div>
              <div className="font-extrabold text-sm">MCQs</div>
              <p className={`text-[11px] ${activeTab === 'mcq' ? 'text-indigo-100' : 'text-slate-400'}`}>
                Practice quiz with solutions
              </p>
            </div>
          </button>

          {/* Tab 5: Photos & Diagrams */}
          <button
            onClick={() => {
              setActiveTab('photo');
              setSelectedUnit('all');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeTab === 'photo'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <ImageIcon className="w-5 h-5" />
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                activeTab === 'photo' ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {photosCount}
              </span>
            </div>
            <div>
              <div className="font-extrabold text-sm">Photos</div>
              <p className={`text-[11px] ${activeTab === 'photo' ? 'text-indigo-100' : 'text-slate-400'}`}>
                Diagrams & equipment charts
              </p>
            </div>
          </button>
        </div>

        {/* Unit Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2">
          <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Unit:</span>
          </span>
          <button
            onClick={() => setSelectedUnit('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              selectedUnit === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Units
          </button>
          {[1, 2, 3, 4, 5].map(u => (
            <button
              key={u}
              onClick={() => setSelectedUnit(u)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                selectedUnit === u 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Unit {u}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {/* 1. If MCQs Tab is Selected */}
      {activeTab === 'mcq' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>Practice Multiple Choice Questions ({subjectMCQs.length})</span>
            </h3>
            <span className="text-xs text-slate-400">
              Interactive View-Only Practice
            </span>
          </div>

          {subjectMCQs.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-2">
              <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No MCQs available under this unit</h4>
              <p className="text-xs text-slate-400">Check another unit or select All Units.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subjectMCQs.map((item, qIndex) => {
                const selectedAns = userAnswers[item.id];
                const isAnswered = selectedAns !== undefined;

                return (
                  <div 
                    key={item.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 select-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                          Q{qIndex + 1}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                          {item.question}
                        </h4>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded shrink-0">
                        {item.unit === 'all' ? 'Full Syllabus' : `Unit ${item.unit}`}
                      </span>
                    </div>

                    {/* 4 Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {item.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white';

                        if (isAnswered) {
                          if (optIdx === item.correctOptionIndex) {
                            btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                          } else if (optIdx === selectedAns) {
                            btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isAnswered}
                            data-ad-trigger
                            onClick={() => handleSelectOption(item.id, optIdx)}
                            className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 font-bold text-[11px] flex items-center justify-center shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>

                            {isAnswered && optIdx === item.correctOptionIndex && (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {isAnswered && optIdx === selectedAns && optIdx !== item.correctOptionIndex && (
                              <X className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Answer Explanation */}
                    {showExplanations[item.id] && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs space-y-1 mt-2">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Correct Answer: Option {String.fromCharCode(65 + item.correctOptionIndex)} ({item.options[item.correctOptionIndex]})</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          <strong>Explanation:</strong> {item.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* 2. Documents & Photos List (Syllabus, PYQs, Notes, Photos) */
        <div className="space-y-4">
          {subjectDocs.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-2">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No materials found</h4>
              <p className="text-xs text-slate-400">
                No items available under {activeTab.toUpperCase()} for this unit.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {subjectDocs.map(doc => {
                const saved = isBookmarked(doc.id);

                return (
                  <div
                    key={doc.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                  >
                    <div className="space-y-2.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {doc.type}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {doc.attachments && doc.attachments.length > 1
                            ? `${doc.attachments.length} FILES`
                            : doc.fileFormat.toUpperCase()}
                        </span>
                        {doc.unit !== 'all' ? (
                          <span className="text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded">
                            Unit {doc.unit}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                            Full Syllabus
                          </span>
                        )}
                        <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          View Only
                        </span>
                      </div>

                      <h3
                        onClick={() => openDocument(doc)}
                        data-ad-trigger={['syllabus', 'pyq', 'notes'].includes(doc.type) ? '' : undefined}
                        className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        {doc.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                        {doc.summary}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                        <span>By {doc.author}</span>
                        <span>•</span>
                        <span>{doc.pagesCount} Pages</span>
                        <span>•</span>
                        <span>{doc.fileSize}</span>
                        <span>•</span>
                        <span>{doc.viewsCount} views</span>
                      </div>
                    </div>

                    {/* View Only Action - NO DOWNLOAD BUTTONS */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                      <button
                        onClick={() => openDocument(doc)}
                        data-ad-trigger={['syllabus', 'pyq', 'notes'].includes(doc.type) ? '' : undefined}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View / Read</span>
                      </button>

                      <button
                        onClick={() => toggleBookmark(doc.id)}
                        className={`p-2.5 rounded-xl cursor-pointer transition-colors border ${
                          saved 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                            : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                        }`}
                        title={saved ? "Remove bookmark" : "Save resource"}
                      >
                        <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
