import React from 'react';

const Sidebar = ({ view, setView }) => {
  const menuItems = [
    { id: 'employee', label: 'My Mood', icon: '😊' },
    { id: 'hr', label: 'HR Dashboard', icon: '📊' },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col shadow-2xl fixed left-0 top-0 z-50 border-r border-slate-800">
      {/* 1. Logo Section */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-gradient-to-tr from-blue-500 to-purple-500 w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
          🧠
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">MoodSense</h1>
          <p className="text-xs text-slate-400 font-medium">Enterprise AI</p>
        </div>
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
              view === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className={`text-lg transition-transform group-hover:scale-110 ${view === item.id ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
            {item.label}
            
            {/* Active Indicator Dot */}
            {view === item.id && (
              <span className="ml-auto w-2 h-2 bg-white rounded-full shadow-glow"></span>
            )}
          </button>
        ))}
      </nav>

      {/* 3. User Profile / Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
          {/* Avatar with Initials */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 border-2 border-slate-700 flex items-center justify-center text-xs font-bold text-slate-900">
            MS
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Manu Sharma</p>
            <p className="text-xs text-slate-400">View Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;