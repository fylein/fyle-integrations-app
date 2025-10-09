import { TestBed } from '@angular/core/testing';

import { DashboardService } from './si-dashboard.service';

xdescribe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
