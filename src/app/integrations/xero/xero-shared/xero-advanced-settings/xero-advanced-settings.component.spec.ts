import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeroAdvancedSettingsComponent } from './xero-advanced-settings.component';

xdescribe('XeroAdvancedSettingsComponent', () => {
  let component: XeroAdvancedSettingsComponent;
  let fixture: ComponentFixture<XeroAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
