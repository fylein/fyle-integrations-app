import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300DashboardComponent } from './sage300-dashboard.component';

xdescribe('Sage300DashboardComponent', () => {
  let component: Sage300DashboardComponent;
  let fixture: ComponentFixture<Sage300DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Sage300DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Sage300DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
