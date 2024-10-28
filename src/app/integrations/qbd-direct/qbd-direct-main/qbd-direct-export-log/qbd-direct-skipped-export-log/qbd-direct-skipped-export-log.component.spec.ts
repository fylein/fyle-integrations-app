import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectSkippedExportLogComponent } from './qbd-direct-skipped-export-log.component';

xdescribe('QbdDirectSkippedExportLogComponent', () => {
  let component: QbdDirectSkippedExportLogComponent;
  let fixture: ComponentFixture<QbdDirectSkippedExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectSkippedExportLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectSkippedExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
