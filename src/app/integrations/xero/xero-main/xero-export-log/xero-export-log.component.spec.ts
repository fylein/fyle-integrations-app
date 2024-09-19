import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeroExportLogComponent } from './xero-export-log.component';

xdescribe('XeroExportLogComponent', () => {
  let component: XeroExportLogComponent;
  let fixture: ComponentFixture<XeroExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
