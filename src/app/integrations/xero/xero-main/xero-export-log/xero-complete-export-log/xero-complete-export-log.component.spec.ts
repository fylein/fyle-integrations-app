import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeroCompleteExportLogComponent } from './xero-complete-export-log.component';

xdescribe('XeroCompleteExportLogComponent', () => {
  let component: XeroCompleteExportLogComponent;
  let fixture: ComponentFixture<XeroCompleteExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XeroCompleteExportLogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(XeroCompleteExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
