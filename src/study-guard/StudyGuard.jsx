import { useState, useEffect } from "react";
import { BookOpen, Search, Cloud, Target, Brain, Coffee, Footprints, Droplets, Eye, Wind, ArrowRight, ArrowLeft, Timer, CheckCircle, X } from "lucide-react";

function Logo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" className="transition-all duration-700 origin-center" />
      <path d="M8 12h8" className="transition-all duration-500" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CircularProgress({ progress, size = 160, strokeWidth = 6, children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle 
          stroke="#f5f5f4" // stone-100
          strokeWidth={strokeWidth} 
          fill="transparent" 
          r={radius} 
          cx={size/2} 
          cy={size/2} 
        />
        {/* Progress Indicator */}
        <circle 
          stroke="#1c1917" // stone-900
          strokeWidth={strokeWidth} 
          strokeLinecap="round" 
          fill="transparent" 
          r={radius} 
          cx={size/2} 
          cy={size/2}
          style={{ 
            strokeDasharray: circumference, 
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 1s linear" 
          }}
        />
      </svg>
      {/* Centered Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function StudyGuard() {
  const [reason, setReason] = useState(null);
  const [studyGoal, setStudyGoal] = useState("");
  const [searchGoal, setSearchGoal] = useState("");
  const [step, setStep] = useState(1);
  const [breakTime, setBreakTime] = useState(300);
  const [returnMessage, setReturnMessage] = useState(null);

  const quotes = [
    "Boredom is temporary. Your goal is worth it.",
    "Just get through the next 10 minutes.",
    "You don't need motivation. You just need to start.",
    "Take a short break. Come back stronger.",
    "Future you will thank you for staying focused."
  ];

  const [quote, setQuote] = useState(quotes[0]);

  // Timer logic for break
  useEffect(() => {
    if (step !== 5) return;
    const timer = setInterval(() => {
      setBreakTime((time) => (time <= 0 ? 0 : time - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // Random quote on break start
  useEffect(() => {
    if (step === 5) {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  }, [step]);

  const minutes = Math.floor(breakTime / 60);
  const seconds = breakTime % 60;
  const breakProgress = breakTime / 300; // 5 minutes = 300s

  const PrimaryButton = ({ onClick, children, icon: Icon, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group flex items-center justify-between w-full p-4 rounded-xl text-left transition-all duration-300 border border-stone-200 
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-stone-400 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 bg-white hover:bg-stone-50"}`}
    >
      <div className="flex items-center gap-3 text-stone-700 font-medium">
        {Icon && <Icon className="w-5 h-5 text-stone-400 group-hover:text-stone-800 transition-colors duration-300 group-hover:scale-110" />}
        {children}
      </div>
      <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-600 transition-all duration-300 group-hover:translate-x-1" />
    </button>
  );

  const ActionButton = ({ onClick, children, variant = "primary", disabled = false }) => {
    const baseStyle = "px-6 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 justify-center active:scale-[0.98]";
    const variants = {
      primary: "bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/20 hover:shadow-xl hover:shadow-stone-900/30 hover:-translate-y-0.5",
      secondary: "bg-white text-stone-700 border border-stone-200 hover:border-stone-400 hover:bg-stone-50 hover:shadow-md hover:-translate-y-0.5"
    };
    return (
      <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed transform-none shadow-none' : ''}`}>
        {children}
      </button>
    );
  };

  const closeTab = () => {
    chrome.runtime.sendMessage({ type: "CLOSE_GUARD_TAB" });
  };

  const allowYouTube = () => {
    chrome.runtime.sendMessage({ type: "ALLOW_YOUTUBE" });
    const goal = reason === "study" ? studyGoal : searchGoal;
    window.location.href = "https://www.youtube.com/results?search_query=" + encodeURIComponent(goal);
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-4 font-sans antialiased text-stone-800 animate-fade-in overflow-hidden">
      
      {/* Animated gradient glow backdrop */}
      {/* Layer 1: Slowly orbiting conic gradient */}
      <div
        className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none glow-orbit"
        style={{
          background: "conic-gradient(from 0deg, transparent, rgba(180,160,130,0.15) 90deg, transparent 180deg, rgba(130,150,180,0.12) 270deg, transparent)",
        }}
      />

      {/* Layer 2: Primary breathing blob — warm tone, top-left */}
      <div
        className="absolute top-[15%] left-[20%] w-96 h-96 rounded-full blur-[80px] pointer-events-none glow-breathe"
        style={{
          background: "radial-gradient(circle, rgba(200,170,120,0.35) 0%, rgba(180,150,100,0.1) 50%, transparent 70%)",
        }}
      />

      {/* Layer 3: Secondary breathing blob — cool tone, bottom-right, slower */}
      <div
        className="absolute bottom-[10%] right-[15%] w-[420px] h-[420px] rounded-full blur-[80px] pointer-events-none glow-breathe-slow"
        style={{
          background: "radial-gradient(circle, rgba(120,150,200,0.25) 0%, rgba(100,130,180,0.08) 50%, transparent 70%)",
        }}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-stone-50 border-b border-stone-100 p-6 flex items-center gap-3 shrink-0">
          <div className="group bg-stone-900 p-2.5 rounded-xl text-white shadow-sm transition-transform duration-500 hover:rotate-12 cursor-default">
            <Logo className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div>
            <h1 className="font-semibold text-stone-900 leading-tight">Study Guard</h1>
            <p className="text-xs text-stone-500 font-medium tracking-wide uppercase mt-0.5">Focus Mode</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto">
          
          {/* Step 1: Reason */}
          {step === 1 && (
            <div className="animate-slide-up">
              <h2 className="text-xl font-semibold mb-6 tracking-tight">Why are you opening YouTube?</h2>
              <div className="space-y-3.5">
                <PrimaryButton onClick={() => { setReason("study"); setStep(2); }} icon={BookOpen}>
                  I have something specific to study
                </PrimaryButton>
                <PrimaryButton onClick={() => { setReason("search"); setStep(2); }} icon={Search}>
                  I need to clarify something related to my studies
                </PrimaryButton>
                <PrimaryButton onClick={() => { setReason("bored"); setStep(4); }} icon={Cloud}>
                  I'm bored and want to scroll
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* Step 2: Goal Input */}
          {step === 2 && (reason === "study" || reason === "search") && (
            <div className="animate-slide-up">
              <button onClick={() => setStep(1)} className="group text-stone-400 hover:text-stone-700 mb-6 transition-colors flex items-center gap-1.5 text-sm font-medium">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
              </button>
              
              <h2 className="text-xl font-semibold mb-2 tracking-tight">
                {reason === "study" ? "What exactly do you want to study?" : "What do you need to clarify?"}
              </h2>
              <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                {reason === "study" ? "Define a clear, actionable goal for this session to stay on track." : "What specific concept are you trying to understand right now?"}
              </p>
              
              <div className="relative mb-8 group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-stone-900 text-stone-400">
                  <Target className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  autoFocus
                  placeholder={reason === "study" ? "e.g., Learn React useEffect" : "e.g., Why does Newton-Raphson converge?"}
                  value={reason === "study" ? studyGoal : searchGoal}
                  onChange={(e) => reason === "study" ? setStudyGoal(e.target.value) : setSearchGoal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (reason === "study" ? studyGoal : searchGoal).trim() && setStep(3)}
                  className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-400 focus:ring-4 focus:ring-stone-100 outline-none transition-all duration-300 placeholder:text-stone-400 text-stone-800 font-medium shadow-sm"
                />
              </div>
              
              <div className="flex justify-end">
                <ActionButton 
                  onClick={() => setStep(3)} 
                  disabled={!(reason === "study" ? studyGoal : searchGoal).trim()}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </ActionButton>
              </div>
            </div>
          )}

          {/* Step 3: Self-awareness */}
          {step === 3 && (
            <div className="animate-slide-up">
              <button onClick={() => setStep(2)} className="group text-stone-400 hover:text-stone-700 mb-6 transition-colors flex items-center gap-1.5 text-sm font-medium">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
              </button>

              <div className="bg-stone-50 rounded-xl p-6 border border-stone-100 mb-8 shadow-sm">
                <div className="flex items-center gap-2 text-stone-500 mb-3 font-semibold text-xs uppercase tracking-widest">
                  <Brain className="w-4 h-4 text-stone-400" /> Honest Reflection
                </div>
                <h2 className="text-lg font-semibold text-stone-800 leading-snug">
                  Will watching a YouTube video truly help you understand this better?
                </h2>
              </div>

              <div className="space-y-3.5">
                <button
                  onClick={allowYouTube}
                  className="w-full p-4.5 border border-stone-200 rounded-xl text-stone-700 font-medium hover:border-stone-400 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] hover:bg-stone-50 transition-all duration-300 text-left flex justify-between items-center group bg-white"
                >
                  Yes, this will help me understand it
                  <CheckCircle className="w-5 h-5 text-stone-300 group-hover:text-green-600 transition-colors duration-300 group-hover:scale-110" />
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="w-full p-4.5 border border-stone-200 rounded-xl text-stone-700 font-medium hover:border-stone-400 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] hover:bg-stone-50 transition-all duration-300 text-left flex justify-between items-center group bg-white"
                >
                  I'm probably avoiding my studies
                  <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-stone-600 transition-all duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Reflection */}
          {step === 4 && (
            <div className="animate-slide-up flex flex-col items-center text-center">
              <div className="mb-8 mt-2 relative">
                <div className="absolute inset-0 bg-stone-100 rounded-full animate-pulse scale-150 opacity-50"></div>
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 text-stone-600 shadow-inner">
                  <Brain className="w-10 h-10" />
                </div>
              </div>
              
              {reason === "bored" ? (
                <div className="mb-10">
                  <h2 className="text-2xl font-semibold mb-3 tracking-tight">Feeling bored? That's okay.</h2>
                  <p className="text-stone-500 leading-relaxed">You don't need YouTube to fix boredom.<br/>Take a moment and decide what you really need right now.</p>
                </div>
              ) : (
                <div className="mb-10">
                  <h2 className="text-2xl font-semibold mb-3 tracking-tight">That's okay.</h2>
                  <p className="text-stone-500 leading-relaxed">Self-awareness is the first step.<br/>What do you actually need right now?</p>
                </div>
              )}

              <div className="flex flex-col gap-3.5 w-full">
                <ActionButton onClick={() => { setReturnMessage("no-break"); setStep(6); }}>
                  <BookOpen className="w-4 h-4" /> Go back to studying
                </ActionButton>
                <ActionButton variant="secondary" onClick={() => { setBreakTime(300); setStep(5); }}>
                  <Coffee className="w-4 h-4" /> Take an intentional break
                </ActionButton>
              </div>
            </div>
          )}

          {/* Step 5: Intentional break */}
          {step === 5 && (
            <div className="animate-fade-in flex flex-col items-center text-center">
              {breakTime > 0 ? (
                <>
                  <h2 className="text-xl font-semibold mb-2">Intentional Break</h2>
                  <p className="text-stone-500 text-sm mb-8 italic px-4">"{quote}"</p>
                  
                  {/* Premium Circular Timer */}
                  <div className="mb-10 animate-slide-up">
                    <CircularProgress progress={breakProgress}>
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-stone-50 text-stone-400 mb-2 shadow-inner">
                        <Timer className="w-6 h-6" />
                      </div>
                      <div className="text-4xl font-light tabular-nums tracking-tight text-stone-900">
                        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                      </div>
                    </CircularProgress>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full mb-6">
                    <div className="flex flex-col items-center gap-2 p-3 bg-stone-50 rounded-xl border border-transparent hover:border-stone-200 transition-colors cursor-default">
                      <Footprints className="w-5 h-5 text-stone-400" />
                      <span className="text-xs font-medium text-stone-600">Take a walk</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-stone-50 rounded-xl border border-transparent hover:border-stone-200 transition-colors cursor-default">
                      <Droplets className="w-5 h-5 text-stone-400" />
                      <span className="text-xs font-medium text-stone-600">Drink water</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-stone-50 rounded-xl border border-transparent hover:border-stone-200 transition-colors cursor-default">
                      <Eye className="w-5 h-5 text-stone-400" />
                      <span className="text-xs font-medium text-stone-600">Rest your eyes</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-stone-50 rounded-xl border border-transparent hover:border-stone-200 transition-colors cursor-default">
                      <Wind className="w-5 h-5 text-stone-400" />
                      <span className="text-xs font-medium text-stone-600">Relax & breathe</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="animate-slide-up py-10 flex flex-col items-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-600 mb-6 shadow-inner ring-8 ring-green-50/50">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-3 tracking-tight">Your break is over.</h2>
                  <p className="text-stone-500 mb-8">Ready to get back to studying?</p>
                </div>
              )}

              <div className="w-full">
                <ActionButton onClick={() => { setReturnMessage("after-break"); setStep(6); }} variant={breakTime > 0 ? "secondary" : "primary"}>
                  <BookOpen className="w-4 h-4" /> {breakTime > 0 ? "End Break Early" : "Back to Study"}
                </ActionButton>
              </div>
            </div>
          )}

          {/* Step 6: Final motivational page */}
          {step === 6 && (
            <div className="animate-scale-in flex flex-col items-center text-center py-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 text-stone-700 mb-6 shadow-inner ring-8 ring-stone-50">
                <Target className="w-10 h-10" />
              </div>
              
              {returnMessage === "no-break" ? (
                <div className="mb-10">
                  <h2 className="text-2xl font-semibold mb-3 tracking-tight">You made the choice.</h2>
                  <p className="text-stone-500 leading-relaxed">
                    You don't need YouTube right now.<br/>
                    Go back to what you were doing and take the next small step.
                  </p>
                </div>
              ) : (
                <div className="mb-10">
                  <h2 className="text-2xl font-semibold mb-3 tracking-tight">Your break is over.</h2>
                  <p className="text-stone-500 leading-relaxed">
                    You gave yourself time to reset.<br/>
                    Now give your goal your attention again.
                  </p>
                </div>
              )}

              <div className="w-full">
                <ActionButton onClick={closeTab}>
                  <X className="w-4 h-4" /> Close Tab & Study
                </ActionButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudyGuard;