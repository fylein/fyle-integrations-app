import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMappingComponent } from './employee-mapping.component';

describe('EmployeeMappingComponent', () => {
  let component: EmployeeMappingComponent;
  let fixture: ComponentFixture<EmployeeMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
