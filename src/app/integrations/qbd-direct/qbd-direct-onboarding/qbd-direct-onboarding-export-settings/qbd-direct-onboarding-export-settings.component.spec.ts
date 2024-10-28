import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectOnboardingExportSettingsComponent } from './qbd-direct-onboarding-export-settings.component';

xdescribe('QbdDirectOnboardingExportSettingsComponent', () => {
  let component: QbdDirectOnboardingExportSettingsComponent;
  let fixture: ComponentFixture<QbdDirectOnboardingExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectOnboardingExportSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectOnboardingExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
