import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationScheduleExportComponent } from './configuration-schedule-export.component';

xdescribe('ConfigurationScheduleExportComponent', () => {
  let component: ConfigurationScheduleExportComponent;
  let fixture: ComponentFixture<ConfigurationScheduleExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationScheduleExportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationScheduleExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
