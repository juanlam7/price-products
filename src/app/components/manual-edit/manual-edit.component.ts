import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-manual-edit',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form
      [formGroup]="manualEditForm"
      (ngSubmit)="onSubmit()"
      class="flex text-white space-y-4 px-4 pb-2"
    >
      <div>
        <label class="text-xs" for="price">Price</label>
        <input
          id="price"
          required
          formControlName="price"
          type="text"
          placeholder="E.g. 3.68"
          class="w-full px-2 py-2 border border-zinc-600 bg-slate-500 rounded focus:border-blue-500 focus:outline-none"
        />
        <div
          *ngIf="
            manualEditForm.controls.price?.invalid &&
            manualEditForm.controls.price?.touched
          "
          class="text-red-500 text-sm"
        >
          <div *ngIf="manualEditForm.controls.price.errors?.['pattern']">
            Price must be a valid number (e.g., 1.25).
          </div>
        </div>

        <label class="text-xs" for="price">Description</label>
        <input
          id="description"
          required
          formControlName="description"
          type="text"
          placeholder="E.g. Coca cola"
          class="w-full px-2 py-2 border border-zinc-600 bg-slate-500 rounded focus:border-blue-500 focus:outline-none"
        />
        <div
          *ngIf="
            manualEditForm.controls.description?.invalid &&
            manualEditForm.controls.description?.touched
          "
          class="text-red-500 text-sm"
        >
          <div *ngIf="manualEditForm.controls.description.errors?.['pattern']">
            Description must only contain letters.
          </div>
          <div
            *ngIf="manualEditForm.controls.description.errors?.['maxlength']"
          >
            Description cannot exceed 10 characters.
          </div>
        </div>
      </div>

      <button
        type="submit"
        class="border text-white px-4 py-2 rounded ml-4 self-center"
        [disabled]="manualEditForm.invalid"
      >
        <div class="flex items-center justify-center">
          <span>Add</span>
          <img src="/plus.svg" class="ml-1 w-4 h-4" alt="Custom Icon" />
        </div>
      </button>
    </form>
  `,
})
export class ManualEditComponent {
  @Output() addPrice = new EventEmitter<string>();

  manualEditForm: FormGroup<{
    price: FormControl<string | null>;
    description: FormControl<string | null>;
  }>;

  constructor(private fb: FormBuilder) {
    this.manualEditForm = this.fb.group({
      price: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      description: [
        '',
        [Validators.pattern(/^[a-zA-Z]*$/), Validators.maxLength(10)],
      ],
    });
  }

  onSubmit(): void {
    if (this.manualEditForm.valid) {
      const { price, description } = this.manualEditForm.value;
      this.addPrice.emit(`${description}: ${price}`);
      this.manualEditForm.reset();
    }
  }
}
