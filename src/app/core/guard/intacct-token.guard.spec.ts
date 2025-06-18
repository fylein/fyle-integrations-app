import { TestBed } from '@angular/core/testing';
import { IntacctTokenGuard } from './intacct-token.guard';

xdescribe('NetsuiteTokenGuard', () => {
  let guard: IntacctTokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IntacctTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
