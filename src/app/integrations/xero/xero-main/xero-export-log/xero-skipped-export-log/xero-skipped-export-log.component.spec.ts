import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeroSkippedExportLogComponent } from './xero-skipped-export-log.component';

xdescribe('XeroSkippedExportLogComponent', () => {
  let component: XeroSkippedExportLogComponent;
  let fixture: ComponentFixture<XeroSkippedExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroSkippedExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroSkippedExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
