import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { BusinessCentralBaseMappingComponent } from './business-central-base-mapping.component';

xdescribe('BusinessCentralBaseMappingComponent', () => {
  let component: BusinessCentralBaseMappingComponent;
  let fixture: ComponentFixture<BusinessCentralBaseMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralBaseMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralBaseMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
