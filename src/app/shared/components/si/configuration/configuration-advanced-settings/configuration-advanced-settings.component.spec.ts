import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationAdvancedSettingsComponent } from './configuration-advanced-settings.component';

describe('ConfigurationAdvancedSettingsComponent', () => {
  let component: ConfigurationAdvancedSettingsComponent;
  let fixture: ComponentFixture<ConfigurationAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
