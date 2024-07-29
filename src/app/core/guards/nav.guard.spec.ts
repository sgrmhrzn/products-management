import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { NavGuard } from './nav.guard';

describe('navGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => NavGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
