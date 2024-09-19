import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { BusinessCentralComponent } from './business-central.component';

xdescribe('BusinessCentralComponent', () => {
  let component: BusinessCentralComponent;
  let fixture: ComponentFixture<BusinessCentralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
