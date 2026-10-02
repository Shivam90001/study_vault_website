import React from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  Layers,
  Laptop,
  Code,
  Terminal,
  Briefcase,
  TrendingUp,
  Pill,
  Stethoscope
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { Course } from '../types';

const ICON_MAP: Record<string, React.ElementType> = {
  Laptop,
  Code,
  Terminal,
  Briefcase,
  TrendingUp,
  Pill,
  Stethoscope
};

export const SelectCoursePage: React.FC = () => {
  const { courses, navigateTo } = useVault();

  return (
    <div className="space-y-10 py-8">
      {/* Page Title & Instructions */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <span>Step 1 of 4 • Course Selection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Select Your Course
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Choose your academic program to explore semester syllabus, previous year question papers (PYQs), handwritten topper notes, and practice MCQs.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: Course) => {
          const IconComponent = ICON_MAP[course.icon] || BookOpen;

          return (
            <div
              key={course.id}
              onClick={() => navigateTo({ view: 'semesters', courseId: course.id })}
              className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-indigo-600/20 text-indigo-400 flex items-center justify-center transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                    {course.category}
                  </span>
                </div>

                <div className="font-mono text-sm font-extrabold text-indigo-400 mb-1">
                  {course.code}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {course.name}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                  {course.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="text-slate-400 font-medium">
                  <span className="text-slate-200">{course.totalSemesters} Semesters</span>
                  <span className="mx-2">•</span>
                  <span>{course.durationYears} Years</span>
                </div>

                <span className="font-bold text-indigo-400 group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
                  Select <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
