import { TestBed } from '@angular/core/testing';

import { IntegrationsUserService } from './integrations-user.service';

xdescribe('IntegrationsUserService', () => {
  let service: IntegrationsUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrationsUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
