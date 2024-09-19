import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { QbdConfigurationAdvancedSettingComponent } from './qbd-configuration-advanced-setting.component';

describe('QbdConfigurationAdvancedSettingComponent', () => {
  let component: QbdConfigurationAdvancedSettingComponent;
  let fixture: ComponentFixture<QbdConfigurationAdvancedSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbdConfigurationAdvancedSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdConfigurationAdvancedSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
