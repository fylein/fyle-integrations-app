import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'primeng/api';

import { OnboardingStepperComponent } from './onboarding-stepper.component';

describe('OnboardingStepperComponent', () => {
  let component: OnboardingStepperComponent;
  let fixture: ComponentFixture<OnboardingStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, SharedModule, NoopAnimationsModule],
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
