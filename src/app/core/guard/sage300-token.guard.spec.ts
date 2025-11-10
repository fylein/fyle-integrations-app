import { TestBed } from '@angular/core/testing';
import { Sage300TokenGuard } from './sage300-token.guard';

describe('Sage300TokenGuard', () => {
  let guard: Sage300TokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(Sage300TokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});