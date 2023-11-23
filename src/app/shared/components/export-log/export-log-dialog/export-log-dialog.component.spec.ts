import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLogDialogComponent } from './export-log-dialog.component';

describe('ExportLogDialogComponent', () => {
  let component: ExportLogDialogComponent;
  let fixture: ComponentFixture<ExportLogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
