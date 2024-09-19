import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCentralImportSettingsComponent } from './business-central-import-settings.component';

xdescribe('BusinessCentralImportSettingsComponent', () => {
  let component: BusinessCentralImportSettingsComponent;
  let fixture: ComponentFixture<BusinessCentralImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralImportSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
