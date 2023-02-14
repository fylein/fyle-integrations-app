import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QBDExpenseState } from 'src/app/core/models/enum/enum.model';

import { ConfigurationRadioFieldComponent } from './configuration-radio-field.component';

describe('ConfigurationRadioFieldComponent', () => {
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
        value: QBDExpenseState.PAYMENT_PROCESSING,
        label: 'Payment Processing'
      },
      {
        value: QBDExpenseState.PAID,
        label: 'Paid'
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
