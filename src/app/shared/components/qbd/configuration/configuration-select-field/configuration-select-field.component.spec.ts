import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { QBDExpenseState } from 'src/app/core/models/enum/enum.model';

import { ConfigurationSelectFieldComponent } from './configuration-select-field.component';

describe('ConfigurationSelectFieldComponent', () => {
  let component: ConfigurationSelectFieldComponent;
  let fixture: ComponentFixture<ConfigurationSelectFieldComponent>;
  let formbuilder: FormBuilder;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationSelectFieldComponent ],
      providers: [FormBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationSelectFieldComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(FormBuilder);
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
    component.formControllerName = 'dayOfMonth';
    component.form = formbuilder.group({
        timeOfDay: [null],
        meridiem: [null],
        dayOfMonth: ['1'],
        dayOfWeek: ['SUNDAY']
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInt function check', () => {
    component.formControllerName = 'dayOfWeek';
    fixture.detectChanges();
    expect(component.ngOnInit()).toBeUndefined();
    component.formControllerName = 'timeOfDay';
    fixture.detectChanges();
    expect(component.ngOnInit()).toBeUndefined();
  });
});
