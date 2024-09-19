import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMappingResolveComponent } from './dashboard-mapping-resolve.component';

xdescribe('DashboardMappingResolveComponent', () => {
  let component: DashboardMappingResolveComponent;
  let fixture: ComponentFixture<DashboardMappingResolveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardMappingResolveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMappingResolveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
