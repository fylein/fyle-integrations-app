import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboSkippedExportLogComponent } from './qbo-skipped-export-log.component';

xdescribe('QboSkippedExportLogComponent', () => {
  let component: QboSkippedExportLogComponent;
  let fixture: ComponentFixture<QboSkippedExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboSkippedExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboSkippedExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
