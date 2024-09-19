import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { TravelperkOnboardingLandingComponent } from './travelperk-onboarding-landing.component';

xdescribe('TravelperkOnboardingLandingComponent', () => {
  let component: TravelperkOnboardingLandingComponent;
  let fixture: ComponentFixture<TravelperkOnboardingLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelperkOnboardingLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelperkOnboardingLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
