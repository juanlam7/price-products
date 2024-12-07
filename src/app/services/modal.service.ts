import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modalState = signal({
    title: '',
    description: '',
    isVisible: false,
  });

  openModal(title: string, description: string) {
    this.modalState.set({ title, description, isVisible: true });
  }

  closeModal() {
    this.modalState.set({ title: '', description: '', isVisible: false });
  }
}
