import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { IntacctImportSettingsComponent } from './intacct-import-settings.component';

xdescribe('IntacctImportSettingsComponent', () => {
  let component: IntacctImportSettingsComponent;
  let fixture: ComponentFixture<IntacctImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctImportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
