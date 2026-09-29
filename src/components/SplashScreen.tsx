import React, { useEffect, useState, useRef } from 'react';
import { GraduationCap, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  siteName: string;
  siteTagline: string;
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ siteName, siteTagline, onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Keep latest onFinish in ref to prevent dependency re-runs
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const duration = 4000; // 4 seconds total intro duration
    const intervalTime = 40; // update every 40ms
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            setIsFadingOut(true);
            setTimeout(() => {
              onFinishRef.current();
            }, 350);
          }
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []); // Empty dependency array: runs strictly once on mount

  const handleSkip = () => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setIsFadingOut(true);
      setTimeout(() => {
        onFinishRef.current();
      }, 150);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-300 selection:bg-transparent ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-md w-full space-y-6">
        {/* Animated Brand Logo Icon */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 border border-indigo-400/30">
            <GraduationCap className="w-12 h-12 sm:w-14 sm:h-14 animate-bounce" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Academic Excellence Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              {siteName}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
            {siteTagline}
          </p>
        </div>

        {/* 4-Second Animated Progress Bar */}
        <div className="w-full max-w-xs space-y-2 pt-4">
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-75 ease-out shadow-sm shadow-indigo-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Loading Vault...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Skip button for instant entry */}
        <button
          onClick={handleSkip}
          className="text-xs text-slate-500 hover:text-indigo-400 transition-colors inline-flex items-center gap-1 pt-2 cursor-pointer font-medium"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Footer hint */}
      <div className="absolute bottom-6 text-center text-[10px] text-slate-600 font-mono tracking-wider uppercase">
        PTU & University Curriculum Notes • Protected View
      </div>
    </div>
  );
};
