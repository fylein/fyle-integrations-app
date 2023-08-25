import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseFieldCreationDialogComponent } from './expense-field-creation-dialog.component';

describe('ExpenseFieldCreationDialogComponent', () => {
  let component: ExpenseFieldCreationDialogComponent;
  let fixture: ComponentFixture<ExpenseFieldCreationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseFieldCreationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseFieldCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
