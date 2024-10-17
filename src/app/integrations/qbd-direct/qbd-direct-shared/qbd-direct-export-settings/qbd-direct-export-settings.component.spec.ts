import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectExportSettingsComponent } from './qbd-direct-export-settings.component';

describe('QbdDirectExportSettingsComponent', () => {
  let component: QbdDirectExportSettingsComponent;
  let fixture: ComponentFixture<QbdDirectExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectExportSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
