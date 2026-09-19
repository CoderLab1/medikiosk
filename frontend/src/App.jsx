import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Kiosk from './Kiosk';
import Dashboard from './Dashboard';
import { Activity, Stethoscope } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">MediKiosk</span>
            </div>
            <div className="flex gap-2 sm:gap-4">
              <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium px-2 sm:px-3 py-2 rounded-md hover:bg-slate-50 transition-colors flex items-center">
                <span className="hidden sm:inline">Patient Kiosk</span>
                <span className="sm:hidden text-sm">Kiosk</span>
              </Link>
              <Link to="/doctor" className="flex items-center gap-1.5 sm:gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium px-3 sm:px-4 py-2 rounded-md transition-colors">
                <Stethoscope className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Physician Dashboard</span>
                <span className="sm:hidden text-sm">Dashboard</span>
              </Link>
            </div>
          </div>
        </nav>
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Kiosk />} />
            <Route path="/doctor" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
