import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { BusinessCentralMappingComponent } from './business-central-mapping.component';

xdescribe('BusinessCentralMappingComponent', () => {
  let component: BusinessCentralMappingComponent;
  let fixture: ComponentFixture<BusinessCentralMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
