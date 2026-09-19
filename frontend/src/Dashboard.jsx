import { useState } from 'react';
import { User, Activity, Search } from 'lucide-react';
import { PatientHeaderCard } from './components/dashboard/PatientHeaderCard';
import { TriageAlert } from './components/dashboard/TriageAlert';
import { AIInsightsCard } from './components/dashboard/AIInsightsCard';
import { ClinicalSummaryCard } from './components/dashboard/ClinicalSummaryCard';
import { Timeline } from './components/dashboard/Timeline';
import { Button } from './components/ui/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
  const [encounterId, setEncounterId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({});

  const fetchSummary = async (eId = encounterId) => {
    if (!eId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/summary/generate/${eId}`);
      const json = await res.json();
      if (json.status === 'complete') {
        setData(json.structuredSummary);
        setEditedFields({
          chiefComplaint: json.structuredSummary.chiefComplaint,
          hpi: json.structuredSummary.hpi,
          pastMedicalHistory: json.structuredSummary.pastMedicalHistory,
          medications: json.structuredSummary.medications,
          allergies: json.structuredSummary.allergies
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const payload = isEditing ? editedFields : null;
      
      const res = await fetch(`${API_URL}/api/summary/verify/${encounterId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edits: payload })
      });
      const result = await res.json();
      if (result.status === 'success') {
        setIsEditing(false);
        await fetchSummary();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  if (!data) return (
    <div className="p-8 sm:p-12 text-center max-w-lg mx-auto mt-10 sm:mt-20 bg-white rounded-3xl shadow-xl border border-slate-100">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-indigo-100/50">
        <Activity className="w-10 h-10 text-indigo-600" />
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 tracking-tight">Physician Dashboard</h3>
      <p className="text-slate-500 mb-10 leading-relaxed text-base sm:text-lg">
        Enter the Encounter ID from the Patient Kiosk to view the structured clinical summary.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 relative">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            value={encounterId}
            onChange={(e) => setEncounterId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchSummary()}
            placeholder="e.g. ENC-..."
            className="w-full pl-12 pr-4 py-4 text-lg border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-slate-50 focus:bg-white transition-colors"
          />
        </div>
        <Button 
          size="lg"
          onClick={() => fetchSummary(encounterId)} 
          loading={loading}
          className="w-full sm:w-auto h-[60px] text-lg rounded-2xl px-8 shadow-lg shadow-indigo-200"
        >
          Load Case
        </Button>
      </div>
    </div>
  );

  const { patient, triage, timeline } = data;

  let warnings = 0;
  timeline.forEach(t => t.items.forEach(i => { if (i.requiresVerification) warnings++; }));

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-12 gap-6 relative">
      
      {/* Top Status Banner */}
      <div className="col-span-1 xl:col-span-12 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Status</h1>
            <p className="font-bold text-slate-800 text-sm sm:text-base">PATIENT READY FOR CONSULTATION</p>
          </div>
        </div>
        <div className="flex gap-4 sm:gap-8 overflow-x-auto text-sm whitespace-nowrap hide-scrollbar pb-1 sm:pb-0">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> <span className="text-slate-500">History:</span> <span className="font-semibold text-slate-800">Complete</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> <span className="text-slate-500">Docs:</span> <span className="font-semibold text-slate-800">2 processed</span></div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${triage?.requiresImmediateAttention ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
            <span className="text-slate-500">Triage:</span> 
            {triage?.requiresImmediateAttention ? <span className="font-bold text-rose-600">Priority</span> : <span className="font-semibold text-slate-800">Routine</span>}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${data.isDraft ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            <span className="text-slate-500">Summary:</span> 
            {data.isDraft ? <span className="font-bold text-amber-600">Awaiting verification</span> : <span className="font-semibold text-emerald-600">Verified</span>}
          </div>
        </div>
      </div>

      {/* Sidebar: Patient Info & Triage & Insights */}
      <div className="xl:col-span-4 space-y-6">
        <PatientHeaderCard patient={patient} encounterId={encounterId} />
        <TriageAlert triage={triage} />
        <AIInsightsCard warnings={warnings} />
      </div>

      {/* Main Content: Structured Summary & Timeline */}
      <div className="xl:col-span-8 space-y-6 flex flex-col">
        <div className="flex-grow">
          <ClinicalSummaryCard 
             data={data}
             isEditing={isEditing}
             setIsEditing={setIsEditing}
             editedFields={editedFields}
             setEditedFields={setEditedFields}
             handleVerify={handleVerify}
             verifying={verifying}
          />
        </div>
        <Timeline timeline={timeline} data={data} triage={triage} />
      </div>

    </div>
  );
}
