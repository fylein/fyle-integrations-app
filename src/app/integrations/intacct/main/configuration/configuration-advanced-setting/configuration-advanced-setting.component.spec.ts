import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationAdvancedSettingComponent } from './configuration-advanced-setting.component';
import { FormBuilder } from '@angular/forms';

describe('ConfigurationAdvancedSettingComponent', () => {
  let component: ConfigurationAdvancedSettingComponent;
  let fixture: ComponentFixture<ConfigurationAdvancedSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationAdvancedSettingComponent ],
      providers: [ FormBuilder ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationAdvancedSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
