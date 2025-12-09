import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdOnboardingExportSettingComponent } from './qbd-onboarding-export-setting.component';

xdescribe('QbdOnboardingExportSettingComponent', () => {
  let component: QbdOnboardingExportSettingComponent;
  let fixture: ComponentFixture<QbdOnboardingExportSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QbdOnboardingExportSettingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QbdOnboardingExportSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
