import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectOnboardingLandingComponent } from './qbd-direct-onboarding-landing.component';

xdescribe('QbdDirectOnboardingLandingComponent', () => {
  let component: QbdDirectOnboardingLandingComponent;
  let fixture: ComponentFixture<QbdDirectOnboardingLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectOnboardingLandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QbdDirectOnboardingLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
