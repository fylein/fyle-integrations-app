import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectImportSettingsComponent } from './qbd-direct-import-settings.component';

describe('QbdDirectImportSettingsComponent', () => {
  let component: QbdDirectImportSettingsComponent;
  let fixture: ComponentFixture<QbdDirectImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectImportSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QbdDirectImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
