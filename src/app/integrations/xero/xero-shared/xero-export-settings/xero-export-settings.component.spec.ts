import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeroExportSettingsComponent } from './xero-export-settings.component';

describe('XeroExportSettingsComponent', () => {
  let component: XeroExportSettingsComponent;
  let fixture: ComponentFixture<XeroExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroExportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
