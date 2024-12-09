import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-summary',
  template: `
    <h2
      class="flex text-lg font-semibold text-black bg-slate-500 rounded pl-2 my-2"
    >
      Items summary:
      <span
        class="text-xl text-slate-200 bg-slate-700 h-full ml-1 px-2 rounded-r"
        >{{ summaryPrices() }}</span
      >
    </h2>
  `,
})
export class SummaryComponent {
  detectedPrices = input.required<string[]>();

  summaryPrices = computed(() =>
    this.detectedPrices()
      .reduce((sum, price) => sum + parseFloat(price), 0)
      .toFixed(2)
  );
}
