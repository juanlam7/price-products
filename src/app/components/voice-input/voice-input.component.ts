import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-voice-input',
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center p-4 space-y-4">
      <h1 class="text-xl font-bold">Voice Price Reader</h1>
      <button
        (click)="startListening()"
        class="bg-blue-500 text-white px-4 py-2 rounded"
        [disabled]="listening()"
      >
        {{ listening() ? 'Listening...' : 'Start Speaking' }}
      </button>
      <button
        (click)="stopListening()"
        [ngClass]="{
          'bg-red-500 text-white': listening(),
          'bg-gray-300 text-gray-500': !listening()
        }"
        class="px-4 py-2 rounded"
        [disabled]="!listening"
      >
        Stop
      </button>
      @if (detectedPrices().length > 0) {
      <div class="mt-4">
        <h2 class="text-lg font-semibold">Detected Prices:</h2>
        <ul class="list-disc mt-2">
          @for (price of detectedPrices(); track price; let idx = $index) {
          <li class="text-green-500">
            <div class="flex justify-between items-center">
              <div>
                {{ price }}
              </div>
              <div>
                <button
                  (click)="deletePrice(idx)"
                  class="text-black text-xs px-2 py-1 rounded border border-input"
                  [disabled]="listening()"
                >
                  X
                </button>
              </div>
            </div>
          </li>
          }
        </ul>
        <h3 class="text-lg font-semibold">Summary: {{ summaryPrices() }}</h3>
      </div>
      }
    </div>
  `,
})
export class VoiceInputComponent {
  recognition!: SpeechRecognition;
  listening = signal<boolean>(false);
  detectedPrices = signal<string[]>(['12', '2.24', '9']);

  summaryPrices = computed(() => {
    const sum = this.detectedPrices().reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue);
    }, 0);

    return sum.toFixed(2);
  });

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'es-ES';
      this.recognition.interimResults = false;
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        this.extractPrices(transcript);
      };
      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
      };
    } else {
      console.error('Speech Recognition is not supported in this browser.');
    }
  }

  startListening(): void {
    if (this.recognition) {
      this.listening.set(true);
      this.recognition.start();
    }
  }

  stopListening(): void {
    if (this.recognition) {
      this.listening.set(false);
      this.recognition.stop();
    }
  }

  deletePrice(priceIndex: number) {
    const newArray = this.detectedPrices().filter(
      (_, index) => index !== priceIndex
    );
    this.detectedPrices.set(newArray);
  }

  extractPrices(transcript: string): void {
    const prices = transcript.match(/\d+(\.\d{1,2})?/g) || [];
    this.detectedPrices.update((val) => (val ? [...val, ...prices] : prices));
    this.stopListening();
  }
}
