import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { Sage300OnboardingDoneComponent } from './sage300-onboarding-done.component';

xdescribe('Sage300OnboardingDoneComponent', () => {
  let component: Sage300OnboardingDoneComponent;
  let fixture: ComponentFixture<Sage300OnboardingDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300OnboardingDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300OnboardingDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
