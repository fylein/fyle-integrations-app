import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCentralEmployeeSettingsComponent } from './business-central-employee-settings.component';

describe('BusinessCentralEmployeeSettingsComponent', () => {
  let component: BusinessCentralEmployeeSettingsComponent;
  let fixture: ComponentFixture<BusinessCentralEmployeeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralEmployeeSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralEmployeeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
