import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Volume2, Keyboard, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function HistoryScreen({ 
  messages, 
  loading, 
  inputMode, 
  setInputMode, 
  options, 
  input, 
  setInput, 
  sendMessage, 
  isListening, 
  toggleListen, 
  speechServiceSupported, 
  handleSpeakText 
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <Card className="rounded-3xl shadow-xl overflow-hidden flex flex-col h-[600px] border-slate-200">
        <div className="bg-indigo-600 p-4 sm:p-5 text-white flex justify-between items-center shadow-sm z-10">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 sm:gap-3">
            <Activity className="animate-pulse w-5 h-5 text-indigo-200" /> Clinical History
          </h2>
          <div className="flex bg-indigo-700/50 rounded-lg p-1 backdrop-blur-sm">
            <button onClick={() => setInputMode('voice')} className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${inputMode === 'voice' ? 'bg-white text-indigo-700 shadow' : 'text-indigo-100 hover:text-white'}`}><Mic className="w-4 h-4"/> Voice</button>
            <button onClick={() => setInputMode('text')} className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${inputMode === 'text' ? 'bg-white text-indigo-700 shadow' : 'text-indigo-100 hover:text-white'}`}><Keyboard className="w-4 h-4"/> Text</button>
          </div>
        </div>
        
        <div className="flex-grow p-4 sm:p-6 overflow-y-auto bg-slate-50/80 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start group'}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 shadow-sm text-base sm:text-lg relative ${m.type === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-slate-800 rounded-bl-sm border border-slate-200'}`}>
                {m.text}
                {m.type === 'ai' && speechServiceSupported && (
                  <button onClick={() => handleSpeakText(m.text)} className="absolute -right-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-indigo-600 bg-white rounded-full shadow-sm border border-slate-200" aria-label="Read aloud">
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-sm p-4 shadow-sm flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <span className="text-sm font-medium text-slate-500">Processing your response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
          {options.length > 0 && inputMode === 'text' && !loading && (
            <div className="flex flex-wrap gap-2 mb-4">
              {options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => sendMessage(opt)}
                  className="px-4 sm:px-5 py-2 sm:py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:shadow-sm rounded-xl text-sm sm:text-base font-semibold transition-all border border-indigo-100/50"
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
                placeholder="Type your response here..." 
                disabled={loading}
                className="flex-grow border border-slate-200 rounded-full px-5 sm:px-6 py-3 sm:py-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-slate-50 focus:bg-white transition-colors disabled:opacity-50"
              />
              <Button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} size="icon" className="h-auto w-12 sm:w-14 rounded-full shrink-0 shadow-md">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2">
              <button 
                onClick={toggleListen}
                disabled={loading}
                className={`p-6 sm:p-8 rounded-full transition-all shadow-lg flex items-center justify-center mb-4 disabled:opacity-50 ${isListening ? 'bg-rose-500 shadow-rose-200 animate-pulse scale-110' : 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700 hover:scale-105'}`}
              >
                <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </button>
              <div className={`font-medium text-sm sm:text-base ${isListening ? 'text-rose-500' : 'text-slate-500'}`}>
                {isListening ? 'Listening... tap to stop' : 'Tap the microphone to start speaking'}
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
