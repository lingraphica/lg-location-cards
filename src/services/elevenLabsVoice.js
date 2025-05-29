// ElevenLabs Text-to-Speech integration
// Requires API key from elevenlabs.io

class ElevenLabsVoice {
  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    this.voiceId = 'ErXwobaYiN019PkySvjV'; // Antoni voice (good for AAC)
    this.audioCache = new Map();
  }

  async speak(text) {
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found, falling back to browser speech');
      this.fallbackToSpeechSynthesis(text);
      return;
    }

    try {
      // Check cache first
      if (this.audioCache.has(text)) {
        const audioUrl = this.audioCache.get(text);
        this.playAudio(audioUrl);
        return;
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Cache the audio
        this.audioCache.set(text, audioUrl);
        
        this.playAudio(audioUrl);
      } else {
        throw new Error('ElevenLabs API request failed');
      }
    } catch (error) {
      console.error('ElevenLabs TTS failed:', error);
      this.fallbackToSpeechSynthesis(text);
    }
  }

  playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
  }

  fallbackToSpeechSynthesis(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  }
}

export const elevenLabsVoice = new ElevenLabsVoice();