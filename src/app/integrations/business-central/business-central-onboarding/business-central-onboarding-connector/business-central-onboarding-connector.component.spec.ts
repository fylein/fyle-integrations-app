import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCentralOnboardingConnectorComponent } from './business-central-onboarding-connector.component';

xdescribe('BusinessCentralOnboardingConnectorComponent', () => {
  let component: BusinessCentralOnboardingConnectorComponent;
  let fixture: ComponentFixture<BusinessCentralOnboardingConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessCentralOnboardingConnectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessCentralOnboardingConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
