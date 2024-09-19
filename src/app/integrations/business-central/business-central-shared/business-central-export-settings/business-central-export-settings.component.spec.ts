import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { BusinessCentralExportSettingsComponent } from './business-central-export-settings.component';

xdescribe('BusinessCentralExportSettingsComponent', () => {
  let component: BusinessCentralExportSettingsComponent;
  let fixture: ComponentFixture<BusinessCentralExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralExportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
