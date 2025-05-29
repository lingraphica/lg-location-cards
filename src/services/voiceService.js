class VoiceService {
  constructor() {
    this.selectedVoice = null;
    this.voices = [];
    this.loadVoices();
  }

  loadVoices() {
    const updateVoices = () => {
      this.voices = speechSynthesis.getVoices();
      
      // Try to find a good default voice
      this.selectedVoice = this.voices.find(voice => 
        voice.name.includes('Samantha') || // macOS
        voice.name.includes('Zira') ||     // Windows
        voice.name.includes('Google')      // Chrome
      ) || this.voices.find(voice => voice.lang.startsWith('en')) || this.voices[0];
    };

    updateVoices();
    speechSynthesis.onvoiceschanged = updateVoices;
  }

  speak(text, options = {}) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use selected voice or default
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      
      // Enhanced settings for better speech
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 0.9;
      
      speechSynthesis.speak(utterance);
    }
  }

  getAvailableVoices() {
    return this.voices.filter(voice => voice.lang.startsWith('en'));
  }

  setVoice(voiceName) {
    this.selectedVoice = this.voices.find(voice => voice.name === voiceName);
  }

  // Get the best quality voices available
  getBestVoices() {
    const englishVoices = this.getAvailableVoices();
    
    // Prioritize high-quality voices
    const highQuality = englishVoices.filter(voice => 
      voice.name.includes('Neural') || 
      voice.name.includes('Premium') ||
      voice.name.includes('Enhanced') ||
      voice.localService === true
    );
    
    return highQuality.length > 0 ? highQuality : englishVoices;
  }
}

export const voiceService = new VoiceService();