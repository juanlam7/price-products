import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-manual-edit',
  template: `
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
        (click)="addPrice.emit(addPriceInput.value); addPriceInput.value = ''"
      >
        <div class="flex items-center justify-center">
          <span>Add Price</span>
          <img src="/plus.svg" class="ml-1 w-4 h-4" alt="Custom Icon" />
        </div>
      </button>
    </div>
  `,
})
export class ManualEditComponent {
  @Output() addPrice = new EventEmitter<string>();
}
