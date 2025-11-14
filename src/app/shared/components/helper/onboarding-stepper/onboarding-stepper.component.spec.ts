import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QbdOnboardingStepperComponent } from '../../qbd/helper/qbd-onboarding-stepper/qbd-onboarding-stepper.component';

describe('OnboardingStepperComponent', () => {
  let component: QbdOnboardingStepperComponent;
  let fixture: ComponentFixture<QbdOnboardingStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbdOnboardingStepperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdOnboardingStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
