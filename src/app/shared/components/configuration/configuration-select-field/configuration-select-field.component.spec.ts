import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ExpenseState } from 'src/app/core/models/enum/enum.model';

import { ConfigurationSelectFieldComponent } from './configuration-select-field.component';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

xdescribe('ConfigurationSelectFieldComponent', () => {
  let component: ConfigurationSelectFieldComponent;
  let fixture: ComponentFixture<ConfigurationSelectFieldComponent>;
  let formbuilder: FormBuilder;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigurationSelectFieldComponent, SnakeCaseToSpaceCasePipe],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurationSelectFieldComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(FormBuilder);
    component.options = [
      {
        value: ExpenseState.PAYMENT_PROCESSING,
        label: 'Payment Processing',
      },
      {
        value: ExpenseState.PAID,
        label: 'Paid',
      },
    ];
    component.formControllerName = 'dayOfMonth';
    component.form = formbuilder.group({
      timeOfDay: [null],
      meridiem: [null],
      dayOfMonth: ['1'],
      dayOfWeek: ['SUNDAY'],
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
