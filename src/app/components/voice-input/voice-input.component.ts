import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { PricesService } from '../../services/prices-service.service';
import {
  convertWordsToNumber,
  isValidSpanishNumber,
} from '../../utils/strings';
import { ClearBtnComponent } from '../clear-btn/clear-btn.component';

@Component({
  selector: 'app-voice-input',
  imports: [CommonModule, ClearBtnComponent],
  template: `
    <div class="flex flex-col items-center space-y-4 h-screen bg-gray-900">
      <nav
        class="flex justify-between w-full border border-input border-zinc-600 bg-slate-800 p-4"
      >
        <h1 class="text-xl font-bold text-white italic">Items counter</h1>
        <app-clear-btn (deleteAll)="deleteAll()" />
      </nav>
      <div class="flex justify-around w-full p-4">
        <button
          (click)="manualEdit.set(!manualEdit())"
          class="bg-slate-700 text-white px-4 py-2 rounded w-full mr-1"
          [disabled]="listening()"
        >
          <div class="flex items-center justify-center">
            <span>{{ manualEdit() ? 'Close manual' : 'Manual price' }}</span>
            <img src="/pencil.svg" class="ml-1 w-4 h-4" alt="Custom Icon" />
          </div>
        </button>
        <button
          (click)="startListening()"
          class="bg-slate-700 text-white px-4 py-2 rounded w-full mr-1"
          [disabled]="listening()"
        >
          <div class="flex items-center justify-center">
            <span>{{ listening() ? 'Listening...' : 'Start Speaking' }}</span>
            <img src="/microphone.svg" class="ml-1 w-4 h-4" alt="Custom Icon" />
          </div>
        </button>
        <button
          (click)="stopListening()"
          class="px-4 py-2 rounded bg-red-500 text-white w-full max-w-20"
          [disabled]="!listening"
        >
          <div class="flex items-center justify-center">
            <span>Stop</span>
            <img src="/stop.svg" class="ml-2 w-4 h-4" alt="Custom Icon" />
          </div>
        </button>
      </div>
      @if (manualEdit()) {
      <div class="flex text-white justify-around w-full px-4">
        <label for="price" class="self-center">Price: </label>
        <input
          id="price"
          #addPriceInput
          type="text"
          placeholder="E.g. 3.68"
          class="w-full px-2 py-2 border border-zinc-600 max-w-28 bg-slate-500 rounded focus:border-blue-500 focus:bg-slate-500 focus:outline-none"
        />
        <button
          class="bg-slate-700 text-white px-4 py-2 rounded"
          (click)="addPrice(addPriceInput.value); addPriceInput.value = ''"
        >
          <div class="flex items-center justify-center">
            <span>Add Price</span>
            <img src="/plus.svg" class="ml-1 w-4 h-4" alt="Custom Icon" />
          </div>
        </button>
      </div>
      } @if (detectedPrices().length > 0) {
      <h2
        class="flex text-lg font-semibold text-black bg-slate-500 rounded pl-2"
      >
        Items summary:
        <span
          class="text-xl text-slate-200 bg-slate-700 h-full ml-1 px-2 rounded-r"
          >{{ summaryPrices() }}</span
        >
      </h2>
      <div class="overflow-x-auto overflow-y-auto px-6 hide-scrollbar">
        <ul class="w-[17.5rem] shrink-0">
          @for (price of detectedPrices(); track price + idx; let idx = $index)
          {
          <li
            class="flex justify-between items-center border border-input rounded border-zinc-600 my-2 bg-slate-500"
          >
            <div class="text-xl text-slate-200 px-2 bg-slate-700">
              {{ price }}
            </div>
            <div>
              <button
                (click)="deletePrice(idx)"
                class="text-white text-xs px-2 align-top"
                [disabled]="listening()"
              >
                <img
                  src="/clear-rounded.svg"
                  class="w-6 h-6"
                  alt="Custom Icon"
                />
              </button>
            </div>
          </li>
          }
        </ul>
      </div>
      }
    </div>
  `,
})
export class VoiceInputComponent {
  pricesService = inject(PricesService);

  recognition!: SpeechRecognition;
  listening = signal<boolean>(false);
  detectedPrices = signal<string[]>([]);
  manualEdit = signal<boolean>(false);

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

  deleteAll() {
    this.detectedPrices.set([]);
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

  addPrice(price: string): void {
    if (price.trim() && !isValidSpanishNumber(price.trim())) {
      this.detectedPrices.update((val) =>
        val ? [...val, price.padStart(2, '0')] : [price.padStart(2, '0')]
      );
      this.savePrices();
    }
  }
}
