import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NetsuiteOnboardingExportSettingsComponent } from './netsuite-onboarding-export-settings.component';

xdescribe('NetsuiteOnboardingExportSettingsComponent', () => {
  let component: NetsuiteOnboardingExportSettingsComponent;
  let fixture: ComponentFixture<NetsuiteOnboardingExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteOnboardingExportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteOnboardingExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
