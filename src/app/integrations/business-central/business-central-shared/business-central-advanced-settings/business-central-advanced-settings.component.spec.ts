import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { BusinessCentralAdvancedSettingsComponent } from './business-central-advanced-settings.component';

xdescribe('BusinessCentralAdvancedSettingsComponent', () => {
  let component: BusinessCentralAdvancedSettingsComponent;
  let fixture: ComponentFixture<BusinessCentralAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
