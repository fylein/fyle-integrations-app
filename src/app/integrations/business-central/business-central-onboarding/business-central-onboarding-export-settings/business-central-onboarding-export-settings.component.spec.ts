import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { BusinessCentralOnboardingExportSettingsComponent } from './business-central-onboarding-export-settings.component';

xdescribe('BusinessCentralOnboardingExportSettingsComponent', () => {
  let component: BusinessCentralOnboardingExportSettingsComponent;
  let fixture: ComponentFixture<BusinessCentralOnboardingExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralOnboardingExportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralOnboardingExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
