import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { BusinessCentralSkippedExportLogComponent } from './business-central-skipped-export-log.component';

xdescribe('BusinessCentralSkippedExportLogComponent', () => {
  let component: BusinessCentralSkippedExportLogComponent;
  let fixture: ComponentFixture<BusinessCentralSkippedExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCentralSkippedExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCentralSkippedExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
