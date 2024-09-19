import { TestBed } from '@angular/core/testing';

import { WindowService } from './window.service';
import { OperatingSystem } from '../../models/enum/enum.model';

describe('WindowService', () => {
  let service: WindowService;

  const mockWindow = { location: { href: '' } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ WindowService ]
    });
    service = TestBed.inject(WindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open url in new tab', () => {
    const popupMock: any = {
      closed: false,
      location: { href: 'https://yourredirecturi.com?code=123456789' },
      close: jasmine.createSpy('close')
    };
    spyOn(window, 'open').and.returnValue(popupMock);
    expect(service.openInNewTab('hehe')).toBeUndefined();
  });

  it('should redirect to given url', () => {
    expect(service.nativeWindow).toBeTruthy();
  });

  it('getOperatingSystem function check', () => {
    const userAgent = service.nativeWindow.navigator.userAgent.includes(OperatingSystem.MAC) ? OperatingSystem.MAC : '';
    expect(service.getOperatingSystem()).toBe(userAgent);
  });

});
