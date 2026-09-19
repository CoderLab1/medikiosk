import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export function TriageAlert({ triage }) {
  if (!triage || !triage.requiresImmediateAttention) return null;

  const isUrgent = triage.priority === 'URGENT';
  
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className={`relative overflow-hidden border ${isUrgent ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className={`absolute -right-4 -top-4 opacity-10 pointer-events-none ${isUrgent ? 'text-rose-900' : 'text-amber-900'}`}>
           <ShieldAlert className="w-32 h-32" />
        </div>
        <CardContent className="p-6 relative z-10">
          <h3 className={`font-bold flex items-center gap-2 mb-2 ${isUrgent ? 'text-rose-800' : 'text-amber-800'}`}>
            <ShieldAlert className="w-5 h-5" /> PRIORITY TRIAGE ALERT
          </h3>
          <p className={`text-sm font-medium mb-4 ${isUrgent ? 'text-rose-700' : 'text-amber-700'}`}>
            {triage.message}
          </p>
          <div className="flex flex-wrap gap-2">
            {triage.flags.map((flag, i) => (
              <span key={i} className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border bg-white shadow-sm ${isUrgent ? 'text-rose-700 border-rose-200' : 'text-amber-700 border-amber-200'}`}>
                {flag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
