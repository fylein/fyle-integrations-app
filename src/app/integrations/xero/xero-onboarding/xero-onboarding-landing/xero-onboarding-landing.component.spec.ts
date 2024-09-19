import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { XeroOnboardingLandingComponent } from './xero-onboarding-landing.component';

xdescribe('XeroOnboardingLandingComponent', () => {
  let component: XeroOnboardingLandingComponent;
  let fixture: ComponentFixture<XeroOnboardingLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroOnboardingLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroOnboardingLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
