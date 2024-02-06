import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationImportSettingComponent } from './configuration-import-setting.component';
import { FormBuilder } from '@angular/forms';

describe('ConfigurationImportSettingComponent', () => {
  let component: ConfigurationImportSettingComponent;
  let fixture: ComponentFixture<ConfigurationImportSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationImportSettingComponent ],
      providers: [ FormBuilder ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationImportSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
