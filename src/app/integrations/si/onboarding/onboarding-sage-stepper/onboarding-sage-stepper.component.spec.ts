import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingSageStepperComponent } from './onboarding-sage-stepper.component';

describe('OnboardingSageStepperComponent', () => {
  let component: OnboardingSageStepperComponent;
  let fixture: ComponentFixture<OnboardingSageStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingSageStepperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingSageStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
