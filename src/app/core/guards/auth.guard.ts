import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

/**
 * Guard to check the active user session which changing routes
 * @param route Activated route data
 * @param state Router state data
 * @returns 
 */
export const AuthGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  if (!localStorage.getItem(environment.ACTIVE_USER_KEY)) {
    router.navigateByUrl('login');
    return false;
  }
  return true;
};
