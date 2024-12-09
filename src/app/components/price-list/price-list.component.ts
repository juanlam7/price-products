import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import { ScrollPositionDirective } from '../../utils/scroll-position.directive';
import { SummaryComponent } from '../summary/summary.component';
import { UpDownComponent } from '../up-down/up-down.component';

@Component({
  selector: 'app-price-list',
  template: `
    <app-summary [detectedPrices]="detectedPrices()" />
    <div
      class="overflow-x-auto overflow-y-auto px-6 hide-scrollbar"
      appScrollPosition
      [checkOnChange]="checkOnChange()"
      (atBottom)="onScrollBottom($event)"
      (isScrollable)="onScrollable($event)"
      #scrollableDiv
    >
      <ul class="w-[17.5rem] shrink-0">
        @for (price of detectedPrices(); track price + idx; let idx = $index) {
        <li
          class="flex justify-between items-center border border-input rounded border-zinc-600 my-2 bg-slate-500"
        >
          <div class="text-xl text-slate-200 px-2 bg-slate-700">
            {{ price }}
          </div>
          <div>
            <button
              (click)="deletePrice.emit(idx)"
              class="text-white text-xs px-2 align-top"
            >
              <img src="/clear-rounded.svg" class="w-6 h-6" alt="Custom Icon" />
            </button>
          </div>
        </li>
        }
      </ul>
    </div>
    @if (isDivScrollable()) {
    <app-up-down
      [showBottomButton]="showBottomButton()"
      [scrollableDiv]="scrollableDiv"
    />
    } @else {
    <div class="min-h-5"></div>
    }
  `,
  imports: [
    CommonModule,
    ScrollPositionDirective,
    SummaryComponent,
    UpDownComponent,
  ],
})
export class PriceListComponent {
  checkOnChange = input.required<boolean>();
  detectedPrices = input.required<string[]>();

  showBottomButton = signal<boolean>(true);
  isDivScrollable = signal<boolean>(false);

  @Output() deletePrice = new EventEmitter<number>();

  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  onScrollBottom(isAtBottom: boolean) {
    this.showBottomButton.set(!isAtBottom);
  }

  onScrollable(isScrollable: boolean) {
    this.isDivScrollable.set(isScrollable);
    this.cdr.detectChanges();
  }
}
