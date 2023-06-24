import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingConnectToSageComponent } from './onboarding-connect-to-sage.component';

describe('OnboardingConnectToSageComponent', () => {
  let component: OnboardingConnectToSageComponent;
  let fixture: ComponentFixture<OnboardingConnectToSageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingConnectToSageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingConnectToSageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
