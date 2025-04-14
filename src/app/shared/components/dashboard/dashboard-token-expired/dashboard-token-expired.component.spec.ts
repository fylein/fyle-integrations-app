import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTokenExpiredComponent } from './dashboard-token-expired.component';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('DashboardTokenExpiredComponent', () => {
  let component: DashboardTokenExpiredComponent;
  let fixture: ComponentFixture<DashboardTokenExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardTokenExpiredComponent],
      imports: [HttpClientModule],
      providers: [MessageService]
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
