import { TestBed } from '@angular/core/testing';

import { QbdDirectHelperService } from './qbd-direct-helper.service';

xdescribe('QbdDirectHelperService', () => {
  let service: QbdDirectHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdDirectHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
