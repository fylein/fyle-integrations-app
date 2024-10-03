import { TestBed } from '@angular/core/testing';

import { QboAuthService } from './qbo-auth.service';

xdescribe('QboAuthService', () => {
  let service: QboAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QboAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
