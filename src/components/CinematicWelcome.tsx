import React, { useEffect, useState } from 'react';
import { Sparkles, Sprout, ArrowRight, CheckCircle2, Globe, Trees, Sun } from 'lucide-react';
import { RegistrationPackageData } from '../types';

interface CinematicWelcomeProps {
  data: RegistrationPackageData;
  onFinish: () => void;
}

export const CinematicWelcome: React.FC<CinematicWelcomeProps> = ({ data, onFinish }) => {
  const [phase, setPhase] = useState<number>(1);
  const delegateName = data.delegate.name ? data.delegate.name.split(' ')[0] : 'Delegate';

  useEffect(() => {
    // Stage 1: Floating seed -> Stage 2: Sprout -> Stage 3: Field & Title -> Stage 4: Greeting
    const t1 = setTimeout(() => setPhase(2), 900);
    const t2 = setTimeout(() => setPhase(3), 1900);
    const t3 = setTimeout(() => setPhase(4), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF8F2] overflow-hidden text-slate-900 select-none">
      
      {/* Background Animated Gradient & Floating Seed Particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F2] via-[#F3EFE0] to-[#E9F4EC] transition-opacity duration-1000">
        <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-emerald-300/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-amber-200/25 blur-3xl animate-pulse" />
      </div>

      {/* Floating Seed Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-emerald-600/20 animate-float"
            style={{
              width: `${6 + (i % 6) * 3}px`,
              height: `${10 + (i % 6) * 4}px`,
              top: `${(i * 7) % 90}%`,
              left: `${(i * 13) % 95}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 3)}s`,
              transform: `rotate(${i * 25}deg)`,
            }}
          />
        ))}
      </div>

      {/* Center Cinematic Container */}
      <div className="relative z-10 max-w-xl mx-auto px-6 text-center space-y-6">
        
        {/* Phase 1 & 2: Seed & Growing Sprout */}
        <div className="flex flex-col items-center justify-center min-h-[140px]">
          {phase < 3 ? (
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-emerald animate-sprout">
                <Sprout className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div className="absolute -bottom-3 text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/90 px-3 py-0.5 rounded-full border border-emerald-300">
                Germinating Innovation
              </div>
            </div>
          ) : (
            /* Phase 3 & 4: Indian Agriculture & Event Identity Reveal */
            <div className="space-y-3 step-enter">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>14th Indian Seed Congress 2026</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-slate-950">
                Seed Innovations — <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600">
                  Reaching Global
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                26th–28th February 2026 • Duangjitt Resort & Spa, Phuket, Thailand
              </p>
            </div>
          )}
        </div>

        {/* Phase 4: Personalized Greeting Card */}
        {phase >= 4 && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-emerald-200/80 shadow-2xl p-6 sm:p-7 space-y-4 step-enter">
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-800">
                Official Registration Confirmed
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                Welcome, {delegateName}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                You are now confirmed for <strong>ISC 2026</strong>.
              </p>
              <div className="inline-block mt-2 font-mono font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200">
                Registration ID: {data.registrationId}
              </div>
            </div>

            {/* Launch Command Center Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={onFinish}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 shadow-emerald transition-all active:scale-98 cursor-pointer"
              >
                <span>Enter Event Command Center</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
