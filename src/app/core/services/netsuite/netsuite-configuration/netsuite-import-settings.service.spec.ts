import { TestBed } from '@angular/core/testing';

import { NetsuiteImportSettingsService } from './netsuite-import-settings.service';

xdescribe('NetsuiteImportSettingsService', () => {
  let service: NetsuiteImportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetsuiteImportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
