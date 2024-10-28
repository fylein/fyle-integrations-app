import { TestBed } from '@angular/core/testing';

import { QbdDirectAdvancedSettingsService } from './qbd-direct-advanced-settings.service';

xdescribe('QbdDirectAdvancedSettingsService', () => {
  let service: QbdDirectAdvancedSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdDirectAdvancedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
