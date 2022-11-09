import { TestBed } from '@angular/core/testing';

import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should listen for events', () => {
    expect(service.receiveEvent()).toBeUndefined();
    window.postMessage({redirectUri: 'https://lolo.fyle.tech'});
  });

  it('should post event', () => {
    expect(service.postEvent('http://lolo.fyle.tech', 'tpaIdhahahehe')).toBeUndefined();
  });
});
