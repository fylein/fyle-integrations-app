import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeroOnboardingImportSettingsComponent } from './xero-onboarding-import-settings.component';

xdescribe('XeroOnboardingImportSettingsComponent', () => {
  let component: XeroOnboardingImportSettingsComponent;
  let fixture: ComponentFixture<XeroOnboardingImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XeroOnboardingImportSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(XeroOnboardingImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
