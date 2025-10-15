import { TestBed } from '@angular/core/testing';
import { UtravelperkUadvancedUsettingsService } from './travelperk-advanced-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UtravelperkUadvancedUsettingsService', () => {
  let service: UtravelperkUadvancedUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UtravelperkUadvancedUsettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UtravelperkUadvancedUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
