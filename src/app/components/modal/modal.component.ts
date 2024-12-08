import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-backdrop"
      (click)="closeModalOnBackdropClick($event)"
    >
      <div
        class="bg-slate-800 rounded-lg shadow-lg p-6"
        (click)="$event.stopPropagation()"
      >
        <ng-content />
      </div>
    </div>
  `,
})
export class ModalComponent {
  @Output() cancel = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

  closeModalOnBackdropClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-backdrop')) {
      this.onCancel();
    }
  }
}
