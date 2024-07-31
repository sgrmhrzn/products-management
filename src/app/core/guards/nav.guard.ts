import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { RoleEnum } from '../../enum/role.enum';

/**
 * Guard to check authorization of pages during route change
 * @param route activated route data
 * @param state router state data
 * @returns 
 */
export const NavGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  if (localStorage.getItem(environment.ACTIVE_USER_KEY)) {
    const user = JSON.parse(localStorage.getItem(environment.ACTIVE_USER_KEY) || '');
    //check if the user is admin for users page
    if (+user.role !== RoleEnum.Admin && state.url.includes('users') || +user.role !== RoleEnum.Admin && state.url.includes('add') || +user.role !== RoleEnum.Admin && state.url.includes('edit')) {
      router.navigateByUrl('unauthorized');
      return false;
    }
  }
  return true;
}
