import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectDashboardComponent } from './qbd-direct-dashboard.component';

xdescribe('QbdDirectDashboardComponent', () => {
  let component: QbdDirectDashboardComponent;
  let fixture: ComponentFixture<QbdDirectDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
