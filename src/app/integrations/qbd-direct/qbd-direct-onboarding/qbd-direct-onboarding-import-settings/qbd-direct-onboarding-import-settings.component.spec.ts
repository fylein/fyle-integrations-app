import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectOnboardingImportSettingsComponent } from './qbd-direct-onboarding-import-settings.component';

describe('QbdDirectOnboardingImportSettingsComponent', () => {
  let component: QbdDirectOnboardingImportSettingsComponent;
  let fixture: ComponentFixture<QbdDirectOnboardingImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectOnboardingImportSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectOnboardingImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
