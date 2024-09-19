import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { IntacctOnboardingLandingComponent } from './intacct-onboarding-landing.component';

xdescribe('IntacctOnboardingLandingComponent', () => {
  let component: IntacctOnboardingLandingComponent;
  let fixture: ComponentFixture<IntacctOnboardingLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctOnboardingLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctOnboardingLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
