import { TestBed } from '@angular/core/testing';

import { SiSettingsService } from './si-settings.service';

describe('SiSettingsService', () => {
  let service: SiSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
