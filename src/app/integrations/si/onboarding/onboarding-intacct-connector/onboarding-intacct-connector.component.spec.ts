import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingIntacctConnectorComponent } from './onboarding-intacct-connector.component';

describe('OnboardingIntacctConnectorComponent', () => {
  let component: OnboardingIntacctConnectorComponent;
  let fixture: ComponentFixture<OnboardingIntacctConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingIntacctConnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingIntacctConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
