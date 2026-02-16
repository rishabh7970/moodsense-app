import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  LineChart, Line, CartesianGrid 
} from 'recharts';

const HRDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null); // Tracks which employee is clicked
  const [loading, setLoading] = useState(true);

  const refreshData = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/hr-dashboard')
      .then(res => {
        setEmployees(res.data.employees);
        setDeptData(res.data.department_data);
        setLoading(false);
        // Auto-select the first high-risk employee if available
        const highRisk = res.data.employees.find(e => e.risk_status === 'High Risk');
        if (highRisk && !selectedEmp) setSelectedEmp(highRisk);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => { refreshData(); }, []);

  // Function to handle "Action" buttons
  const handleAction = (action) => {
    alert(`✅ Action Triggered: ${action} for ${selectedEmp.name}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">🧠 MoodSense AI</h1>
          <p className="text-slate-500 font-medium">Workforce Intelligence Platform</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right hidden md:block">
              <div className="text-sm text-slate-400">System Status</div>
              <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Live Analysis
              </div>
           </div>
           <button onClick={refreshData} className="bg-slate-900 hover:bg-slate-700 text-white px-5 py-2 rounded-xl shadow-lg transition-all active:scale-95">
             Refresh Data
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: EMPLOYEE LIST */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h3 className="text-xl font-bold text-slate-800">👥 Employee Roster</h3>
             <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{employees.length} Active</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Name</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Risk Level</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Battery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr 
                    key={emp.id} 
                    onClick={() => setSelectedEmp(emp)}
                    className={`cursor-pointer transition-colors hover:bg-blue-50/50 ${selectedEmp?.id === emp.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  >
                    <td className="p-4">
                      <div className="font-bold text-slate-700">{emp.name}</div>
                      <div className="text-xs text-slate-500">{emp.role}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        emp.risk_status === 'High Risk' ? 'bg-red-100 text-red-600' : 
                        (emp.risk_status === 'Monitor' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600')
                      }`}>
                        {emp.risk_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="w-24 bg-slate-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${emp.avg_battery < 30 ? 'bg-red-500' : 'bg-green-500'}`} 
                          style={{width: `${emp.avg_battery}%`}}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL VIEW */}
        <div className="space-y-6">
          
          {/* 1. DEPT HEATMAP */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Department Energy</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData}>
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="energy" radius={[4, 4, 0, 0]}>
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.energy < 40 ? '#f87171' : '#34d399'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. EMPLOYEE DEEP DIVE (Conditional) */}
          {selectedEmp ? (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden">
              {/* Background Blob for effect */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEmp.name}</h2>
                    <p className="text-slate-400 text-sm">{selectedEmp.role} • {selectedEmp.dept}</p>
                  </div>
                  <div className="text-3xl">{selectedEmp.avg_battery < 40 ? '⛈️' : '☀️'}</div>
                </div>

                {/* TREND CHART */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">7-Day Energy Trend</h4>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedEmp.history}>
                        <Line type="monotone" dataKey="battery" stroke="#60a5fa" strokeWidth={3} dot={{r: 0}} />
                        <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', color: '#fff'}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI INSIGHTS */}
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm mb-6 border border-white/10">
                  <h4 className="text-xs font-bold text-blue-300 uppercase mb-2">AI Detected Drivers</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmp.drivers && selectedEmp.drivers.length > 0 ? (
                      selectedEmp.drivers.map((d, i) => (
                        <span key={i} className="px-2 py-1 bg-red-500/20 text-red-200 border border-red-500/30 rounded text-xs font-bold">{d}</span>
                      ))
                    ) : <span className="text-slate-400 text-xs italic">No negative triggers detected.</span>}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleAction('Kudos')} className="bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm font-semibold transition-colors">
                    👏 Send Kudos
                  </button>
                  <button onClick={() => handleAction('Meeting')} className="bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-blue-900/50">
                    📅 Schedule 1:1
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400 flex flex-col items-center justify-center h-64">
              <span className="text-3xl mb-2">👈</span>
              Select an employee to view AI insights
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default HRDashboard;