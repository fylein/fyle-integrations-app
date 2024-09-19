import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { XeroImportSettingsComponent } from './xero-import-settings.component';

xdescribe('XeroImportSettingsComponent', () => {
  let component: XeroImportSettingsComponent;
  let fixture: ComponentFixture<XeroImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroImportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
