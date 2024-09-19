import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { Sage300OnboardingComponent } from './sage300-onboarding.component';

xdescribe('OnboardingComponent', () => {
  let component: Sage300OnboardingComponent;
  let fixture: ComponentFixture<Sage300OnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300OnboardingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300OnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
