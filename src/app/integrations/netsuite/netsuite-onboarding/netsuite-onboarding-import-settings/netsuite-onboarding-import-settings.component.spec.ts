import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NetsuiteOnboardingImportSettingsComponent } from './netsuite-onboarding-import-settings.component';

xdescribe('NetsuiteOnboardingImportSettingsComponent', () => {
  let component: NetsuiteOnboardingImportSettingsComponent;
  let fixture: ComponentFixture<NetsuiteOnboardingImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteOnboardingImportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteOnboardingImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
