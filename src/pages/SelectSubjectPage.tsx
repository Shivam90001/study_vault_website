import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  ArrowRight, 
  Layers
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

interface Props {
  courseId: string;
  semesterId: string;
}

export const SelectSubjectPage: React.FC<Props> = ({ courseId, semesterId }) => {
  const { courses, semesters, subjects, navigateTo, goBack } = useVault();

  const [searchQuery, setSearchQuery] = useState('');

  const course = courses.find(c => c.id === courseId) || courses[0];
  const semester = semesters.find(s => s.id === semesterId) || semesters[0];
  const semesterSubjects = subjects.filter(s => s.semesterId === semester.id);

  const filteredSubjects = semesterSubjects.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 py-6">
      {/* Back Button with Single Arrow */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>Back to Semesters</span>
        </button>

        <span className="text-xs text-slate-400 font-semibold">
          Step 3 of 4 • Select Subject
        </span>
      </div>

      {/* Selected Semester Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md inline-block mb-2">
            {course.code} • {semester.name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Select Subject
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Choose a subject to view syllabus, solved PYQs, handwritten notes, and interactive practice MCQs.
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No subjects found</h3>
          <p className="text-xs text-slate-400">
            {searchQuery ? `No subjects match "${searchQuery}".` : 'No subjects have been added for this semester yet.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-indigo-400 hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map(sub => (
            <div
              key={sub.id}
              onClick={() => navigateTo({ 
                view: 'subject-content', 
                courseId: course.id, 
                semesterId: semester.id, 
                subjectId: sub.id 
              })}
              className="group bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="font-mono text-xs font-extrabold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {sub.code}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {sub.credits} Credits • {sub.unitsCount} Units
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                  {sub.name}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {sub.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Syllabus, PYQs, Notes & MCQs</span>
                <span className="font-bold text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
