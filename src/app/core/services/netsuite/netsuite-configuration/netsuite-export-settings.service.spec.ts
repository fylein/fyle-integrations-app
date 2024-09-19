import { TestBed } from '@angular/core/testing';

import { NetsuiteExportSettingsService } from './netsuite-export-settings.service';

xdescribe('NetsuiteExportSettingsService', () => {
  let service: NetsuiteExportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetsuiteExportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
