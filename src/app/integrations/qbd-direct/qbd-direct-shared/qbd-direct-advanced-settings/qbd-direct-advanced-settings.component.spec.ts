import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectAdvancedSettingsComponent } from './qbd-direct-advanced-settings.component';

describe('QbdDirectAdvancedSettingsComponent', () => {
  let component: QbdDirectAdvancedSettingsComponent;
  let fixture: ComponentFixture<QbdDirectAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectAdvancedSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
