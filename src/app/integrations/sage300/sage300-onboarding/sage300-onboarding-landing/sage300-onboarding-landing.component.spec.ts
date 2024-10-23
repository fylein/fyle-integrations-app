import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300OnboardingLandingComponent } from './sage300-onboarding-landing.component';

xdescribe('Sage300OnboardingLandingComponent', () => {
  let component: Sage300OnboardingLandingComponent;
  let fixture: ComponentFixture<Sage300OnboardingLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300OnboardingLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300OnboardingLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
