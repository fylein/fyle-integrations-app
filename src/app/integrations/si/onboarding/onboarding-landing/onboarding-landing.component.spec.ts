import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingLandingComponent } from './onboarding-landing.component';

describe('OnboardingLandingComponent', () => {
  let component: OnboardingLandingComponent;
  let fixture: ComponentFixture<OnboardingLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
