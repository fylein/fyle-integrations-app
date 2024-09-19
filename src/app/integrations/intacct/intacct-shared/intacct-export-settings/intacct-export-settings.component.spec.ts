import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { IntacctExportSettingsComponent } from './intacct-export-settings.component';

xdescribe('IntacctExportSettingsComponent', () => {
  let component: IntacctExportSettingsComponent;
  let fixture: ComponentFixture<IntacctExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctExportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
