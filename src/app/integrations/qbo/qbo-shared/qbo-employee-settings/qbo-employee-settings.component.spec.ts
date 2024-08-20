import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboEmployeeSettingsComponent } from './qbo-employee-settings.component';

xdescribe('QboEmployeeSettingsComponent', () => {
  let component: QboEmployeeSettingsComponent;
  let fixture: ComponentFixture<QboEmployeeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboEmployeeSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboEmployeeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
