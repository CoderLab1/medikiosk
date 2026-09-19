// Frontend Voice Service Abstraction using Browser Native APIs

class SpeechService {
  constructor() {
    this.recognition = null;
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (this.isSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-IN'; // Default to Indian English
    }
  }

  startListening(onResult, onError) {
    if (!this.isSupported) {
      if (onError) onError(new Error("Speech recognition not supported in this browser."));
      return;
    }
    
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };
    
    this.recognition.onerror = (event) => {
      if (onError) onError(event.error);
    };

    try {
      this.recognition.start();
    } catch (e) {
      if (onError) onError(e);
    }
  }

  stopListening() {
    if (this.isSupported && this.recognition) {
      this.recognition.stop();
    }
  }

  speak(text, onEnd) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop anything currently playing
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.onend = onEnd;
      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  }
}

export const speechService = new SpeechService();
