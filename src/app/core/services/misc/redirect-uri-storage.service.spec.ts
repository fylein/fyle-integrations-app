import { TestBed } from '@angular/core/testing';

import { RedirectUriStorageService } from './redirect-uri-storage.service';

describe('RedirectUriStorageService', () => {
  let service: RedirectUriStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedirectUriStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
