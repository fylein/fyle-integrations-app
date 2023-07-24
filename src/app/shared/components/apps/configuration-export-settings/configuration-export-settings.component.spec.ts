import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationExportSettingsComponent } from './configuration-export-settings.component';

describe('ConfigurationExportSettingsComponent', () => {
  let component: ConfigurationExportSettingsComponent;
  let fixture: ComponentFixture<ConfigurationExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationExportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
