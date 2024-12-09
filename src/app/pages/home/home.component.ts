import { Component, inject, signal } from '@angular/core';
import { ControlsComponent } from '../../components/controls/controls.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ManualEditComponent } from '../../components/manual-edit/manual-edit.component';
import { PriceListComponent } from '../../components/price-list/price-list.component';
import { PricesService } from '../../services/prices-service.service';
import { isValidSpanishNumber } from '../../utils/strings';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    ControlsComponent,
    ManualEditComponent,
    PriceListComponent,
  ],
  template: `
    <div class="flex flex-col items-center space-y-4 h-screen bg-gray-900">
      <app-header class="contents" (deleteAll)="deleteAll()"></app-header>

      <app-controls
        class="contents"
        (triggerChange)="triggerChange()"
        [detectedPrices]="detectedPrices"
        [manualEdit]="manualEdit"
      ></app-controls>

      @if (manualEdit()) {
      <app-manual-edit
        class="contents"
        (addPrice)="addPrice($event)"
      ></app-manual-edit>
      } 
      
      @if (detectedPrices().length > 0) {
      <app-price-list
        class="contents"
        [detectedPrices]="detectedPrices()"
        [checkOnChange]="checkOnChange()"
        (deletePrice)="deletePrice($event)"
      ></app-price-list>
      }
    </div>
  `,
})
export class HomeComponent {
  private pricesService = inject(PricesService);

  detectedPrices = signal<string[]>([]);
  manualEdit = signal<boolean>(false);
  checkOnChange = signal<boolean>(false);

  constructor() {
    this.loadPrices();
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

  private loadPrices() {
    this.pricesService
      .getPrices()
      .subscribe((prices) => this.detectedPrices.set(prices));
  }

  private savePrices() {
    this.pricesService.savePrices(this.detectedPrices());
  }

  triggerChange() {
    this.checkOnChange.set(!this.checkOnChange());
    this.savePrices();
  }
}