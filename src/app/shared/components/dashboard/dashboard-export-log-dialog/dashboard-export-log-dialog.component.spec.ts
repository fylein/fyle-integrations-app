import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExportLogDialogComponent } from './dashboard-export-log-dialog.component';

describe('DashboardExportLogDialogComponent', () => {
  let component: DashboardExportLogDialogComponent;
  let fixture: ComponentFixture<DashboardExportLogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardExportLogDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardExportLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
