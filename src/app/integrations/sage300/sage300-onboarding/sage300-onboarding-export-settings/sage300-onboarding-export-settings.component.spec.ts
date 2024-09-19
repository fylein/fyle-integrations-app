import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { Sage300OnboardingExportSettingsComponent } from './sage300-onboarding-export-settings.component';

xdescribe('Sage300OnboardingExportSettingsComponent', () => {
  let component: Sage300OnboardingExportSettingsComponent;
  let fixture: ComponentFixture<Sage300OnboardingExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300OnboardingExportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300OnboardingExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
