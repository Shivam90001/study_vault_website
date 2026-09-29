import React from 'react';
import { 
  ArrowLeft, 
  Layers, 
  ArrowRight
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

interface Props {
  courseId: string;
}

export const SelectSemesterPage: React.FC<Props> = ({ courseId }) => {
  const { courses, semesters, subjects, navigateTo, goBack } = useVault();

  const course = courses.find(c => c.id === courseId) || courses[0];
  const courseSemesters = semesters.filter(s => s.courseId === course.id);

  return (
    <div className="space-y-8 py-6">
      {/* Back Button with Single Arrow */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>Back to Courses</span>
        </button>

        <span className="text-xs text-slate-400 font-semibold">
          Step 2 of 4 • Select Semester
        </span>
      </div>

      {/* Selected Course Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md inline-block">
              {course.code} • {course.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Select Semester
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Choose your semester to view subject list, official syllabus, previous year question papers, and study resources.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 text-center shrink-0">
            <div className="text-2xl font-extrabold text-white">{courseSemesters.length}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Semesters Total</div>
          </div>
        </div>
      </div>

      {/* Semesters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {courseSemesters.map(sem => {
          const semSubjects = subjects.filter(s => s.semesterId === sem.id);

          return (
            <div
              key={sem.id}
              onClick={() => navigateTo({ 
                view: 'subjects', 
                courseId: course.id, 
                semesterId: sem.id 
              })}
              className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 font-extrabold text-base flex items-center justify-center">
                    S{sem.semesterNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                    {sem.academicYear}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {sem.name}
                </h3>

                <p className="text-xs text-slate-400 mt-2">
                  {semSubjects.length > 0 ? `${semSubjects.length} Curriculum Subjects Available` : 'Materials & Syllabus'}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
                <span>Select Subjects</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
