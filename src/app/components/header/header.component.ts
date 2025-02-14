import { Component, EventEmitter, Output } from '@angular/core';
import { ClearBtnComponent } from '../clear-btn/clear-btn.component';

@Component({
  selector: 'app-header',
  template: `
    <nav
      class="flex justify-between w-full shadow-md bg-gray-400 bg-opacity-10 p-4 max-w-2xl"
    >
      <h1 class="text-xl font-bold text-white italic">Items Counter</h1>
      <app-clear-btn (deleteAll)="deleteAll.emit()"></app-clear-btn>
    </nav>
  `,
  imports: [ClearBtnComponent],
})
export class HeaderComponent {
  @Output() deleteAll = new EventEmitter<void>();
}
