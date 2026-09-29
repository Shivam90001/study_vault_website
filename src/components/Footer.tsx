import React from 'react';
import { 
  GraduationCap, 
  Lock, 
  BookOpen, 
  Building2, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const Footer: React.FC = () => {
  const { siteConfig, navigateTo, isOwnerLoggedIn } = useVault();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white">About {siteConfig.siteName}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              StudyVault is a dedicated student academic resource portal providing view-only access to official university syllabus, solved previous year question papers (PYQs), topper handwritten notes, and interactive practice MCQs.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Strictly Non-Downloadable Protected Educational Content</span>
            </div>
          </div>

          {/* Column 2: University Resources & PTU */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>University Resources & Affiliations</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <strong className="text-white block font-semibold">PTU (I.K. Gujral Punjab Technical University)</strong>
                <span className="text-[11px] text-slate-400">Curriculum syllabus, B.Tech & BCA semester exam schemes & verified papers.</span>
              </li>
              <li className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <strong className="text-white block font-semibold">Technical & Pharmacy Councils (PCI / AICTE)</strong>
                <span className="text-[11px] text-slate-400">Standardized course outcomes, pharmacy ER-20 scheme, and management frameworks.</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Academic Resources</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-indigo-400 font-bold block mb-0.5">Syllabus</span>
                <span>Unit-wise marks weightage & topics</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-purple-400 font-bold block mb-0.5">PYQ Bank</span>
                <span>Past 5-year solved question papers</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-amber-400 font-bold block mb-0.5">Topper Notes</span>
                <span>Handwritten concise revision sheets</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-emerald-400 font-bold block mb-0.5">MCQs</span>
                <span>Self-practice with answer explanations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} {siteConfig.siteName}</span>
            <span>•</span>
            <span>PTU & University Academic Study Resources • Protected Read-Only View</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Discreet portal lock link */}
            <button
              onClick={() => navigateTo({ view: isOwnerLoggedIn ? 'owner-dashboard' : 'owner-login' })}
              className="text-slate-700 hover:text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="Secure Portal Access"
            >
              <Lock className="w-3 h-3" />
              <span>Owner Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
