import { TestBed } from '@angular/core/testing';

import { IframeOriginStorageService } from './iframe-origin-storage.service';

describe('IframeOriginStorageService', () => {
  let service: IframeOriginStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IframeOriginStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
