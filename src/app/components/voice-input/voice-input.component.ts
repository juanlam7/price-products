import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { PricesService } from '../../services/prices-service.service';
import { ScrollPositionDirective } from '../../utils/scroll-position.directive';
import {
  convertWordsToNumber,
  isValidSpanishNumber,
} from '../../utils/strings';
import { ClearBtnComponent } from '../clear-btn/clear-btn.component';

@Component({
  selector: 'app-voice-input',
  imports: [CommonModule, ClearBtnComponent, ScrollPositionDirective],
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
            <span>{{ manualEdit() ? 'Close' : 'Enter price' }}</span>
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
        <input
          id="price"
          #addPriceInput
          type="text"
          placeholder="E.g. 3.68"
          class="w-full px-2 py-2 border border-zinc-600 max-w-48 bg-slate-500 rounded focus:border-blue-500 focus:bg-slate-500 focus:outline-none"
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
      <div
        class="overflow-x-auto overflow-y-auto px-6 hide-scrollbar"
        appScrollPosition
        [checkOnChange]="checkOnChange"
        (atBottom)="onScrollBottom($event)"
        (isScrollable)="onScrollable($event)"
        #scrollableDiv
      >
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
      @if (isDivScrollable) {
      <div class="flex justify-center space-x-4 min-h-10">
        <button
          (click)="
            showBottomButton
              ? scrollToBottom(scrollableDiv)
              : scrollToTop(scrollableDiv)
          "
          class="bg-slate-700 text-white px-4 py-2 mb-1 rounded text-xs"
        >
          {{ showBottomButton ? 'Bottom' : 'Top' }}
        </button>
      </div>
      } @else {
      <div class="min-h-5"></div>
      } }
    </div>
  `,
})
export class VoiceInputComponent {
  private cdr = inject(ChangeDetectorRef);
  private pricesService = inject(PricesService);

  listening = signal<boolean>(false);
  detectedPrices = signal<string[]>([]);
  manualEdit = signal<boolean>(false);

  showBottomButton = true;
  isDivScrollable = false;
  checkOnChange = false;

  summaryPrices = computed(() =>
    this.detectedPrices()
      .reduce((sum, price) => sum + parseFloat(price), 0)
      .toFixed(2)
  );

  private recognition: SpeechRecognition | null = null;

  constructor() {
    this.initSpeechRecognition();
    this.loadPrices();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
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

  onScrollBottom(isAtBottom: boolean) {
    this.showBottomButton = !isAtBottom;
  }

  onScrollable(isScrollable: boolean) {
    this.isDivScrollable = isScrollable;
    this.cdr.detectChanges();
  }

  scrollToTop(element: HTMLElement) {
    element.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToBottom(element: HTMLElement) {
    element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
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

  addPrice(price: string) {
    if (price.trim() && !isValidSpanishNumber(price.trim())) {
      this.detectedPrices.update((prices) => [
        ...prices,
        price.padStart(2, '0'),
      ]);
      this.triggerChange();
    }
  }

  deletePrice(index: number) {
    this.detectedPrices.update((prices) =>
      prices.filter((_, i) => i !== index)
    );
    this.triggerChange();
  }

  deleteAll() {
    this.detectedPrices.set([]);
    this.triggerChange();
  }

  private extractPrices(transcript: string) {
    const prices = transcript.match(/\d+(\.\d{1,2})?/g) || [];
    this.detectedPrices.update((currentPrices) => [
      ...currentPrices,
      ...prices,
    ]);
    this.stopListening();
    this.savePrices();
  }

  private loadPrices() {
    this.pricesService
      .getPrices()
      .subscribe((prices) => this.detectedPrices.set(prices));
  }

  private savePrices() {
    this.pricesService.savePrices(this.detectedPrices());
  }

  private triggerChange() {
    this.checkOnChange = !this.checkOnChange;
    this.savePrices();
  }
}
