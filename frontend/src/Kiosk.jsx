import { useState, useEffect, useRef } from 'react';
import { RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { speechService } from './services/speechService';
import { ProgressStepper } from './components/ui/ProgressStepper';
import { Alert } from './components/ui/Alert';
import { WelcomeScreen } from './components/kiosk/WelcomeScreen';
import { ConsentScreen } from './components/kiosk/ConsentScreen';
import { HistoryScreen } from './components/kiosk/HistoryScreen';
import { UploadScreen } from './components/kiosk/UploadScreen';
import { ReviewScreen } from './components/kiosk/ReviewScreen';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const STEPS = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'consent', label: 'Consent' },
  { id: 'chat', label: 'History' },
  { id: 'upload', label: 'Records' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Complete' }
];

export default function Kiosk() {
  const [encounterId, setEncounterId] = useState(null);
  const [patient, setPatient] = useState(null);
  const [structuredHistory, setStructuredHistory] = useState(null);
  const [uploadedDocsCount, setUploadedDocsCount] = useState(0);
  
  const [stage, setStage] = useState('welcome');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState('text');
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadStatus, setUploadStatus] = useState(''); 

  const resetDemo = () => {
    setEncounterId(null);
    setPatient(null);
    setStructuredHistory(null);
    setUploadedDocsCount(0);
    setStage('welcome');
    setMessages([]);
    setInput('');
    setOptions([]);
    setLoading(false);
    setInputMode('text');
    setIsListening(false);
    setErrorMsg('');
    setUploadStatus('');
    speechService.stopListening();
    window.speechSynthesis.cancel();
  };

  const startDemo = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${API_URL}/api/encounters/start`, { method: 'POST' });
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      setEncounterId(data.encounterId);
      setPatient(data.patient);
      setStage('consent');
    } catch (err) {
      setErrorMsg("Failed to start demo. Ensure backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const acceptConsent = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/encounters/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encounterId, language: 'en' })
      });
      setStage('chat');
      const initialGreeting = 'Namaste! Please tell me your chief complaint today, or tap the mic to speak.';
      setMessages([{ type: 'ai', text: initialGreeting }]);
      setOptions(["Chest Pain", "Fever", "Cough", "Stomach Ache", "Headache"]);
      if (speechService.isSupported) {
        speechService.speak(initialGreeting);
      }
    } catch (err) {
      setErrorMsg("Error communicating with server.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    if (text === 'Go to Upload') {
      setStage('upload');
      return;
    }
    
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInput('');
    setOptions([]);
    setLoading(true);
    setErrorMsg('');
    
    try {
      const res = await fetch(`${API_URL}/api/chat/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encounterId, message: text })
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      
      setMessages(prev => [...prev, { type: 'ai', text: data.reply }]);
      if (data.options && data.options.length > 0) {
        setOptions(data.options);
      }
      
      if (data.isComplete || (data.options && data.options[0] === 'Go to Upload')) {
         setTimeout(() => setStage('upload'), 2000);
      }
    } catch (err) {
      setErrorMsg("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      setErrorMsg('');
      speechService.startListening(
        (transcript) => {
          setIsListening(false);
          setInput(transcript);
        },
        (error) => {
          setIsListening(false);
          setErrorMsg(error === 'not-allowed' ? "Microphone permission denied." : "Speech recognition error.");
          setInputMode('text');
        }
      );
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      setUploadStatus('Uploading...');
      await new Promise(r => setTimeout(r, 800));
      setUploadStatus('Analyzing...');
      await new Promise(r => setTimeout(r, 800));
      setUploadStatus('Extracting...');
      await new Promise(r => setTimeout(r, 800));
      setUploadStatus('Structuring...');
      
      const res = await fetch(`${API_URL}/api/documents/upload`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encounterId, fileType: 'lab_and_rx' })
      });
      
      if (!res.ok) throw new Error("Upload failed");
      
      setUploadStatus('Complete');
      setUploadedDocsCount(2);
      
      await new Promise(r => setTimeout(r, 600));
      
      const encRes = await fetch(`${API_URL}/api/encounters/${encounterId}`);
      const encData = await encRes.json();
      setStructuredHistory(encData.encounter.structuredHistory);
      
      setStage('review');
    } catch (err) {
      setErrorMsg("Document upload failed.");
      setUploadStatus('');
    } finally {
      setLoading(false);
    }
  };

  const submitToDoctor = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/summary/generate/${encounterId}`);
      setStage('done');
    } catch (err) {
      setErrorMsg("Failed to submit to doctor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 mt-2 sm:mt-6 relative min-h-[80vh]">
      
      <button 
        onClick={resetDemo} 
        className="absolute top-2 right-4 sm:right-8 text-slate-400 hover:text-indigo-600 flex items-center gap-1.5 text-sm font-semibold transition-colors bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-slate-100 z-50"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Restart Demo
      </button>

      {/* Progress Indicator */}
      <div className="mb-10 px-2 sm:px-6 mt-4">
         <ProgressStepper steps={STEPS} currentStep={stage} />
      </div>

      {errorMsg && (
        <Alert variant="destructive" className="mb-6 shadow-sm animate-in fade-in slide-in-from-top-4">
          <AlertTriangle className="h-4 w-4" />
          <h5 className="font-semibold">Error</h5>
          <p>{errorMsg}</p>
        </Alert>
      )}

      <AnimatePresence mode="wait">
        {stage === 'welcome' && <WelcomeScreen onStart={startDemo} loading={loading} />}
        
        {stage === 'consent' && <ConsentScreen patient={patient} onAccept={acceptConsent} loading={loading} />}
        
        {stage === 'chat' && (
          <HistoryScreen 
            messages={messages} 
            loading={loading}
            inputMode={inputMode}
            setInputMode={setInputMode}
            options={options}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            isListening={isListening}
            toggleListen={toggleListen}
            speechServiceSupported={speechService.isSupported}
            handleSpeakText={(text) => speechService.speak(text)}
          />
        )}
        
        {stage === 'upload' && <UploadScreen onUpload={handleUpload} loading={loading} uploadStatus={uploadStatus} />}
        
        {stage === 'review' && (
          <ReviewScreen 
            structuredHistory={structuredHistory}
            uploadedDocsCount={uploadedDocsCount}
            onSubmit={submitToDoctor}
            loading={loading}
          />
        )}
        
        {stage === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 sm:p-14 rounded-3xl shadow-xl text-center border border-slate-100 max-w-2xl mx-auto">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-100/50">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 tracking-tight">You're all set!</h2>
            <p className="text-lg sm:text-xl text-slate-500 mb-10 leading-relaxed max-w-md mx-auto">
              Your medical history and documents have been structured and sent to the doctor. You may now enter the consultation room.
            </p>
            <div className="text-sm font-mono text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200 inline-flex items-center gap-2">
              <span className="font-semibold text-slate-700">Encounter ID:</span> {encounterId}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
