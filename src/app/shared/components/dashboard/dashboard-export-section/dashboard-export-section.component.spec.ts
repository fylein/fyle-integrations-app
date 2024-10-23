import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExportSectionComponent } from './dashboard-export-section.component';

xdescribe('DashboardExportSectionComponent', () => {
  let component: DashboardExportSectionComponent;
  let fixture: ComponentFixture<DashboardExportSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardExportSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardExportSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
