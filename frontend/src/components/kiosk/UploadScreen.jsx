import React from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

export function UploadScreen({ onUpload, loading, uploadStatus }) {
  return (
    <motion.div key="upload" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
      <Card className="max-w-2xl mx-auto shadow-xl border-slate-100 rounded-3xl text-center overflow-hidden">
        <CardContent className="p-8 sm:p-14">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-indigo-100/50">
            <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">Upload Previous Records</h2>
          <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
            Please scan your previous prescriptions and lab reports. Our AI will automatically structure them for the doctor.
          </p>
          
          {uploadStatus ? (
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 text-indigo-600 font-semibold justify-center mb-4 text-lg">
                {uploadStatus !== 'Complete' && <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>}
                {uploadStatus === 'Complete' && <CheckCircle className="w-7 h-7 text-emerald-500" />}
                <span className={uploadStatus === 'Complete' ? 'text-emerald-600' : ''}>{uploadStatus}</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mt-6">
                <div className="bg-indigo-600 h-full transition-all duration-500 ease-out" style={{
                  width: uploadStatus === 'Uploading...' ? '25%' : 
                         uploadStatus === 'Analyzing...' ? '50%' : 
                         uploadStatus === 'Extracting...' ? '75%' : 
                         uploadStatus === 'Structuring...' ? '90%' : '100%'
                }}></div>
              </div>
            </div>
          ) : (
            <Button 
              size="lg"
              onClick={onUpload} 
              disabled={loading}
              className="w-full text-lg sm:text-xl font-semibold py-6 rounded-2xl shadow-lg shadow-indigo-200/50"
            >
              <FileText className="w-6 h-6 mr-3" /> Scan Documents (Demo)
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
