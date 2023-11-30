import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCentralExportLogComponent } from './business-central-export-log.component';

describe('BusinessCentralExportLogComponent', () => {
  let component: BusinessCentralExportLogComponent;
  let fixture: ComponentFixture<BusinessCentralExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
