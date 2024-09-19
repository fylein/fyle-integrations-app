import { TestBed } from '@angular/core/testing';

import { Sage300ImportSettingsService } from './sage300-import-settings.service';

xdescribe('Sage300ImportSettingsService', () => {
  let service: Sage300ImportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sage300ImportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
