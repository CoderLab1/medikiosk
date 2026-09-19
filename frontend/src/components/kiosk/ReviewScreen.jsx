import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Activity, Pill } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function ReviewScreen({ structuredHistory, uploadedDocsCount, onSubmit, loading }) {
  return (
    <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <Card className="max-w-2xl mx-auto shadow-xl rounded-3xl border-slate-100 overflow-hidden">
         <CardHeader className="bg-slate-50 border-b border-slate-100 px-8 py-6 text-center">
             <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-800">Review Your Information</CardTitle>
             <p className="text-slate-500 mt-2">This structured data will be securely sent to your doctor.</p>
         </CardHeader>
         
         <CardContent className="p-8 space-y-6 bg-white">
            
            <div className="grid sm:grid-cols-2 gap-4">
               <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-2">
                     <Activity className="w-4 h-4" /> Chief Complaint
                  </div>
                  <div className="text-lg text-slate-800 font-medium capitalize">
                     {structuredHistory?.chiefComplaint || "Not specified"}
                  </div>
                  {structuredHistory?.hpi?.severity && (
                     <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        Severity: <Badge variant="secondary">{structuredHistory.hpi.severity}</Badge>
                     </div>
                  )}
               </div>

               <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
                     <FileText className="w-4 h-4" /> Scanned Documents
                  </div>
                  <div className="text-lg text-slate-800 font-medium">
                     {uploadedDocsCount} Record{uploadedDocsCount !== 1 ? 's' : ''} Uploaded
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                     Status: <Badge variant="success">Processed</Badge>
                  </div>
               </div>
            </div>

            {/* Minor details if available */}
            {(structuredHistory?.medications?.length > 0 || structuredHistory?.allergies?.length > 0) && (
               <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                     <Pill className="w-4 h-4" /> Current Medications & Allergies
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {structuredHistory?.medications?.map((m, i) => <Badge key={i} variant="outline" className="bg-white">{m}</Badge>)}
                     {structuredHistory?.allergies?.map((m, i) => <Badge key={i} variant="destructive">{m} (Allergy)</Badge>)}
                  </div>
               </div>
            )}

            <Button 
               variant="success"
               size="lg"
               onClick={onSubmit} 
               loading={loading}
               className="w-full text-xl font-semibold py-7 mt-4 rounded-2xl shadow-lg shadow-emerald-200/50"
            >
               Confirm & Submit to Doctor
            </Button>
         </CardContent>
      </Card>
    </motion.div>
  );
}
