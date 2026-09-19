import React from 'react';
import { motion } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export function AIInsightsCard({ warnings }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-slate-900 text-slate-300 border-slate-800 shadow-lg">
        <CardContent className="p-6">
          <h3 className="font-bold text-white flex items-center gap-2 mb-5 uppercase tracking-widest text-xs">
            <Info className="w-4 h-4 text-indigo-400" /> AI Intake Insights
          </h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0"/> 
              <span className="text-slate-200">Chief complaint captured</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0"/> 
              <span className="text-slate-200">HPI fields completed</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0"/> 
              <span className="text-slate-200">Previous documents processed</span>
            </li>
            
            {warnings > 0 && (
              <li className="flex items-start gap-3 mt-5 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-inner">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0"/> 
                <span className="text-amber-100 text-sm leading-relaxed">
                  {warnings} field(s) marked uncertain. Please verify against the original uploaded documents.
                </span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
