import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NetsuiteOnboardingLandingComponent } from './netsuite-onboarding-landing.component';

xdescribe('NetsuiteOnboardingLandingComponent', () => {
  let component: NetsuiteOnboardingLandingComponent;
  let fixture: ComponentFixture<NetsuiteOnboardingLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteOnboardingLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteOnboardingLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
