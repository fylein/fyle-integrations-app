import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { XeroOnboardingExportSettingsComponent } from './xero-onboarding-export-settings.component';

xdescribe('XeroOnboardingExportSettingsComponent', () => {
  let component: XeroOnboardingExportSettingsComponent;
  let fixture: ComponentFixture<XeroOnboardingExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroOnboardingExportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroOnboardingExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
