import { useState, useEffect, useRef } from 'react';
import { Mic, Send, Upload, FileText, CheckCircle, ArrowRight, ShieldCheck, Activity, Volume2, Keyboard, RotateCcw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { speechService } from './services/speechService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Kiosk() {
  const [encounterId, setEncounterId] = useState(null);
  const [patient, setPatient] = useState(null);
  const [structuredHistory, setStructuredHistory] = useState(null);
  const [uploadedDocsCount, setUploadedDocsCount] = useState(0);
  
  const [stage, setStage] = useState('welcome'); // welcome, consent, chat, upload, review, done
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState('text'); // text or voice
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadStatus, setUploadStatus] = useState(''); // '', 'Uploading...', 'Analyzing...', 'Extracting...', 'Structuring...', 'Complete'

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

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

  const handleSpeakText = (text) => {
    speechService.speak(text);
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
      
      // Fetch encounter data for review screen
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

  const progressSteps = ['welcome', 'consent', 'chat', 'upload', 'review', 'done'];
  const currentIndex = progressSteps.indexOf(stage);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4 sm:mt-8 relative">
      
      <button onClick={resetDemo} className="absolute top-0 right-4 sm:right-6 text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-medium transition-colors">
        <RotateCcw className="w-4 h-4" /> Reset Demo
      </button>

      {/* Progress Indicator */}
      {stage !== 'welcome' && (
        <div className="mb-6 mt-4">
          <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-slate-400 mb-2 px-1 sm:px-2">
            <span className={currentIndex >= 1 ? 'text-indigo-600' : ''}>Consent</span>
            <span className={currentIndex >= 2 ? 'text-indigo-600' : ''}>History</span>
            <span className={currentIndex >= 3 ? 'text-indigo-600' : ''}>Documents</span>
            <span className={currentIndex >= 4 ? 'text-indigo-600' : ''}>Review</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-500 ease-out" 
              style={{ width: `${((currentIndex - 1) / (progressSteps.length - 2)) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 bg-rose-50 text-rose-700 p-3 rounded-lg border border-rose-200 flex items-center gap-2 text-sm font-medium animate-pulse">
          <AlertTriangle className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      <AnimatePresence mode="wait">
        {stage === 'welcome' && (
          <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Welcome to MediKiosk</h1>
            <p className="text-base sm:text-lg text-slate-500 mb-10 max-w-lg mx-auto">A seamless, AI-assisted clinical intake system designed to help the doctor understand your health better before you enter the room.</p>
            
            <button 
              onClick={startDemo} 
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg sm:text-xl font-semibold px-8 py-4 rounded-full transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 mx-auto w-full sm:w-auto"
            >
              {loading ? 'Starting...' : <>Start SIH DEMO MODE <ArrowRight /></>}
            </button>
            <p className="mt-4 text-xs text-slate-400 font-mono">Demo Patient: Ramesh Kumar, 52Y Male</p>
          </motion.div>
        )}

        {stage === 'consent' && (
          <motion.div key="consent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500 shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Privacy & Consent</h2>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl text-slate-600 space-y-4 mb-8 text-base sm:text-lg border border-slate-200">
              <p>Hello <strong>{patient?.name}</strong>,</p>
              <p>We will ask you a few questions about your health and scan any previous documents you have.</p>
              <ul className="list-disc pl-5 space-y-2 font-medium">
                <li>Your data is securely sent to your doctor.</li>
                <li>The AI <strong>does not diagnose</strong> you.</li>
                <li>Your information remains strictly confidential.</li>
              </ul>
            </div>
            
            <button 
              onClick={acceptConsent}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg sm:text-xl font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200"
            >
              I Understand & Agree
            </button>
          </motion.div>
        )}

        {stage === 'chat' && (
          <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-[600px] border border-slate-100">
            <div className="bg-indigo-600 p-4 sm:p-5 text-white flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 sm:gap-3">
                <Activity className="animate-pulse w-5 h-5" /> AI Intake Assistant
              </h2>
              <div className="flex bg-indigo-700/50 rounded-lg p-1">
                <button onClick={() => setInputMode('voice')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-1 ${inputMode === 'voice' ? 'bg-white text-indigo-700 shadow' : 'text-indigo-100'}`}><Mic className="w-4 h-4"/> Speak</button>
                <button onClick={() => setInputMode('text')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-1 ${inputMode === 'text' ? 'bg-white text-indigo-700 shadow' : 'text-indigo-100'}`}><Keyboard className="w-4 h-4"/> Type</button>
              </div>
            </div>
            
            <div className="flex-grow p-4 sm:p-6 overflow-y-auto bg-slate-50/50 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start group'}`}>
                  <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 shadow-sm text-base sm:text-lg relative ${m.type === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'}`}>
                    {m.text}
                    {m.type === 'ai' && speechService.isSupported && (
                      <button onClick={() => handleSpeakText(m.text)} className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-indigo-600 bg-white rounded-full shadow-sm border border-slate-100">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 sm:p-5 bg-white border-t border-slate-100">
              {options.length > 0 && inputMode === 'text' && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {options.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => sendMessage(opt)}
                      className="px-4 sm:px-5 py-2 sm:py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-sm sm:text-base font-semibold transition-colors border border-indigo-100 shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              
              {inputMode === 'text' ? (
                <div className="flex gap-2 sm:gap-3">
                  <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                    placeholder="Type your response..." 
                    className="flex-grow border border-slate-200 rounded-full px-4 sm:px-6 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-50"
                  />
                  <button onClick={() => sendMessage(input)} className="p-3 sm:p-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors shadow-md shadow-indigo-200 shrink-0">
                    <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <button 
                    onClick={toggleListen}
                    className={`p-6 rounded-full transition-all shadow-lg flex items-center justify-center mb-4 ${isListening ? 'bg-rose-500 shadow-rose-200 animate-pulse' : 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700'}`}
                  >
                    <Mic className="w-8 h-8 text-white" />
                  </button>
                  <div className="text-slate-500 font-medium text-sm">
                    {isListening ? 'Listening... tap to stop' : 'Tap to start speaking'}
                  </div>
                  {input && (
                     <div className="mt-4 flex gap-2 w-full">
                       <input type="text" value={input} onChange={e=>setInput(e.target.value)} className="flex-grow border border-slate-200 rounded-full px-4 py-2 bg-slate-50" />
                       <button onClick={() => sendMessage(input)} className="bg-indigo-600 text-white px-4 rounded-full font-medium">Send</button>
                     </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {stage === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl text-center border border-slate-100 max-w-2xl mx-auto">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">Upload Previous Records</h2>
            <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-md mx-auto">Please scan your previous prescriptions and lab reports. Our AI will automatically structure them for the doctor.</p>
            
            {uploadStatus ? (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 text-indigo-600 font-semibold justify-center mb-2">
                  {uploadStatus !== 'Complete' && <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>}
                  {uploadStatus === 'Complete' && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                  <span className={uploadStatus === 'Complete' ? 'text-emerald-600' : ''}>{uploadStatus}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-4">
                  <div className="bg-indigo-600 h-full transition-all duration-300" style={{
                    width: uploadStatus === 'Uploading...' ? '25%' : 
                           uploadStatus === 'Analyzing...' ? '50%' : 
                           uploadStatus === 'Extracting...' ? '75%' : 
                           uploadStatus === 'Structuring...' ? '90%' : '100%'
                  }}></div>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleUpload} 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg sm:text-xl font-semibold py-4 sm:py-5 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3"
              >
                <FileText className="w-6 h-6" /> Scan Documents (Demo)
              </button>
            )}
          </motion.div>
        )}

        {stage === 'review' && (
          <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl text-center border border-slate-100 max-w-2xl mx-auto">
             <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Review Your Information</h2>
             <p className="text-slate-500 mb-8">This information will be used to help the doctor understand your medical history.</p>
             
             <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 mb-8 space-y-4 shadow-sm">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Main Problem</div>
                  <div className="font-semibold text-lg text-slate-800">{structuredHistory?.chiefComplaint || "Not specified"}</div>
                </div>
                
                {structuredHistory?.hpi?.severity && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Severity</div>
                    <div className="font-medium text-slate-700">{structuredHistory.hpi.severity}</div>
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Documents Scanned</div>
                  <div className="font-medium text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500"/> {uploadedDocsCount} document(s) uploaded successfully
                  </div>
                </div>
             </div>

             <button 
              onClick={submitToDoctor} 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-semibold py-4 sm:py-5 rounded-2xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-3"
            >
              {loading ? 'Submitting...' : <>Submit to Doctor <CheckCircle className="w-6 h-6" /></>}
            </button>
          </motion.div>
        )}

        {stage === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl text-center border border-slate-100 max-w-2xl mx-auto">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">You're all set!</h2>
            <p className="text-lg sm:text-xl text-slate-500 mb-8 leading-relaxed">Your medical history and documents have been structured and sent to the doctor. You may now enter the consultation room.</p>
            <div className="text-sm font-mono text-slate-400 bg-slate-50 p-4 rounded-xl border border-slate-100 inline-block">
              Encounter: {encounterId}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
