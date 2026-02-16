import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import VibeCheck from './components/VibeCheck';
import HRDashboard from './components/HRDashboard';

function App() {
  const [view, setView] = useState('employee');

  return (
    // We set h-screen and overflow-hidden on the outer container
    <div className="flex h-screen bg-slate-900 font-sans text-slate-100 overflow-hidden">
      
      {/* 1. The Sidebar (Fixed to the left) */}
      <Sidebar view={view} setView={setView} />

      {/* 2. The Main Content Area */}
      {/* Removed p-8 padding. Added h-full. */}
      <main className="flex-1 ml-64 h-full transition-all duration-300 relative">
        
        {/* The content now fills the entire space */}
        <div className="h-full animate-fade-in-up">
          {view === 'employee' ? <VibeCheck /> : <HRDashboard />}
        </div>

      </main>
    </div>
  );
}

export default App;