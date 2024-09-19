import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { BusinessCentralConfigurationComponent } from './business-central-configuration.component';

xdescribe('BusinessCentralConfigurationComponent', () => {
  let component: BusinessCentralConfigurationComponent;
  let fixture: ComponentFixture<BusinessCentralConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
