import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntacctStepperComponent } from './intacct-stepper.component';

describe('IntacctStepperComponent', () => {
  let component: IntacctStepperComponent;
  let fixture: ComponentFixture<IntacctStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctStepperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
