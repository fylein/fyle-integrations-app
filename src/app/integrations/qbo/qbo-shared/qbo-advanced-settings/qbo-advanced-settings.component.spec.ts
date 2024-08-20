import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboAdvancedSettingsComponent } from './qbo-advanced-settings.component';

xdescribe('QboAdvancedSettingsComponent', () => {
  let component: QboAdvancedSettingsComponent;
  let fixture: ComponentFixture<QboAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
