import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationImportSettingsComponent } from './configuration-import-settings.component';

describe('ConfigurationImportSettingsComponent', () => {
  let component: ConfigurationImportSettingsComponent;
  let fixture: ComponentFixture<ConfigurationImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationImportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
