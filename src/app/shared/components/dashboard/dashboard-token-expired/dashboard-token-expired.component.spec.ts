import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTokenExpiredComponent } from './dashboard-token-expired.component';

describe('DashboardTokenExpiredComponent', () => {
  let component: DashboardTokenExpiredComponent;
  let fixture: ComponentFixture<DashboardTokenExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTokenExpiredComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTokenExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
