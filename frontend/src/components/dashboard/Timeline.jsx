import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, Activity, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export function Timeline({ timeline, data, triage }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-8 text-lg">
            <Clock className="w-5 h-5 text-indigo-600" /> Medical Timeline
          </h3>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-indigo-200 before:via-slate-200 before:to-transparent">
            
            {timeline.map((event, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-50 text-indigo-600 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                  <FileText className="w-4 h-4" />
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-indigo-500 rounded-r-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex flex-wrap items-center justify-between mb-4 gap-2 border-b border-slate-50 pb-3">
                    <div className="font-bold text-slate-800 text-[11px] tracking-widest uppercase">{event.type.replace('_', ' ')}</div>
                    <time className="text-[11px] font-mono font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-500">
                      {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'})}
                    </time>
                  </div>
                  
                  <ul className="text-sm text-slate-700 space-y-3">
                    {event.items.map((item, i) => (
                      <li key={i} className="flex flex-col bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="font-semibold text-slate-800">{item.name}</span>
                          <span className={`font-bold whitespace-nowrap ${item.abnormal ? 'text-rose-600' : 'text-slate-700'}`}>
                            {item.value || item.dosage} {item.unit || ''}
                            {item.abnormal && <span className="ml-2 text-[9px] font-black uppercase bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded shadow-sm">Abnormal</span>}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap justify-between items-center text-xs text-slate-500 gap-2">
                          <span className="font-medium">Source: {item.source}</span>
                          <span className={`flex items-center gap-1 font-mono font-bold ${item.requiresVerification ? 'text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded' : 'text-emerald-600'}`}>
                            Conf: {item.confidence}%
                          </span>
                        </div>
                        
                        {item.requiresVerification && (
                          <div className="mt-3 text-[10px] font-bold text-amber-700 bg-amber-100/50 p-2 rounded-lg flex items-center gap-1.5 border border-amber-200/50 uppercase tracking-wide">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Verify against original document
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
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-50 text-emerald-600 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500 rounded-r-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-3">
                    <div className="font-bold text-emerald-700 text-[11px] tracking-widest uppercase">CURRENT ENCOUNTER</div>
                    <time className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">Today</time>
                  </div>
                  
                  <div className="text-sm text-slate-700 space-y-2">
                    <div className="font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chief Complaint</span>
                      {data.chiefComplaint}
                    </div>
                    {triage?.requiresImmediateAttention && (
                      <div className="text-rose-700 font-bold flex items-center gap-1.5 mt-2 bg-rose-50 p-2.5 rounded-xl border border-rose-100 text-xs uppercase tracking-wide">
                        <ShieldAlert className="w-4 h-4"/> Priority Flag Triggered
                      </div>
                    )}
                  </div>
                </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
