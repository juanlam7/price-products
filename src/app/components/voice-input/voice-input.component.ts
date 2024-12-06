import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { PricesService } from '../../services/prices-service.service';
import { convertWordsToNumber } from '../../utils/strings';

@Component({
  selector: 'app-voice-input',
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center p-4 space-y-4 h-screen bg-slate-900">
      <h1 class="text-xl font-bold text-white">Voice Price Reader</h1>
      <button
        (click)="startListening()"
        class="bg-lime-600 text-white px-4 py-2 rounded"
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
      <h2 class="text-lg font-semibold text-white">Detected Prices:</h2>
      <div class="overflow-x-auto overflow-y-auto px-6 hide-scrollbar">
        <ul class="w-[17.5rem] shrink-0">
          @for (price of detectedPrices(); track price + idx; let idx = $index)
          {
          <li
            class="flex justify-between items-center text-green-500 border border-input rounded border-slate-800 my-2"
          >
            <div class="text-xl px-2">
              {{ price }}
            </div>
            <div>
              <button
                (click)="deletePrice(idx)"
                class="text-white text-xs px-2 py-1"
                [disabled]="listening()"
              >
                X
              </button>
            </div>
          </li>
          }
        </ul>
      </div>
      <h3 class="text-lg font-semibold text-white mt-4">
        Summary: {{ summaryPrices() }}
      </h3>
      }
    </div>
  `,
})
export class VoiceInputComponent {
  pricesService = inject(PricesService);

  recognition!: SpeechRecognition;
  listening = signal<boolean>(false);
  detectedPrices = signal<string[]>([]);

  summaryPrices = computed(() => {
    const sum = this.detectedPrices().reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue);
    }, 0);

    return sum.toFixed(2);
  });

  constructor() {
    this.loadPrices();
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'es-ES';
      this.recognition.interimResults = false;
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const processedTranscript = convertWordsToNumber(transcript);
        this.extractPrices(processedTranscript);
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
    this.savePrices();
  }

  extractPrices(transcript: string): void {
    const prices = transcript.match(/\d+(\.\d{1,2})?/g) || [];
    this.detectedPrices.update((val) => (val ? [...val, ...prices] : prices));
    this.stopListening();
    this.savePrices();
  }

  savePrices(): void {
    this.pricesService.savePrices(this.detectedPrices());
  }

  loadPrices(): void {
    this.pricesService
      .getPrices()
      .subscribe((item) => this.detectedPrices.set(item));
  }
}
