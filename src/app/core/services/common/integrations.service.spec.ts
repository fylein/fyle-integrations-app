import { TestBed } from '@angular/core/testing';

import { IntegrationsService } from './integrations.service';

xdescribe('IntegrationsService', () => {
  let service: IntegrationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
