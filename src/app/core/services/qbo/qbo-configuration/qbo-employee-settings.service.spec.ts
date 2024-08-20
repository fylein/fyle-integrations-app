import { TestBed } from '@angular/core/testing';

import { QboEmployeeSettingsService } from './qbo-employee-settings.service';

xdescribe('QboEmployeeSettingsService', () => {
  let service: QboEmployeeSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QboEmployeeSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
