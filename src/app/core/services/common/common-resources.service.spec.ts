import { TestBed } from '@angular/core/testing';

import { CommonResourcesService } from './common-resources.service';

xdescribe('CommonResourcesService', () => {
  let service: CommonResourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonResourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
