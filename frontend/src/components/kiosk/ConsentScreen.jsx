import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export function ConsentScreen({ patient, onAccept, loading }) {
  return (
    <motion.div key="consent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <Card className="max-w-2xl mx-auto shadow-xl rounded-3xl border-slate-100">
        <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-3xl pb-6 pt-8 px-8 sm:px-12">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-2xl">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 shrink-0" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-800">Privacy & Consent</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8 sm:p-12">
          <div className="text-slate-600 space-y-5 mb-10 text-base sm:text-lg leading-relaxed">
            <p className="text-xl text-slate-800">Hello <strong className="font-semibold">{patient?.name || 'Patient'}</strong>,</p>
            <p>We will ask you a few questions about your health and scan any previous documents you have.</p>
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
              <ul className="list-disc pl-5 space-y-3 font-medium text-slate-700">
                <li>Your data is securely sent to your doctor.</li>
                <li>The AI <strong className="text-slate-900">does not diagnose</strong> you.</li>
                <li>Your information remains strictly confidential.</li>
              </ul>
            </div>
          </div>
          
          <Button 
            variant="success"
            size="lg"
            onClick={onAccept}
            loading={loading}
            className="w-full text-lg sm:text-xl rounded-2xl py-6 shadow-lg shadow-emerald-200/50"
          >
            I Understand & Agree
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
