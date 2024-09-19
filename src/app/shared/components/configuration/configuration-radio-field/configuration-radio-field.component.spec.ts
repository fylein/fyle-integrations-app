import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ExpenseState } from 'src/app/core/models/enum/enum.model';

import { ConfigurationRadioFieldComponent } from './configuration-radio-field.component';

xdescribe('ConfigurationRadioFieldComponent', () => {
  let component: ConfigurationRadioFieldComponent;
  let fixture: ComponentFixture<ConfigurationRadioFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationRadioFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationRadioFieldComponent);
    component = fixture.componentInstance;
    component.options = [
      {
        value: ExpenseState.PAYMENT_PROCESSING,
        label: 'Payment Processing'
      },
      {
        value: ExpenseState.PAID,
        label: 'Paid'
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
