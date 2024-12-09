import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManualEditComponent } from './manual-edit.component';

describe('ManualEditComponent', () => {
  let component: ManualEditComponent;
  let fixture: ComponentFixture<ManualEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
