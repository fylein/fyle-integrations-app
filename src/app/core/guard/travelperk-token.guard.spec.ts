import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { travelperkTokenGuard } from './travelperk-token.guard';

describe('travelperkTokenGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => travelperkTokenGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
