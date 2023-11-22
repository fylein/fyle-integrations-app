import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300ConfigurationExportSettingsComponent } from './sage300-configuration-export-settings.component';

describe('Sage300ConfigurationExportSettingsComponent', () => {
  let component: Sage300ConfigurationExportSettingsComponent;
  let fixture: ComponentFixture<Sage300ConfigurationExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300ConfigurationExportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300ConfigurationExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
