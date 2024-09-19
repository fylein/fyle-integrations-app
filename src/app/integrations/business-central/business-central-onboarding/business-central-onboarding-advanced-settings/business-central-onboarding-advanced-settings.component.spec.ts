import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { BusinessCentralOnboardingAdvancedSettingsComponent } from './business-central-onboarding-advanced-settings.component';

xdescribe('BusinessCentralOnboardingAdvancedSettingsComponent', () => {
  let component: BusinessCentralOnboardingAdvancedSettingsComponent;
  let fixture: ComponentFixture<BusinessCentralOnboardingAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralOnboardingAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralOnboardingAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
