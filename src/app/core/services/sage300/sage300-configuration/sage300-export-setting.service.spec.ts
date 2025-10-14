import { TestBed } from '@angular/core/testing';

import { Sage300ExportSettingsService } from './sage300-export-settings.service';

xdescribe('Sage300ExportSettingsService', () => {
  let service: Sage300ExportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sage300ExportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
