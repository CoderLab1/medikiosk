import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export function PatientHeaderCard({ patient, encounterId }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <Card className="relative overflow-hidden border-slate-200">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <User className="w-32 h-32 text-indigo-900" />
        </div>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">{patient.name}</h2>
          <p className="text-slate-500 font-medium mb-6 text-sm">{patient.age} Years • {patient.gender}</p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ABHA ID</span>
              <span className="text-sm text-slate-800 font-mono font-medium">{patient.id}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Encounter</span>
              <span className="text-sm text-slate-800 font-mono font-medium">{encounterId}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
