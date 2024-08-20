import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingStepperComponent } from '../../qbd/helper/onboarding-stepper/onboarding-stepper.component';

xdescribe('OnboardingStepperComponent', () => {
  let component: OnboardingStepperComponent;
  let fixture: ComponentFixture<OnboardingStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingStepperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
