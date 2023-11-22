import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300ConfigurationAdvancedSettingsComponent } from './sage300-configuration-advanced-settings.component';

describe('Sage300ConfigurationAdvancedSettingsComponent', () => {
  let component: Sage300ConfigurationAdvancedSettingsComponent;
  let fixture: ComponentFixture<Sage300ConfigurationAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300ConfigurationAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300ConfigurationAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
