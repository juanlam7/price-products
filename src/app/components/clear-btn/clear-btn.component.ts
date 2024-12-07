import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-clear-btn',
  imports: [ModalComponent, CommonModule],
  template: `
    <button
      class="bg-slate-700 text-white px-4 py-2 rounded"
      (click)="openModal()"
    >
      <div class="flex items-center justify-center">
        <span>Reset</span>
        <img src="/clear.svg" class="ml-1 w-6 h-6" alt="Custom Icon" />
      </div>
    </button>

    @if (serviceModalState().isVisible) {
    <app-modal (cancel)="onModalCancel()">
      <h2 class="text-xl font-bold mb-4 text-white">
        {{ serviceModalState().title }}
      </h2>
      <p class="text-gray-400 mb-6">{{ serviceModalState().description }}</p>
      <div class="flex justify-end gap-4">
        <button
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          (click)="onModalCancel()"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-slate-700 text-white rounded hover:bg-blue-600"
          (click)="onModalConfirm()"
        >
          Confirm
        </button>
      </div>
    </app-modal>
    }
  `,
})
export class ClearBtnComponent {
  modalService = inject(ModalService);

  serviceModalState = this.modalService.modalState;

  @Output() deleteAll = new EventEmitter<void>();

  openModal() {
    this.modalService.openModal(
      'Confirm Action',
      'Are you sure you want to delete all items?'
    );
  }

  onModalConfirm() {
    this.deleteAll.emit();
    this.modalService.closeModal();
  }

  onModalCancel() {
    this.modalService.closeModal();
  }
}
