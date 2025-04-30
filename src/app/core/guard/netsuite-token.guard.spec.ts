import { TestBed } from '@angular/core/testing';
import { NetsuiteTokenGuard } from './netsuite-token.guard';

xdescribe('NetsuiteTokenGuard', () => {
  let guard: NetsuiteTokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NetsuiteTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
