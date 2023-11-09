import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExportSummarySectionComponent } from './dashboard-export-summary-section.component';

describe('DashboardExportSummarySectionComponent', () => {
  let component: DashboardExportSummarySectionComponent;
  let fixture: ComponentFixture<DashboardExportSummarySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardExportSummarySectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardExportSummarySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
