import { useState, useEffect, useRef } from "react";
import { BookOpen, Timer, RotateCcw, Play, Pause, CheckCircle } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const TIMER_TOTAL = 25 * 60;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function sendMsg(type, payload = {}) {
  return new Promise((resolve) =>
    chrome.runtime.sendMessage({ type, ...payload }, resolve)
  );
}

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircularProgress({ progress, size = 120, strokeWidth = 5, children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress * circumference;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle stroke="#292524" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle
          stroke={progress === 0 ? "#22c55e" : "#e7e5e4"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 0.9s linear",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={on}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none
        ${on ? "bg-green-500" : "bg-stone-600"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300
          ${on ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [studyMode, setStudyMode]       = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(TIMER_TOTAL);
  const [timerStatus, setTimerStatus]   = useState("idle"); // idle | running | paused | done
  const storageListenerRef              = useRef(null);

  // ── Load initial state from background on mount ───────────────────────────
  useEffect(() => {
    // Study Mode
    sendMsg("GET_STUDY_MODE").then((res) => {
      if (res) setStudyMode(res.enabled);
    });

    // Timer
    sendMsg("GET_TIMER_STATE").then((state) => {
      if (state) {
        setTimerSeconds(state.timerSeconds ?? TIMER_TOTAL);
        setTimerStatus(state.timerStatus  ?? "idle");
      }
    });

    // Live updates via storage.onChanged
    const listener = (changes) => {
      if (changes.timerSeconds) setTimerSeconds(changes.timerSeconds.newValue);
      if (changes.timerStatus)  setTimerStatus(changes.timerStatus.newValue);
      if (changes.studyModeEnabled) setStudyMode(changes.studyModeEnabled.newValue);
    };
    chrome.storage.onChanged.addListener(listener);
    storageListenerRef.current = listener;

    return () => {
      chrome.storage.onChanged.removeListener(storageListenerRef.current);
    };
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleToggleStudyMode = () => {
    const next = !studyMode;
    setStudyMode(next);
    sendMsg("SET_STUDY_MODE", { enabled: next });
  };

  const handleTimerAction = () => {
    if (timerStatus === "idle" || timerStatus === "done") {
      sendMsg("TIMER_START");
    } else if (timerStatus === "running") {
      sendMsg("TIMER_PAUSE");
    } else if (timerStatus === "paused") {
      sendMsg("TIMER_RESUME");
    }
  };

  const handleReset = () => {
    sendMsg("TIMER_RESET").then(() => {
      setTimerSeconds(TIMER_TOTAL);
      setTimerStatus("idle");
    });
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const progress    = timerStatus === "done" ? 0 : timerSeconds / TIMER_TOTAL;
  const isDone      = timerStatus === "done";
  const isRunning   = timerStatus === "running";
  const isIdle      = timerStatus === "idle";

  const timerBtnLabel = isIdle || isDone
    ? "Start Focus"
    : isRunning
    ? "Pause"
    : "Resume";

  const TimerIcon = isRunning ? Pause : Play;

  return (
    <div className="w-[350px] h-[450px] bg-stone-900 text-white flex flex-col overflow-hidden font-sans antialiased">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-stone-800">
        <div className="bg-stone-800 p-2 rounded-xl">
          <Logo className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-tight">YouTube Study Guard</h1>
          <p className="text-[11px] text-stone-500 font-medium tracking-wide">Stay focused. Study smarter.</p>
        </div>
      </div>

      {/* ── Study Mode Card ── */}
      <div className="mx-4 mt-4 bg-stone-800 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-stone-400" />
            <div>
              <p className="text-sm font-semibold">Study Mode</p>
              <p className="text-[11px] text-stone-500">
                {studyMode ? "YouTube guard is active" : "YouTube is unblocked"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold tracking-wide ${studyMode ? "text-green-400" : "text-stone-500"}`}>
              {studyMode ? "ON" : "OFF"}
            </span>
            <Toggle on={studyMode} onToggle={handleToggleStudyMode} />
          </div>
        </div>
      </div>

      {/* ── Focus Timer Card ── */}
      <div className="mx-4 mt-3 bg-stone-800 rounded-xl p-4 flex flex-col items-center flex-1">
        <div className="flex items-center gap-2 w-full mb-4">
          <Timer className="w-4 h-4 text-stone-400" />
          <p className="text-sm font-semibold">Focus Timer</p>
          {(isRunning || timerStatus === "paused") && (
            <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full
              ${isRunning ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
              {isRunning ? "● RUNNING" : "⏸ PAUSED"}
            </span>
          )}
          {isDone && (
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
              ✓ DONE
            </span>
          )}
        </div>

        {/* Circular progress + time */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <CircularProgress progress={progress} size={130} strokeWidth={5}>
            {isDone ? (
              <CheckCircle className="w-10 h-10 text-green-400" />
            ) : (
              <span className="text-3xl font-light tabular-nums tracking-tight text-stone-100">
                {fmt(timerSeconds)}
              </span>
            )}
          </CircularProgress>

          {isDone && (
            <p className="text-xs text-stone-400 -mt-1">Session complete!</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2 w-full mt-4">
          <button
            onClick={handleTimerAction}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-stone-100 text-stone-900 text-sm font-semibold hover:bg-white transition-colors duration-200 active:scale-[0.97]"
          >
            <TimerIcon className="w-4 h-4" />
            {timerBtnLabel}
          </button>

          {(!isIdle) && (
            <button
              onClick={handleReset}
              title="Reset timer"
              className="flex items-center justify-center w-10 rounded-xl bg-stone-700 text-stone-400 hover:bg-stone-600 hover:text-stone-200 transition-colors duration-200 active:scale-[0.97]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="text-center py-3">
        <p className="text-[10px] text-stone-600">
          {studyMode ? "🛡 Guard is watching your sessions" : "⚠ Guard is disabled"}
        </p>
      </div>
    </div>
  );
}

export default App;