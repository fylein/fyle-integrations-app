import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLastExportSectionComponent } from './dashboard-last-export-section.component';

describe('DashboardLastExportSectionComponent', () => {
  let component: DashboardLastExportSectionComponent;
  let fixture: ComponentFixture<DashboardLastExportSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardLastExportSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLastExportSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
