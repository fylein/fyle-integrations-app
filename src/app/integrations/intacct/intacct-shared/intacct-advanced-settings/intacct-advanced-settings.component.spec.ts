import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntacctAdvancedSettingsComponent } from './intacct-advanced-settings.component';

xdescribe('IntacctAdvancedSettingsComponent', () => {
  let component: IntacctAdvancedSettingsComponent;
  let fixture: ComponentFixture<IntacctAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctAdvancedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
