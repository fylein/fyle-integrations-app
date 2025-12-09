import { TestBed } from '@angular/core/testing';
import { UqbdUadvancedUsettingsService } from './qbd-advanced-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UqbdUadvancedUsettingsService', () => {
  let service: UqbdUadvancedUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UqbdUadvancedUsettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UqbdUadvancedUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
