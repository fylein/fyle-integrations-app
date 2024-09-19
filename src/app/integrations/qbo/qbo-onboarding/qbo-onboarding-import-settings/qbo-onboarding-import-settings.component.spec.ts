import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { QboOnboardingImportSettingsComponent } from './qbo-onboarding-import-settings.component';

xdescribe('QboOnboardingImportSettingsComponent', () => {
  let component: QboOnboardingImportSettingsComponent;
  let fixture: ComponentFixture<QboOnboardingImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboOnboardingImportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboOnboardingImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
