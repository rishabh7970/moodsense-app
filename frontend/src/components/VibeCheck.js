import React, { useState } from 'react';
import axios from 'axios';

const VibeCheck = () => {
  const [mood, setMood] = useState('😐');
  const [battery, setBattery] = useState(50);
  const [ventText, setVentText] = useState('');
  const [pressureSource, setPressureSource] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const moods = ['⛈️', '🌧️', '☁️', '😐', '🌤️', '☀️', '🔥'];
  
  const pressureOptions = [
    { label: "Deadlines", icon: "⏰" }, 
    { label: "Workload", icon: "📚" }, 
    { label: "Management", icon: "👔" }, 
    { label: "Pay/Comp", icon: "💰" }, 
    { label: "Team", icon: "🗣️" }, 
    { label: "Personal", icon: "🏠" },
    { label: "All Good", icon: "✅" }
  ];

  const handleSubmit = async () => {
    if (!pressureSource) {
      alert("Please select a pressure source (or 'All Good') to continue.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/submit-vibe', {
        mood, battery, ventText, pressureSource
      });
      setTimeout(() => {
        setSubmitted(true);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  // --- 1. THE SUCCESS SCREEN ---
  if (submitted) {
    return (
      <div className="h-full w-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-80"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 rounded-full blur-[150px] opacity-20 animate-pulse"></div>

        <div className="relative z-10 text-center p-12 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl max-w-md w-full transform transition-all hover:scale-105">
          <div className="text-8xl mb-6 animate-bounce drop-shadow-lg">🎉</div>
          <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Vibe Logged!</h2>
          <p className="text-indigo-200 mb-8 font-medium">Your data is safe with us.</p>
          <button 
            onClick={() => { setSubmitted(false); setVentText(''); setBattery(50); setPressureSource(''); }}
            className="w-full bg-white text-indigo-900 font-bold py-4 px-6 rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-indigo-500/50"
          >
            Check In Again
          </button>
        </div>
      </div>
    );
  }

  // --- 2. THE MAIN DASHBOARD ---
  return (
    <div className="h-full w-full bg-slate-900 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>

      {/* THE GLASS CONTAINER - Filling the screen */}
      <div className="relative z-10 w-full h-full bg-slate-800/40 backdrop-blur-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* === LEFT PANEL: VISUALS === */}
        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-between bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden border-r border-white/10">
          
          {/* Header & Welcome Message */}
          <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">👋 Welcome Back, Manu!</h2>
                <p className="text-indigo-300 text-sm">Here is your daily wellness check-in.</p>
            </div>

            <h1 className="text-3xl font-black text-white tracking-tighter mb-1">HELLO, MANU.</h1>
            <p className="text-indigo-300 font-medium">Ready to sync your status?</p>
          </div>

          {/* Huge Animated Mood Display */}
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="text-[120px] md:text-[160px] transition-transform duration-300 group-hover:scale-110 drop-shadow-2xl filter saturate-150">
                {mood}
              </div>
            </div>
            <p className="text-white/50 text-sm mt-6 font-bold tracking-widest uppercase">Current Vibe</p>
          </div>

          {/* Battery Vertical Bar */}
          <div className="mt-auto">
            <div className="flex justify-between text-white mb-2 font-bold text-sm">
              <span>ENERGY</span>
              <span className={`${battery < 30 ? 'text-red-400' : 'text-emerald-400'}`}>{battery}%</span>
            </div>
            <div className="h-4 w-full bg-slate-700/50 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full transition-all duration-500 ease-out shadow-[0_0_20px_rgba(0,0,0,0.3)] ${
                  battery < 30 ? 'bg-red-500 shadow-red-500/50' : 
                  (battery > 70 ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-indigo-500 shadow-indigo-500/50')
                }`} 
                style={{ width: `${battery}%` }}
              ></div>
            </div>
            <input 
              type="range" min="0" max="100" value={battery} 
              onChange={(e) => setBattery(e.target.value)}
              className="w-full mt-4 h-2 bg-transparent appearance-none cursor-pointer accent-white opacity-50 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* === RIGHT PANEL: CONTROLS === */}
        <div className="w-full md:w-3/5 p-8 md:p-12 bg-slate-900/30 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
          
          {/* 1. Mood Selector Grid */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Select Forecast</label>
            <div className="grid grid-cols-7 gap-3">
              {moods.map((m) => (
                <button 
                  key={m} 
                  onClick={() => setMood(m)}
                  className={`aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all duration-200 border border-transparent ${
                    mood === m 
                      ? 'bg-white/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.3)] scale-110' 
                      : 'bg-slate-800/50 hover:bg-slate-700 grayscale opacity-40 hover:opacity-100 hover:grayscale-0'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Pressure Pills */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">
              Primary Driver <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {pressureOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setPressureSource(opt.label)}
                  className={`px-5 py-3 rounded-xl text-sm font-bold border transition-all duration-200 flex items-center gap-2 ${
                    pressureSource === opt.label 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg scale-105' 
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Vent Area */}
          <div className="flex-1 min-h-[150px]">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Notes (NLP Analysis)</label>
            <textarea 
              className="w-full h-full p-5 bg-slate-800/50 border border-slate-700 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-slate-800 transition-all resize-none text-slate-200 placeholder-slate-500 text-sm leading-relaxed font-medium"
              placeholder="Start typing to unlock AI insights..." 
              value={ventText}
              onChange={(e) => setVentText(e.target.value)}
            />
          </div>

          {/* 4. Action Button */}
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-5 rounded-2xl font-bold text-lg tracking-wide shadow-xl transition-all active:scale-95 ${
              isLoading 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-900/30 hover:shadow-indigo-900/50'
            }`}
          >
            {isLoading ? 'Syncing...' : 'Update Status'}
          </button>

        </div>
      </div>
    </div>
  );
};

export default VibeCheck;