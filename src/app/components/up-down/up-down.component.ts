import { Component, input } from '@angular/core';

@Component({
  selector: 'app-up-down',
  template: `
    <div class="flex justify-center space-x-4 min-h-10 my-2">
      <button
        (click)="
          showBottomButton()
            ? scrollToBottom(scrollableDiv())
            : scrollToTop(scrollableDiv())
        "
        class="bg-slate-700 text-white px-4 py-2 mb-1 rounded text-xs"
      >
        {{ showBottomButton() ? 'Bottom' : 'Top' }}
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
