import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

export function WelcomeScreen({ onStart, loading }) {
  return (
    <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <Card className="max-w-2xl mx-auto overflow-hidden border-0 shadow-2xl rounded-3xl">
        <div className="bg-indigo-600 h-2 w-full"></div>
        <CardContent className="p-8 sm:p-12 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 tracking-tight">Welcome to MediKiosk</h1>
          <p className="text-base sm:text-lg text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
            A seamless, AI-assisted clinical intake system designed to help the doctor understand your health better before you enter the room.
          </p>
          
          <Button 
            size="lg"
            onClick={onStart} 
            loading={loading}
            className="w-full sm:w-auto text-lg rounded-full font-semibold px-10 py-6 shadow-lg shadow-indigo-200"
          >
            {!loading && <>Start Consultation <ArrowRight className="ml-2 w-5 h-5" /></>}
          </Button>
          
          <p className="mt-6 text-xs text-slate-400 font-medium">
            SIH Demo Mode • Patient: Ramesh Kumar, 52Y Male
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
