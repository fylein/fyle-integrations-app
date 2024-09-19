import { TestBed } from '@angular/core/testing';

import { Sage300AdvancedSettingsService } from './sage300-advanced-settings.service';

xdescribe('Sage300AdvancedSettingsService', () => {
  let service: Sage300AdvancedSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sage300AdvancedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
