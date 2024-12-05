type SpeechRecognition = typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;

interface SpeechRecognitionEvent extends Event {
  readonly results: {
    [index: number]: {
      readonly [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

declare global {
  interface Window {
    SpeechRecognition: typeof window.SpeechRecognition;
    webkitSpeechRecognition: typeof window.webkitSpeechRecognition;
  }
}
