import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingDoneComponent } from './onboarding-done.component';

describe('OnboardingDoneComponent', () => {
  let component: OnboardingDoneComponent;
  let fixture: ComponentFixture<OnboardingDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
