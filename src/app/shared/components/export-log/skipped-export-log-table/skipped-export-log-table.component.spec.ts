import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkippedExportLogTableComponent } from './skipped-export-log-table.component';

xdescribe('SkippedExportLogTableComponent', () => {
  let component: SkippedExportLogTableComponent;
  let fixture: ComponentFixture<SkippedExportLogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkippedExportLogTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkippedExportLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
