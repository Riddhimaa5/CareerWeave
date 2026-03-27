import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Briefcase, Target, Sparkles, Loader2, Clock, BarChart, X, ChevronRight, Layers } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  skills: string[];
  time: string;
  difficulty: string;
}

interface Path {
  label: string;
  description: string;
  steps: Step[];
}

export default function App() {
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paths, setPaths] = useState<Path[]>([]);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRole.trim() || !targetRole.trim()) return;

    setIsLoading(true);
    setError('');
    setPaths([]);

    try {
      const res = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentRole, targetRole }),
      });

      if (!res.ok) throw new Error('Failed to generate paths');
      
      const data = await res.json();
      setPaths(data);
    } catch (err) {
      setError('Oops! Our AI got tangled. Please try weaving again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-900/20 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
            <span className="text-sm font-medium tracking-wide text-zinc-300">CareerWeave AI</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent"
          >
            Design your destiny.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400"
          >
            Enter your starting point and your ultimate goal. We'll weave the optimal paths to get you there.
          </motion.p>
        </div>

        {/* Input Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleGenerate}
          className="relative max-w-4xl mx-auto bg-white/5 border border-white/10 p-3 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-3"
        >
          <div className="flex-1 flex items-center w-full bg-black/40 rounded-2xl px-5 py-4 border border-white/5 focus-within:border-indigo-500/50 focus-within:bg-black/60 transition-all">
            <Briefcase className="w-5 h-5 text-indigo-400 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Current Role (e.g. Barista)"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 text-lg"
              required
            />
          </div>
          
          <div className="hidden md:flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10">
            <ArrowRight className="w-5 h-5 text-zinc-500" />
          </div>

          <div className="flex-1 flex items-center w-full bg-black/40 rounded-2xl px-5 py-4 border border-white/5 focus-within:border-fuchsia-500/50 focus-within:bg-black/60 transition-all">
            <Target className="w-5 h-5 text-fuchsia-400 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Target Role (e.g. UX Designer)"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 text-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !currentRole || !targetRole}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/25"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              'Weave Path'
            )}
          </button>
        </motion.form>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-16 flex flex-col items-center justify-center text-zinc-400"
            >
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-r-2 border-fuchsia-500 animate-spin animation-delay-150" />
                <div className="absolute inset-4 rounded-full border-b-2 border-white/20 animate-spin animation-delay-300" />
              </div>
              <p className="text-lg font-medium animate-pulse">Weaving your career paths... 🔄</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center text-red-400 bg-red-400/10 py-4 px-6 rounded-2xl max-w-lg mx-auto border border-red-400/20 backdrop-blur-md"
          >
            {error}
          </motion.div>
        )}

        {/* Results Grid */}
        <AnimatePresence>
          {paths.length > 0 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {paths.map((path, pathIdx) => (
                <motion.div 
                  key={pathIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pathIdx * 0.15 }}
                  className="flex flex-col"
                >
                  {/* Path Header */}
                  <div className="mb-8 p-6 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-white mb-2">{path.label}</h2>
                    <p className="text-sm text-zinc-400 leading-relaxed">{path.description}</p>
                  </div>

                  {/* Path Timeline */}
                  <div className="relative flex-1 pl-6">
                    {/* Continuous Line */}
                    <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-indigo-500/50 via-fuchsia-500/30 to-transparent rounded-full" />

                    <div className="space-y-8">
                      {path.steps.map((step, stepIdx) => {
                        const isFirst = stepIdx === 0;
                        const isLast = stepIdx === path.steps.length - 1;

                        return (
                          <div key={stepIdx} className="relative">
                            {/* Node Dot */}
                            <div className={`absolute -left-[31px] top-5 w-4 h-4 rounded-full border-4 border-[#030303] ${isFirst ? 'bg-indigo-400' : isLast ? 'bg-fuchsia-400' : 'bg-zinc-600'}`} />

                            {/* Step Card */}
                            <motion.div 
                              whileHover={{ scale: 1.02, y: -4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedStep(step)}
                              className="group cursor-pointer p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 backdrop-blur-sm transition-all shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
                                  {step.title}
                                </h3>
                                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors shrink-0 ml-2" />
                              </div>
                              <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                                {step.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                                <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5" /> {step.time}</span>
                                <span className="flex items-center"><BarChart className="w-3.5 h-3.5 mr-1.5" /> {step.difficulty}</span>
                              </div>
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedStep && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStep(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-4"
            >
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Modal Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-indigo-500/20 blur-[60px] pointer-events-none" />
                
                <button 
                  onClick={() => setSelectedStep(null)}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="relative z-10">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-4">
                    Role Details
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{selectedStep.title}</h2>
                  <p className="text-zinc-300 leading-relaxed mb-8 text-sm md:text-base">
                    {selectedStep.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center text-zinc-500 mb-2 text-sm">
                        <Clock className="w-4 h-4 mr-2" /> Estimated Time
                      </div>
                      <div className="font-semibold text-zinc-100">{selectedStep.time}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center text-zinc-500 mb-2 text-sm">
                        <BarChart className="w-4 h-4 mr-2" /> Difficulty
                      </div>
                      <div className="font-semibold text-zinc-100">{selectedStep.difficulty}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                      <Layers className="w-4 h-4 mr-2" /> Key Skills Required
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStep.skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-200 shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
