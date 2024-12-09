import { Component, input } from '@angular/core';

@Component({
  selector: 'app-up-down',
  template: `
    <div class="flex justify-center space-x-4 min-h-10 my-1">
      <button
        (click)="
          showBottomButton()
            ? scrollToBottom(scrollableDiv())
            : scrollToTop(scrollableDiv())
        "
        class="bg-slate-700 text-white p-2 rounded text-xs"
      >
        <div class="flex items-center justify-center">
          <img
            [src]="showBottomButton() ? '/arrow-down.svg' : '/arrow-up.svg'"
            class="w-6 h-6"
            alt="Custom Icon"
          />
        </div>
      </button>
    </div>
  `,
})
export class UpDownComponent {
  showBottomButton = input.required<boolean>();
  scrollableDiv = input.required<HTMLDivElement>();

  scrollToTop(element: HTMLElement) {
    element.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToBottom(element: HTMLElement) {
    element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
  }
}
