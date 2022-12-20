import { TestBed } from '@angular/core/testing';

import { TrackingService } from './tracking.service';

describe('TrackingService', () => {
  let service: TrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackingService);
    (window as any).analytics = {
      track: () => undefined,
      identify: () => undefined
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should track Sign In event', () => {
    expect(service.onSignIn('ashwin.t@fyle.in', 1, 'Fyle org', 'ora2d3afg4g')).toBeUndefined();
  });

  it('should track Sign Up event', () => {
    expect(service.onSignUp('ashwin.t@fyle.in', 1, 'Fyle org', 'ora2d3afg4g')).toBeUndefined();
  });

  it('should flatten the payload', () => {
    const payload = [
      {
        duration: 1
      },
      {
        duration: 2
      }
    ];
    expect((service as any).flattenObject(payload)).toEqual({
      '0.duration': 1,
      '1.duration': 2
    });
  });
});
