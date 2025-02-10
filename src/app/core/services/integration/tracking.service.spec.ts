import { TestBed } from '@angular/core/testing';
import { ClickEvent, IntacctOnboardingState, IntacctUpdateEvent } from '../../models/enum/enum.model';

import { TrackingService } from './tracking.service';

describe('TrackingService', () => {
  let service: TrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackingService);
    (window as any).mixpanel = {
      track: () => undefined,
      identify: () => undefined,
      people: {
        set: () => undefined
      }
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should track Open Landing Page event', () => {
    expect(service.onOpenLandingPage('ashwin.t@fyle.in', 'or767asdih5')).toBeUndefined();
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

  it('intacctUpdateEvent service check', () => {
    expect(service.intacctUpdateEvent(IntacctUpdateEvent.EXPORT_SETTING_INTACCT)).toBeUndefined();
  });
});
