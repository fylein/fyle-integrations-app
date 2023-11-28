import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCentralOnboardingEmployeeSettingsComponent } from './business-central-onboarding-employee-settings.component';

describe('BusinessCentralOnboardingEmployeeSettingsComponent', () => {
  let component: BusinessCentralOnboardingEmployeeSettingsComponent;
  let fixture: ComponentFixture<BusinessCentralOnboardingEmployeeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralOnboardingEmployeeSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralOnboardingEmployeeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
