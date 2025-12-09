import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardErrorSectionComponent } from './dashboard-error-section.component';

xdescribe('DashboardErrorSectionComponent', () => {
  let component: DashboardErrorSectionComponent;
  let fixture: ComponentFixture<DashboardErrorSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardErrorSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardErrorSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
