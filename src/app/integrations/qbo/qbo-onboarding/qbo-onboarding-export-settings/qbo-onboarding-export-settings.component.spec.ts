import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboOnboardingExportSettingsComponent } from './qbo-onboarding-export-settings.component';

xdescribe('QboOnboardingExportSettingsComponent', () => {
  let component: QboOnboardingExportSettingsComponent;
  let fixture: ComponentFixture<QboOnboardingExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QboOnboardingExportSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QboOnboardingExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
