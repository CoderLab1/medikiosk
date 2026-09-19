import { useState, useEffect } from 'react';
import { User, AlertTriangle, FileText, CheckCircle, Activity, Clock, ShieldAlert, Check, Edit3, Save, Info, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

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
        // Refresh data to get correction history
        await fetchSummary();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  if (!data) return (
    <div className="p-12 text-center max-w-md mx-auto mt-10 bg-white rounded-3xl shadow-sm border border-slate-200">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Activity className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Physician Dashboard</h3>
      <p className="text-slate-500 mb-6 leading-relaxed">Enter the Encounter ID from the Patient Kiosk to view the structured clinical summary.</p>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={encounterId}
          onChange={(e) => setEncounterId(e.target.value)}
          placeholder="e.g. ENC-12345"
          className="flex-grow px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-50"
        />
        <button onClick={() => fetchSummary(encounterId)} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all">
          Load
        </button>
      </div>
    </div>
  );

  const { patient, triage, timeline, correctionHistory } = data;

  // Calculate missing or warned fields for AI insights
  let warnings = 0;
  timeline.forEach(t => t.items.forEach(i => { if (i.requiresVerification) warnings++; }));

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
      
      {/* Top Level Status Banner */}
      <div className="col-span-1 lg:col-span-12 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Status</h1>
            <p className="font-bold text-slate-800">PATIENT READY FOR CONSULTATION</p>
          </div>
        </div>
        <div className="flex gap-4 sm:gap-8 overflow-x-auto text-sm whitespace-nowrap">
          <div><span className="text-slate-500">History:</span> <span className="font-semibold text-emerald-600">✓ Complete</span></div>
          <div><span className="text-slate-500">Docs:</span> <span className="font-semibold text-emerald-600">✓ 2 processed</span></div>
          <div>
            <span className="text-slate-500">Triage:</span> 
            {triage?.requiresImmediateAttention ? <span className="font-bold text-rose-600 ml-1">🚨 Priority</span> : <span className="font-semibold text-emerald-600 ml-1">✓ Routine</span>}
          </div>
          <div>
            <span className="text-slate-500">Summary:</span> 
            {data.isDraft ? <span className="font-bold text-amber-600 ml-1">⚠ Awaiting verification</span> : <span className="font-semibold text-emerald-600 ml-1">✓ Verified</span>}
          </div>
        </div>
      </div>

      {/* Sidebar: Patient Info & Triage & Insights */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Patient Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <User className="w-24 h-24" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">{patient.name}</h2>
          <p className="text-slate-500 font-medium mb-6">{patient.age} Years • {patient.gender}</p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase">ABHA ID</span>
              <span className="text-sm text-slate-800 font-mono font-medium">{patient.id}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase">Encounter</span>
              <span className="text-sm text-slate-800 font-mono font-medium">{encounterId}</span>
            </div>
          </div>
        </motion.div>

        {/* Priority Alert */}
        {triage && triage.requiresImmediateAttention && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-2xl border p-6 shadow-sm relative overflow-hidden ${triage.priority === 'URGENT' ? 'bg-rose-50 border-rose-200' : 'bg-orange-50 border-orange-200'}`}>
            <div className="absolute -right-4 -top-4 opacity-10">
               <ShieldAlert className="w-32 h-32" />
            </div>
            <h3 className={`font-bold flex items-center gap-2 mb-2 ${triage.priority === 'URGENT' ? 'text-rose-800' : 'text-orange-800'}`}>
              <ShieldAlert className="w-6 h-6" /> PRIORITY TRIAGE ALERT
            </h3>
            <p className={`text-sm font-medium mb-4 ${triage.priority === 'URGENT' ? 'text-rose-700' : 'text-orange-700'}`}>
              {triage.message}
            </p>
            <div className="flex flex-wrap gap-2 relative z-10">
              {triage.flags.map((flag, i) => (
                <span key={i} className={`text-xs font-bold px-3 py-1.5 rounded-full border bg-white ${triage.priority === 'URGENT' ? 'text-rose-700 border-rose-200' : 'text-orange-700 border-orange-200'}`}>
                  {flag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* AI Transparency Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-6 text-slate-300">
          <h3 className="font-bold text-white flex items-center gap-2 mb-4 uppercase tracking-widest text-xs">
            <Info className="w-4 h-4 text-indigo-400" /> AI Intake Insights
          </h3>
          <ul className="space-y-3 text-sm font-medium">
            <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0"/> Chief complaint captured</li>
            <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0"/> HPI fields completed</li>
            <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0"/> Previous documents processed</li>
            {warnings > 0 && (
              <li className="flex items-start gap-3 mt-4 bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5"/> 
                <span className="text-amber-100">{warnings} field(s) require verification against original documents.</span>
              </li>
            )}
          </ul>
        </motion.div>

      </div>

      {/* Main Content: Structured Summary & Timeline */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Clinical Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-50 px-6 sm:px-8 py-5 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" /> Structured Clinical Intake
            </h2>
            {data.isDraft ? (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-amber-200">
                <AlertTriangle className="w-4 h-4" /> AI Draft - Verification Required
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-emerald-200">
                <ShieldCheck className="w-4 h-4" /> Physician Verified
              </span>
            )}
          </div>
          
          <div className="p-6 sm:p-8 space-y-8 flex-grow">
            <div>
              <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Chief Complaint</h4>
              {isEditing ? (
                 <input type="text" value={editedFields.chiefComplaint} onChange={e => setEditedFields({...editedFields, chiefComplaint: e.target.value})} className="w-full text-slate-800 text-xl font-medium bg-white p-4 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              ) : (
                 <p className="text-slate-800 text-xl font-medium bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">{data.chiefComplaint}</p>
              )}
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">History of Present Illness (HPI)</h4>
              {isEditing ? (
                 <textarea rows="4" value={editedFields.hpi} onChange={e => setEditedFields({...editedFields, hpi: e.target.value})} className="w-full text-slate-700 text-lg leading-relaxed bg-white p-6 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              ) : (
                 <p className="text-slate-700 text-lg leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">{data.hpi}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Past Medical History</h4>
                {isEditing ? (
                  <textarea rows="2" value={editedFields.pastMedicalHistory} onChange={e => setEditedFields({...editedFields, pastMedicalHistory: e.target.value})} className="w-full text-sm font-medium bg-white p-3 rounded-lg border border-slate-300 flex-grow" />
                ) : (
                  <p className="text-slate-700 font-medium text-sm flex-grow">{data.pastMedicalHistory}</p>
                )}
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Current Medications</h4>
                {isEditing ? (
                  <textarea rows="2" value={editedFields.medications} onChange={e => setEditedFields({...editedFields, medications: e.target.value})} className="w-full text-sm font-medium bg-white p-3 rounded-lg border border-slate-300 flex-grow" />
                ) : (
                  <p className="text-slate-700 font-medium text-sm flex-grow">{data.medications}</p>
                )}
              </div>
            </div>
            
            {/* Correction History */}
            {correctionHistory && correctionHistory.length > 0 && (
              <div className="mt-8 border-t border-slate-200 pt-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Correction History
                </h4>
                <div className="space-y-3">
                  {correctionHistory.map((ch, i) => (
                    <div key={i} className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                       <div>
                         <span className="font-semibold text-slate-700 capitalize">{ch.field}: </span>
                         <span className="text-rose-500 line-through mr-2">{ch.original}</span>
                         <span className="text-emerald-600 font-bold">{ch.edited}</span>
                       </div>
                       <div className="text-xs text-slate-400 font-mono">{new Date(ch.timestamp).toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
          
          <div className="bg-slate-50 px-6 sm:px-8 py-5 border-t border-slate-200 flex flex-wrap justify-end gap-3 sm:gap-4 mt-auto">
            {!data.isDraft && !isEditing ? (
              <p className="text-sm text-slate-500 font-medium my-auto mr-auto flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500"/> Verified by Physician</p>
            ) : null}
            
            {isEditing ? (
              <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 font-semibold rounded-xl transition-colors">
                Cancel
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 text-slate-700 hover:bg-slate-200 font-semibold rounded-xl transition-colors flex items-center gap-2 border border-slate-200 bg-white">
                <Edit3 className="w-4 h-4" /> Edit Summary
              </button>
            )}

            {data.isDraft || isEditing ? (
              <button 
                onClick={handleVerify}
                disabled={verifying}
                className="px-6 sm:px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
              >
                {verifying ? 'Saving...' : <><Save className="w-4 h-4" /> {isEditing ? 'Save & Verify' : 'Verify & Accept'}</>}
              </button>
            ) : null}
          </div>
        </motion.div>

        {/* Medical Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-8 text-lg">
            <Clock className="w-5 h-5 text-indigo-600" /> Medical Timeline
          </h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-100 before:via-slate-200 before:to-transparent">
            {timeline.map((event, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-[3px] border-white bg-indigo-100 text-indigo-600 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative">
                  <div className="absolute top-0 right-0 w-2 h-full bg-indigo-600 rounded-r-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
                    <div className="font-bold text-slate-700 text-sm tracking-wide">{event.type.replace('_', ' ').toUpperCase()}</div>
                    <time className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'})}</time>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-3">
                    {event.items.map((item, i) => (
                      <li key={i} className="flex flex-col bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-slate-800">{item.name}</span>
                          <span className={`font-bold whitespace-nowrap ${item.abnormal ? 'text-rose-600' : 'text-slate-600'}`}>
                            {item.value || item.dosage} {item.unit || ''}
                            {item.abnormal && <span className="ml-1 text-[10px] uppercase bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">Abnormal</span>}
                          </span>
                        </div>
                        <div className="flex flex-wrap justify-between items-center text-xs text-slate-400 mt-2 gap-2">
                          <span className="font-medium bg-white px-2 py-1 border border-slate-200 rounded text-slate-500">Source: {item.source}</span>
                          <span className={`flex items-center gap-1 font-mono font-medium ${item.requiresVerification ? 'text-amber-600' : 'text-emerald-600'}`}>
                            Conf: {item.confidence}%
                            {item.requiresVerification && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" title="Please verify original document" />}
                          </span>
                        </div>
                        {item.requiresVerification && (
                          <div className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 p-1.5 rounded flex items-center gap-1 border border-amber-100">
                            <AlertTriangle className="w-3 h-3" /> VERIFY AGAINST ORIGINAL DOCUMENT
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            
            {/* Current Encounter Node */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-[3px] border-white bg-emerald-100 text-emerald-600 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-slate-700 text-sm tracking-wide">CURRENT ENCOUNTER</div>
                    <time className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">Today</time>
                  </div>
                  <div className="mt-3 text-sm text-slate-600 space-y-1">
                    <div className="font-medium">Chief Complaint: {data.chiefComplaint}</div>
                    {triage?.requiresImmediateAttention && <div className="text-rose-600 font-bold flex items-center gap-1 mt-2"><ShieldAlert className="w-4 h-4"/> Priority Flag</div>}
                  </div>
                </div>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
