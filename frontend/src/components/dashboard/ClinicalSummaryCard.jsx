import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, ShieldCheck, CheckCircle, Edit3, Save, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function ClinicalSummaryCard({ 
  data, 
  isEditing, 
  setIsEditing, 
  editedFields, 
  setEditedFields, 
  handleVerify, 
  verifying 
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
      <Card className="flex-grow flex flex-col border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50/80 px-6 sm:px-8 py-5 border-b border-slate-100 flex flex-wrap gap-4 justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Structured Clinical Intake
          </h2>
          {data.isDraft ? (
            <Badge variant="warning" className="px-3 py-1 text-xs border border-amber-200 shadow-sm">
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> AI Draft - Verification Required
            </Badge>
          ) : (
            <Badge variant="success" className="px-3 py-1 text-xs border border-emerald-200 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Physician Verified
            </Badge>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 flex-grow bg-white">
          
          {/* Chief Complaint */}
          <div>
            <h4 className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-3">Chief Complaint</h4>
            {isEditing ? (
                <input 
                  type="text" 
                  value={editedFields.chiefComplaint} 
                  onChange={e => setEditedFields({...editedFields, chiefComplaint: e.target.value})} 
                  className="w-full text-slate-800 text-lg font-semibold bg-white p-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring-0 outline-none transition-colors" 
                />
            ) : (
                <div className="text-slate-800 text-lg font-semibold bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 shadow-sm">{data.chiefComplaint}</div>
            )}
          </div>
          
          {/* HPI */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">History of Present Illness (HPI)</h4>
            {isEditing ? (
                <textarea 
                  rows="4" 
                  value={editedFields.hpi} 
                  onChange={e => setEditedFields({...editedFields, hpi: e.target.value})} 
                  className="w-full text-slate-700 text-base leading-relaxed bg-white p-5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-colors resize-none" 
                />
            ) : (
                <p className="text-slate-700 text-base leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-100 shadow-sm">{data.hpi}</p>
            )}
          </div>
          
          {/* Grid for PMH and Meds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Past Medical History</h4>
              {isEditing ? (
                <textarea 
                  rows="3" 
                  value={editedFields.pastMedicalHistory} 
                  onChange={e => setEditedFields({...editedFields, pastMedicalHistory: e.target.value})} 
                  className="w-full text-sm font-medium bg-white p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-colors resize-none flex-grow" 
                />
              ) : (
                <p className="text-slate-700 font-medium text-sm flex-grow bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">{data.pastMedicalHistory}</p>
              )}
            </div>
            
            <div className="flex flex-col">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Current Medications</h4>
              {isEditing ? (
                <textarea 
                  rows="3" 
                  value={editedFields.medications} 
                  onChange={e => setEditedFields({...editedFields, medications: e.target.value})} 
                  className="w-full text-sm font-medium bg-white p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-colors resize-none flex-grow" 
                />
              ) : (
                <p className="text-slate-700 font-medium text-sm flex-grow bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">{data.medications}</p>
              )}
            </div>
          </div>
          
          {/* Correction History */}
          {data.correctionHistory && data.correctionHistory.length > 0 && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" /> Revision History
              </h4>
              <div className="space-y-3">
                {data.correctionHistory.map((ch, i) => (
                  <div key={i} className="text-sm bg-slate-50/80 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                      <div className="leading-relaxed">
                        <span className="font-semibold text-slate-600 capitalize text-xs tracking-wider uppercase mr-2">{ch.field}:</span>
                        <span className="text-rose-500 line-through mr-2 decoration-rose-300">{ch.original}</span>
                        <span className="text-emerald-600 font-medium">{ch.edited}</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-400 font-mono tracking-wider bg-white px-2 py-1 rounded-md border border-slate-100 shrink-0">
                        {new Date(ch.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
        
        {/* Footer Actions */}
        <div className="bg-slate-50/80 px-6 sm:px-8 py-5 border-t border-slate-100 flex flex-wrap justify-end gap-3 sm:gap-4 mt-auto">
          {!data.isDraft && !isEditing ? (
            <div className="text-sm text-emerald-600 font-semibold my-auto mr-auto flex items-center gap-2">
              <CheckCircle className="w-4 h-4"/> Verified by Physician
            </div>
          ) : null}
          
          {isEditing ? (
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" /> Edit Summary
            </Button>
          )}

          {(data.isDraft || isEditing) && (
            <Button 
              onClick={handleVerify}
              loading={verifying}
              className="px-6 shadow-md"
            >
              {!verifying && <Save className="w-4 h-4 mr-2" />} 
              {isEditing ? 'Save & Verify' : 'Verify & Accept'}
            </Button>
          )}
        </div>
        
      </Card>
    </motion.div>
  );
}
