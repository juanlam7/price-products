import {
  Component,
  EventEmitter,
  input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { extractDescriptionAndPrice } from '../../utils/strings';

@Component({
  selector: 'app-controls',
  template: `
    <div class="flex justify-around w-full px-4 pt-4">
      <button
        (click)="manualEdit().set(!manualEdit()())"
        class="bg-slate-700 text-white px-4 py-2 rounded w-full mr-1"
        [disabled]="listening()"
      >
        <div class="flex items-center justify-center">
          <span>{{ manualEdit()() ? 'Close' : 'Enter price' }}</span>
          <img src="/pencil.svg" class="ml-1 w-4 h-4" alt="Custom Icon" />
        </div>
      </button>
      <button
        (click)="startListening()"
        class="bg-slate-700 text-white px-4 py-2 rounded w-full mr-1"
        [disabled]="listening()"
      >
        <div class="flex items-center justify-center">
          <span>{{ listening() ? 'Listening...' : 'Say price' }}</span>
          <img src="/microphone.svg" class="ml-1 w-4 h-4" alt="Custom Icon" />
        </div>
      </button>
      <button
        (click)="stopListening()"
        class="px-4 py-2 rounded bg-red-500 text-white w-full max-w-20"
      >
        <div class="flex items-center justify-center">
          <span>Stop</span>
          <img src="/stop.svg" class="ml-2 w-4 h-4" alt="Custom Icon" />
        </div>
      </button>
    </div>
    @if (listening()) {
    <p class="text-slate-500 text-sm">
      Add your item this way "Producto queso y precio 3.73"
    </p>
    }
  `,
})
export class ControlsComponent {
  manualEdit = input.required<WritableSignal<boolean>>();
  detectedPrices = input.required<WritableSignal<string[]>>();
  listening = signal<boolean>(false);

  @Output() triggerChange = new EventEmitter<void>();

  private recognition: SpeechRecognition | null = null;

  constructor() {
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'es-ES';
      this.recognition.interimResults = false;
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        this.extractPrices(transcript);
      };
      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
      };
    } else {
      console.error('Speech Recognition is not supported in this browser.');
    }
  }

  startListening() {
    if (this.recognition) {
      this.listening.set(true);
      this.recognition.start();
    }
  }

  stopListening() {
    if (this.recognition) {
      this.listening.set(false);
      this.recognition.stop();
    }
  }

  private extractPrices(transcript: string) {
    const getValue = extractDescriptionAndPrice(transcript);
    const prices = getValue || [];
    this.detectedPrices().update((currentPrices) => [
      ...currentPrices,
      ...prices,
    ]);
    this.stopListening();
    this.triggerChange.emit();
  }
}
