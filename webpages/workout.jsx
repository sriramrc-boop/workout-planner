const { useState, useEffect, useRef, useCallback } = React;

// ─── DATA ────────────────────────────────────────────────────────────────────

const MUSCLE_GROUPS = [
  { id: "chest", label: "CHEST", icon: "◈" },
  { id: "back", label: "BACK", icon: "◈" },
  { id: "shoulders", label: "SHOULDERS", icon: "◈" },
  { id: "arms", label: "ARMS", icon: "◈" },
  { id: "legs", label: "LEGS", icon: "◈" },
  { id: "core", label: "CORE", icon: "◈" },
];

const WORKOUTS = {
  chest: ["Bench Press", "Incline Dumbbell Press", "Cable Flyes", "Push-Ups", "Chest Dips"],
  back: ["Deadlift", "Pull-Ups", "Bent Over Row", "Lat Pulldown", "Seated Cable Row"],
  shoulders: ["Overhead Press", "Lateral Raises", "Front Raises", "Face Pulls", "Arnold Press"],
  arms: ["Barbell Curl", "Tricep Pushdown", "Hammer Curl", "Skull Crushers", "Concentration Curl"],
  legs: ["Squats", "Romanian Deadlift", "Leg Press", "Lunges", "Calf Raises"],
  core: ["Plank", "Crunches", "Leg Raises", "Russian Twists", "Ab Wheel Rollout"],
};

const DIFFICULTIES = [
  { id: "beginner",     label: "BEGINNER",     sets: 2, reps: 8,  rest: 90 },
  { id: "intermediate", label: "INTERMEDIATE", sets: 3, reps: 12, rest: 60 },
  { id: "advanced",     label: "ADVANCED",     sets: 4, reps: 15, rest: 45 },
  { id: "elite",        label: "ELITE",        sets: 5, reps: 20, rest: 30 },
];

const CARDIO_TYPES = [
  { id: "running",   label: "RUNNING",    desc: "Outdoor or treadmill" },
  { id: "cycling",   label: "CYCLING",    desc: "Stationary or road" },
  { id: "hiit",      label: "HIIT",       desc: "High intensity intervals" },
  { id: "rowing",    label: "ROWING",     desc: "Full body endurance" },
  { id: "jump_rope", label: "JUMP ROPE",  desc: "Coordination & cardio" },
  { id: "swimming",  label: "SWIMMING",   desc: "Low impact, full body" },
];

const CARDIO_PRESETS = [5, 10, 15, 20, 30, 45];

const PANELS = [
  { id: "muscle", label: "MUSCLE TRAINING", sub: "Build strength & size",     bg: "bg-muscle", num: "01" },
  { id: "cardio", label: "CARDIO",          sub: "Endurance & conditioning",  bg: "bg-cardio", num: "02" },
  { id: "rest",   label: "REST DAY",        sub: "Recovery & regeneration",   bg: "bg-rest",   num: "03" },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --crimson: #DC143C;
    --crimson-dim: rgba(220,20,60,0.18);
    --crimson-glow: rgba(220,20,60,0.55);
    --black: #000;
    --white: #fff;
    --gray: rgba(255,255,255,0.12);
    --dim: rgba(0,0,0,0.72);
  }

  body { background: #000; font-family: 'Oswald', sans-serif; color: #fff; overflow: hidden; height: 100vh; }

  .wp-root { width: 100vw; height: 100vh; position: relative; overflow: hidden; }

  .split-container {
    display: flex; width: 100%; height: 100%;
    transition: all 0.55s cubic-bezier(0.76,0,0.24,1);
  }

  .panel {
    position: relative; overflow: hidden; cursor: pointer; flex: 1;
    border-right: 1px solid rgba(255,255,255,0.07);
    transition: flex 0.6s cubic-bezier(0.76,0,0.24,1);
  }
  .panel:last-child { border-right: none; }
  .split-container.hovered .panel { flex: 0.4; }
  .split-container.hovered .panel.active { flex: 3.2; }

  .panel-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.62);
    transition: background 0.5s ease; z-index: 2;
  }
  .panel.active .panel-overlay { background: rgba(0,0,0,0.28); }
  .split-container:not(.hovered) .panel .panel-overlay { background: rgba(0,0,0,0.72); }

  .panel-bg {
    position: absolute; inset: 0; background-size: cover; background-position: center;
    transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .panel:hover .panel-bg { transform: scale(1.04); }

  .panel-label {
    position: absolute; bottom: 0; left: 0; right: 0;
    z-index: 3; padding: 32px 28px; transition: all 0.4s ease;
  }
  .panel-label h2 {
    font-size: clamp(18px, 3.2vw, 52px); font-weight: 700;
    letter-spacing: 4px; line-height: 1; transition: color 0.3s ease;
    text-transform: uppercase; white-space: nowrap;
  }
  .panel.active .panel-label h2 { color: #DC143C; }
  .panel-label p {
    font-size: 13px; letter-spacing: 3px; opacity: 0;
    transform: translateY(8px); transition: all 0.4s ease 0.1s;
    color: rgba(255,255,255,0.7); margin-top: 6px; font-weight: 200;
  }
  .panel.active .panel-label p { opacity: 1; transform: translateY(0); }

  .panel-num {
    position: absolute; top: 28px; left: 28px; font-size: 11px;
    letter-spacing: 4px; opacity: 0.35; z-index: 3; font-weight: 300;
  }

  .crimson-line {
    position: absolute; bottom: 0; left: 0; height: 3px;
    background: #DC143C; width: 0; transition: width 0.5s ease; z-index: 4;
  }
  .panel.active .crimson-line { width: 100%; }

  .screen {
    position: fixed; inset: 0; background: #000; z-index: 100;
    display: flex; flex-direction: column; justify-content: center;
    align-items: center; overflow-y: auto;
    animation: screenIn 0.5s cubic-bezier(0.76,0,0.24,1) both;
  }
  @keyframes screenIn {
    from { clip-path: inset(0 0 100% 0); }
    to   { clip-path: inset(0 0 0% 0); }
  }

  .screen-header {
    width: 100%; padding: 32px 48px 16px; display: flex; align-items: center; gap: 20px;
    position: sticky; top: 0; background: linear-gradient(to bottom, #000 85%, transparent); z-index: 10;
  }

  .back-btn {
    background: none; border: 1px solid rgba(255,255,255,0.2); color: #fff;
    font-family: 'Oswald', sans-serif; font-size: 12px; letter-spacing: 4px;
    padding: 10px 18px; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase;
  }
  .back-btn:hover { border-color: #DC143C; color: #DC143C; }

  .screen-title { font-size: clamp(22px, 4vw, 60px); font-weight: 700; letter-spacing: 5px; text-transform: uppercase; }
  .screen-title span { color: #DC143C; }
  .screen-subtitle { font-size: 12px; letter-spacing: 4px; color: rgba(255,255,255,0.4); font-weight: 200; text-transform: uppercase; }

  .screen-body {
    width: 100%; max-width: 1200px; padding: 120px 48px 80px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: left;
  }

  .grid-cards { display: grid; gap: 16px; }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-auto { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }

  .card {
    border: 1px solid rgba(255,255,255,0.1); padding: 28px 24px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: all 0.35s ease; animation: fadeUp 0.4s ease both;
  }
  .card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--crimson-dim) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.3s ease;
  }
  .card:hover { border-color: #DC143C; transform: translateY(-3px); }
  .card:hover::before, .card.selected::before { opacity: 1; }
  .card.selected { border-color: #DC143C; background: rgba(220,20,60,0.12); }

  .card-icon { font-size: 22px; margin-bottom: 12px; opacity: 0.6; }
  .card-title { font-size: clamp(16px, 1.8vw, 26px); font-weight: 700; letter-spacing: 3px; text-transform: uppercase; line-height: 1.1; }
  .card-desc { font-size: 11px; letter-spacing: 2px; color: rgba(255,255,255,0.45); margin-top: 6px; font-weight: 200; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .diff-card {
    border: 1px solid rgba(255,255,255,0.1); padding: 32px; cursor: pointer;
    transition: all 0.35s ease; position: relative; overflow: hidden; animation: fadeUp 0.4s ease both;
  }
  .diff-card:hover, .diff-card.selected { border-color: #DC143C; background: rgba(220,20,60,0.08); }
  .diff-label { font-size: clamp(20px, 2.5vw, 38px); font-weight: 700; letter-spacing: 5px; margin-bottom: 14px; }
  .diff-stats { display: flex; gap: 28px; font-size: 13px; letter-spacing: 2px; color: rgba(255,255,255,0.5); font-weight: 300; }
  .diff-stats strong { color: #DC143C; font-weight: 600; }

  .workout-session { width: 100%; max-width: 800px; margin: 0 auto; padding: 40px 48px; }

  .workout-item {
    border-bottom: 1px solid rgba(255,255,255,0.08); padding: 24px 0;
    transition: all 0.4s ease; animation: fadeUp 0.35s ease both;
  }
  .workout-item.done .workout-name { text-decoration: line-through; opacity: 0.35; color: rgba(255,255,255,0.4); }
  .workout-name {
    font-size: clamp(16px, 2vw, 28px); font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; margin-bottom: 14px; transition: all 0.4s ease;
  }

  .sets-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .set-btn {
    width: 44px; height: 44px; border: 1px solid rgba(255,255,255,0.2);
    background: none; color: #fff; font-family: 'Oswald', sans-serif;
    font-size: 13px; letter-spacing: 1px; cursor: pointer; transition: all 0.25s ease;
    display: flex; align-items: center; justify-content: center;
  }
  .set-btn:hover { border-color: #DC143C; }
  .set-btn.done { background: #DC143C; border-color: #DC143C; }

  .timer-container {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 60vh; gap: 24px; animation: fadeUp 0.5s ease both;
  }
  .timer-ring-wrap { position: relative; }
  .timer-label-big { font-size: clamp(56px, 8vw, 120px); font-weight: 700; letter-spacing: 4px; color: #fff; }
  .timer-sub { font-size: 12px; letter-spacing: 5px; color: rgba(255,255,255,0.35); font-weight: 200; text-transform: uppercase; }

  .timer-action-btn {
    background: none; border: 1px solid #DC143C; color: #DC143C;
    font-family: 'Oswald', sans-serif; font-size: 13px; letter-spacing: 5px;
    padding: 14px 36px; cursor: pointer; text-transform: uppercase; transition: all 0.3s ease; margin-top: 8px;
  }
  .timer-action-btn:hover { background: #DC143C; color: #fff; }
  .timer-action-btn.secondary { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.5); }
  .timer-action-btn.secondary:hover { border-color: #fff; color: #fff; background: none; }

  .rest-screen {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 100vh; gap: 20px; text-align: center; animation: fadeUp 0.5s ease both;
  }
  .rest-icon { font-size: 72px; animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.6; transform: scale(0.94); }
  }

  .congrats-screen {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 100vh; gap: 20px; text-align: center; padding: 40px; animation: fadeUp 0.5s ease both;
  }
  .congrats-big {
    font-size: clamp(42px, 8vw, 110px); font-weight: 700; letter-spacing: 6px;
    line-height: 1; animation: glitch 0.6s ease 0.3s both;
  }
  @keyframes glitch {
    0%   { clip-path: inset(0 0 100% 0); }
    100% { clip-path: inset(0 0 0 0); }
  }
  .streak-badge {
    margin-top: 16px; border: 1px solid #DC143C; padding: 14px 36px;
    font-size: 14px; letter-spacing: 5px; color: #DC143C; animation: fadeUp 0.4s ease 0.5s both;
  }

  .time-picker { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 12px; }
  .time-btn {
    border: 1px solid rgba(255,255,255,0.15); background: none; color: #fff;
    font-family: 'Oswald', sans-serif; font-size: 20px; font-weight: 600; letter-spacing: 2px;
    width: 90px; height: 90px; cursor: pointer; transition: all 0.3s ease;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  }
  .time-btn span { font-size: 9px; letter-spacing: 3px; opacity: 0.5; font-weight: 300; }
  .time-btn:hover, .time-btn.selected { border-color: #DC143C; color: #DC143C; }

  .custom-input { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
  .custom-input input {
    background: none; border: 1px solid rgba(255,255,255,0.15); color: #fff;
    font-family: 'Oswald', sans-serif; font-size: 28px; font-weight: 600;
    width: 90px; height: 56px; text-align: center; outline: none; transition: border-color 0.3s;
  }
  .custom-input input:focus { border-color: #DC143C; }
  .custom-input label { font-size: 11px; letter-spacing: 3px; opacity: 0.45; }

  .rest-day-screen {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 100vh; gap: 24px; text-align: center; padding: 40px; animation: fadeUp 0.5s ease both;
  }

  .progress-bar { width: 100%; height: 2px; background: rgba(255,255,255,0.1); margin: 24px 0; position: relative; }
  .progress-fill { height: 100%; background: #DC143C; transition: width 0.5s ease; }

  .cta-btn {
    background: #DC143C; border: none; color: #fff; font-family: 'Oswald', sans-serif;
    font-size: 14px; letter-spacing: 5px; padding: 16px 48px; cursor: pointer;
    text-transform: uppercase; transition: all 0.3s ease; margin-top: 12px;
  }
  .cta-btn:hover { background: #a50e2c; transform: translateY(-2px); }
  .cta-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

  .section-label { font-size: 11px; letter-spacing: 5px; color: rgba(255,255,255,0.3); margin-bottom: 20px; text-transform: uppercase; font-weight: 200; }
  .workout-count { font-size: 12px; letter-spacing: 3px; color: rgba(255,255,255,0.35); margin-bottom: 32px; }

  .bg-muscle { background: url('../imgs/muscle-training-bg.jpg') center/cover; }
  .bg-cardio { background: url('../imgs/cardio-section-bg.jpg') center/cover; }
  .bg-rest   { background: url('../imgs/rest-section-bg.jpg') center/cover; }

  .check-icon { position: absolute; right: 24px; top: 60%; color: #DC143C; font-size: 18px; margin-left: 10px; animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
  @keyframes popIn {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  .step-indicator { display: flex; gap: 8px; align-items: center; margin-left: auto; }
  .step-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.2); transition: background 0.3s; }
  .step-dot.active { background: #DC143C; }
  .step-dot.done { background: rgba(220,20,60,0.4); }
`;

// ─── HELPER HOOKS ─────────────────────────────────────────────────────────────

function useTimer(initialSecs, onDone) {
  const [secs, setSecs] = useState(initialSecs);
  const [running, setRunning] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (running && secs > 0) {
      ref.current = setInterval(() => setSecs(s => s - 1), 1000);
    } else if (running && secs === 0) {
      clearInterval(ref.current);
      setRunning(false);
      onDone?.();
    }
    return () => clearInterval(ref.current);
  }, [running, secs]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return { secs, running, start: () => setRunning(true), pause: () => setRunning(false), reset: () => { clearInterval(ref.current); setSecs(initialSecs); setRunning(false); }, display: fmt(secs) };
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function RestBreak({ onDone }) {
  const timer = useTimer(60, onDone);
  useEffect(() => { timer.start(); }, []);
  const pct = ((60 - timer.secs) / 60) * 100;
  return (
    <div className="rest-screen">
      <div className="rest-icon">💧</div>
      <div style={{ fontSize: "clamp(14px, 2vw, 18px)", letterSpacing: "6px", fontWeight: 300, opacity: 0.5 }}>DRINK WATER · REST</div>
      <div className="timer-label-big" style={{ fontSize: "clamp(60px, 9vw, 130px)" }}>{timer.display}</div>
      <div className="progress-bar" style={{ width: "240px" }}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="timer-sub">NEXT EXERCISE IN {timer.secs}s</div>
      <button className="timer-action-btn secondary" onClick={onDone}>SKIP REST</button>
    </div>
  );
}

function CongratsScreen({ streak, onHome }) {
  return (
    <div className="congrats-screen">
      <div style={{ fontSize: "13px", letterSpacing: "8px", opacity: 0.4, fontWeight: 200 }}>WORKOUT COMPLETE</div>
      <div className="congrats-big">CRUSHED<br /><span style={{ color: "#DC143C" }}>IT.</span></div>
      <div style={{ fontSize: "14px", letterSpacing: "3px", opacity: 0.5, maxWidth: "400px", lineHeight: 2, fontWeight: 200 }}>
        You showed up, you put in the work.<br />That's what champions do.
      </div>
      <div className="streak-badge">🔥 STREAK — <strong>{streak} DAY{streak !== 1 ? "S" : ""}</strong></div>
      <button className="cta-btn" onClick={onHome} style={{ marginTop: "32px" }}>BACK TO HOME</button>
    </div>
  );
}

// ─── MUSCLE TRAINING FLOW ─────────────────────────────────────────────────────

function MuscleTrainingFlow({ streak, setStreak, onBack }) {
  const [step, setStep] = useState("muscle");
  const [muscle, setMuscle] = useState(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [showRest, setShowRest] = useState(false);

  const steps = ["muscle", "workouts", "difficulty", "session"];
  const stepIdx = steps.indexOf(step);

  const toggleWorkout = (w) => setSelectedWorkouts(prev => prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]);

  const startSession = () => {
    const diff = DIFFICULTIES.find(d => d.id === difficulty);
    setSessionData(selectedWorkouts.map(name => ({ name, sets: Array(diff.sets).fill(false) })));
    setStep("session");
  };

  const toggleSet = (exIdx, setIdx) => {
    setSessionData(prev => prev.map((ex, i) => i !== exIdx ? ex : {
      ...ex, sets: ex.sets.map((s, j) => j === setIdx ? !s : s),
    }));
  };

  const allSessionDone = sessionData?.every(ex => ex.sets.every(Boolean));
  const diff = difficulty ? DIFFICULTIES.find(d => d.id === difficulty) : null;

  if (step === "congrats") return <CongratsScreen streak={streak} onHome={onBack} />;
  if (showRest) return <RestBreak onDone={() => setShowRest(false)} />;

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={stepIdx > 0 ? () => setStep(steps[stepIdx - 1]) : onBack}>← BACK</button>
        <div>
          <div className="screen-title">MUSCLE <span>TRAINING</span></div>
          <div className="screen-subtitle">{muscle ? muscle.toUpperCase() : "SELECT MUSCLE GROUP"}</div>
        </div>
        <div className="step-indicator">
          {steps.map((s, i) => <div key={s} className={`step-dot ${i < stepIdx ? "done" : i === stepIdx ? "active" : ""}`} />)}
        </div>
      </div>
      <div className="screen-body">
        {step === "muscle" && (
          <>
            <div className="section-label">— STEP 01 / SELECT MUSCLE GROUP</div>
            <div className="grid-cards grid-3">
              {MUSCLE_GROUPS.map((mg, i) => (
                <div key={mg.id} className={`card ${muscle === mg.id ? "selected" : ""}`}
                  style={{ animationDelay: `${i * 0.06}s` }} onClick={() => setMuscle(mg.id)}>
                  <div className="card-icon">{mg.icon}</div>
                  <div className="card-title">{mg.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "40px" }}>
              <button className="cta-btn" disabled={!muscle} onClick={() => setStep("workouts")}>SELECT WORKOUTS →</button>
            </div>
          </>
        )}

        {step === "workouts" && muscle && (
          <>
            <div className="section-label">— STEP 02 / SELECT WORKOUTS</div>
            <div className="workout-count">{selectedWorkouts.length} SELECTED</div>
            <div className="grid-cards grid-2">
              {WORKOUTS[muscle].map((w, i) => (
                <div key={w} className={`card ${selectedWorkouts.includes(w) ? "selected" : ""}`}
                  style={{ animationDelay: `${i * 0.07}s` }} onClick={() => toggleWorkout(w)}>
                  <div className="card-title">{w}</div>
                  {selectedWorkouts.includes(w) && <span className="check-icon">✓</span>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "40px" }}>
              <button className="cta-btn" disabled={selectedWorkouts.length === 0} onClick={() => setStep("difficulty")}>SET DIFFICULTY →</button>
            </div>
          </>
        )}

        {step === "difficulty" && (
          <>
            <div className="section-label">— STEP 03 / SELECT DIFFICULTY</div>
            <div className="grid-cards" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {DIFFICULTIES.map((d, i) => (
                <div key={d.id} className={`diff-card ${difficulty === d.id ? "selected" : ""}`}
                  style={{ animationDelay: `${i * 0.08}s` }} onClick={() => setDifficulty(d.id)}>
                  <div className="diff-label">{d.label}</div>
                  <div className="diff-stats">
                    <span><strong>{d.sets}</strong> SETS</span>
                    <span><strong>{d.reps}</strong> REPS</span>
                    <span><strong>{d.rest}s</strong> REST</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "40px" }}>
              <button className="cta-btn" disabled={!difficulty} onClick={startSession}>START SESSION →</button>
            </div>
          </>
        )}

        {step === "session" && sessionData && (
          <>
            <div className="section-label">— STEP 04 / TRACK YOUR WORKOUT</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(sessionData.filter(ex => ex.sets.every(Boolean)).length / sessionData.length) * 100}%` }} />
            </div>
            {sessionData.map((ex, ei) => (
              <div key={ex.name} className={`workout-item ${ex.sets.every(Boolean) ? "done" : ""}`} style={{ animationDelay: `${ei * 0.08}s` }}>
                <div className="workout-name">
                  {ex.name}
                  {ex.sets.every(Boolean) && <span className="check-icon">✓</span>}
                </div>
                <div className="sets-row">
                  {ex.sets.map((done, si) => (
                    <button key={si} className={`set-btn ${done ? "done" : ""}`} onClick={() => toggleSet(ei, si)}>
                      {done ? "✓" : `${si + 1}`}
                    </button>
                  ))}
                  <span style={{ fontSize: "11px", letterSpacing: "3px", opacity: 0.3, alignSelf: "center", marginLeft: "8px" }}>
                    × {diff?.reps} REPS
                  </span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: "48px", display: "flex", gap: "16px" }}>
              <button className="timer-action-btn secondary" onClick={() => setShowRest(true)}>💧 TAKE WATER BREAK</button>
              <button className="cta-btn" disabled={!allSessionDone} onClick={() => { setStreak(s => s + 1); setStep("congrats"); }}>
                FINISH SESSION →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── CARDIO FLOW ──────────────────────────────────────────────────────────────

function CardioTimer({ workout, duration, onDone }) {
  const timer = useTimer(duration * 60, onDone);
  const [started, setStarted] = useState(false);
  const pct = ((duration * 60 - timer.secs) / (duration * 60)) * 100;
  return (
    <div className="timer-container">
      <div style={{ fontSize: "11px", letterSpacing: "6px", opacity: 0.4, fontWeight: 200 }}>NOW DOING</div>
      <div style={{ fontSize: "clamp(22px, 3vw, 42px)", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase" }}>{workout}</div>
      <div className="timer-label-big">{timer.display}</div>
      <div className="progress-bar" style={{ width: "320px" }}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="timer-sub">{Math.round(pct)}% COMPLETE</div>
      <div style={{ display: "flex", gap: "12px" }}>
        {!started
          ? <button className="timer-action-btn" onClick={() => { setStarted(true); timer.start(); }}>START</button>
          : timer.running
            ? <button className="timer-action-btn secondary" onClick={timer.pause}>PAUSE</button>
            : <button className="timer-action-btn" onClick={timer.start}>RESUME</button>
        }
        <button className="timer-action-btn secondary" onClick={onDone}>SKIP</button>
      </div>
    </div>
  );
}

function CardioFlow({ streak, setStreak, onBack }) {
  const [step, setStep] = useState("select");
  const [selectedCardio, setSelectedCardio] = useState([]);
  const [duration, setDuration] = useState(null);
  const [customMin, setCustomMin] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showRest, setShowRest] = useState(false);

  const toggleCardio = (id) => setSelectedCardio(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const effectiveDuration = duration === "custom" ? parseInt(customMin) || 0 : duration;

  const handleWorkoutDone = () => {
    if (currentIdx < selectedCardio.length - 1) setShowRest(true);
    else { setStreak(s => s + 1); setStep("congrats"); }
  };

  if (step === "congrats") return <CongratsScreen streak={streak} onHome={onBack} />;
  if (showRest) return <RestBreak onDone={() => { setShowRest(false); setCurrentIdx(i => i + 1); }} />;

  const steps = ["select", "time", "session"];
  const stepIdx = steps.indexOf(step);

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={stepIdx > 0 ? () => setStep(steps[stepIdx - 1]) : onBack}>← BACK</button>
        <div>
          <div className="screen-title">CARDIO <span>SESSION</span></div>
          <div className="screen-subtitle">{selectedCardio.length > 0 ? `${selectedCardio.length} SELECTED` : "CHOOSE YOUR CARDIO"}</div>
        </div>
        <div className="step-indicator">
          {steps.map((s, i) => <div key={s} className={`step-dot ${i < stepIdx ? "done" : i === stepIdx ? "active" : ""}`} />)}
        </div>
      </div>
      <div className="screen-body">
        {step === "select" && (
          <>
            <div className="section-label">— STEP 01 / SELECT CARDIO TYPES</div>
            <div className="grid-cards grid-3">
              {CARDIO_TYPES.map((c, i) => (
                <div key={c.id} className={`card ${selectedCardio.includes(c.id) ? "selected" : ""}`}
                  style={{ animationDelay: `${i * 0.07}s` }} onClick={() => toggleCardio(c.id)}>
                  <div className="card-title">{c.label}</div>
                  <div className="card-desc">{c.desc}</div>
                  {selectedCardio.includes(c.id) && <span className="check-icon">✓</span>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "40px" }}>
              <button className="cta-btn" disabled={selectedCardio.length === 0} onClick={() => setStep("time")}>SET DURATION →</button>
            </div>
          </>
        )}

        {step === "time" && (
          <>
            <div className="section-label">— STEP 02 / SET DURATION PER EXERCISE</div>
            <div className="time-picker">
              {CARDIO_PRESETS.map(mins => (
                <button key={mins} className={`time-btn ${duration === mins ? "selected" : ""}`} onClick={() => setDuration(mins)}>
                  {mins}<span>MIN</span>
                </button>
              ))}
              <button className={`time-btn ${duration === "custom" ? "selected" : ""}`} onClick={() => setDuration("custom")}>
                +<span>CUSTOM</span>
              </button>
            </div>
            {duration === "custom" && (
              <div className="custom-input" style={{ marginTop: "24px" }}>
                <input type="number" min="1" max="120" value={customMin} onChange={e => setCustomMin(e.target.value)} placeholder="20" />
                <label>MINUTES PER EXERCISE</label>
              </div>
            )}
            <div style={{ marginTop: "40px" }}>
              <button className="cta-btn"
                disabled={!duration || (duration === "custom" && (!customMin || parseInt(customMin) < 1))}
                onClick={() => { setCurrentIdx(0); setStep("session"); }}>
                START CARDIO →
              </button>
            </div>
          </>
        )}

        {step === "session" && (
          <CardioTimer
            workout={CARDIO_TYPES.find(c => c.id === selectedCardio[currentIdx])?.label || ""}
            duration={effectiveDuration}
            onDone={handleWorkoutDone}
          />
        )}
      </div>
    </div>
  );
}

// ─── REST DAY ─────────────────────────────────────────────────────────────────

function RestDayScreen({ onBack }) {
  const tips = ["💧 Stay hydrated — drink 3L of water", "🥗 Eat nutrient-dense, whole foods", "🚶 Light walking is fine", "😴 Aim for 8 hours of sleep"];
  return (
    <div className="screen">
      <div className="rest-day-screen">
        <div style={{ fontSize: "80px" }}>🛌</div>
        <div style={{ fontSize: "11px", letterSpacing: "8px", opacity: 0.35, fontWeight: 200 }}>TODAY IS A</div>
        <div style={{ fontSize: "clamp(52px, 8vw, 100px)", fontWeight: 700, letterSpacing: "5px", lineHeight: 1 }}>
          REST<br /><span style={{ color: "#DC143C" }}>DAY.</span>
        </div>
        <div style={{ fontSize: "14px", letterSpacing: "3px", opacity: 0.45, maxWidth: "460px", lineHeight: 2, fontWeight: 200, marginTop: "8px" }}>
          Your body grows during rest, not during training.<br />
          <strong style={{ color: "#DC143C", opacity: 1 }}>Stay disciplined — no cheat meals today.</strong><br />
          Eat clean. Sleep well. Come back stronger.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px", alignItems: "center" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", opacity: 0.3 }}>REST DAY REMINDERS</div>
          {tips.map((tip, i) => (
            <div key={i} style={{ fontSize: "13px", letterSpacing: "2px", opacity: 0.55, fontWeight: 200, animationDelay: `${0.3 + i * 0.1}s`, animation: "fadeUp 0.4s ease both" }}>{tip}</div>
          ))}
        </div>
        <button className="cta-btn" onClick={onBack} style={{ marginTop: "32px" }}>← BACK TO HOME</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

function WorkoutPlanner() {
  const [hoveredPanel, setHoveredPanel] = useState(null);
  const [activeMode, setActiveMode] = useState(null);
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem?.("wp_streak") || "0") || 0);

  const updateStreak = useCallback((fn) => {
    setStreak(prev => {
      const next = fn(prev);
      try { localStorage.setItem("wp_streak", String(next)); } catch {}
      return next;
    });
  }, []);

  const modeProps = { streak, setStreak: updateStreak, onBack: () => setActiveMode(null) };

  if (activeMode === "muscle") return <><style>{globalStyles}</style><MuscleTrainingFlow {...modeProps} /></>;
  if (activeMode === "cardio") return <><style>{globalStyles}</style><CardioFlow {...modeProps} /></>;
  if (activeMode === "rest")   return <><style>{globalStyles}</style><RestDayScreen onBack={modeProps.onBack} /></>;

  return (
    <>
      <style>{globalStyles}</style>
      <div className="wp-root">
        <div style={{
          position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 50,
          fontSize: "12px", letterSpacing: "4px", color: "#DC143C", fontFamily: "'Oswald', sans-serif",
          fontWeight: 600, border: "1px solid rgba(220,20,60,0.3)", padding: "8px 18px", background: "rgba(0,0,0,0.6)",
        }}>
          🔥 {streak} DAY STREAK
        </div>
        <div className={`split-container ${hoveredPanel ? "hovered" : ""}`}>
          {PANELS.map((p) => (
            <div key={p.id} className={`panel ${hoveredPanel === p.id ? "active" : ""}`}
              onMouseEnter={() => setHoveredPanel(p.id)}
              onMouseLeave={() => setHoveredPanel(null)}
              onClick={() => setActiveMode(p.id)}>
              <div className={`panel-bg ${p.bg}`} />
              <div className="panel-overlay" />
              <div className="panel-num">{p.num}</div>
              <div className="panel-label">
                <h2>{p.label}</h2>
                <p>{p.sub}</p>
              </div>
              <div className="crimson-line" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('workout-root'));
root.render(<WorkoutPlanner />);