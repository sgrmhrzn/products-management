import { Routes } from '@angular/router';
import { ErrorComponent } from './../../../pages/error/error.component';
import { NavGuard } from '../../guards/nav.guard';

//auth routes
export const AUTH_ROUTES: Routes = [
  { path: 'products', canActivate: [NavGuard], loadChildren: () => import('./../../../pages/products/products.routes').then(m => m.PRODUCTS_ROUTES) },
  { path: 'favorites', canActivate: [NavGuard], loadChildren: () => import('./../../../pages/favorites/favorites.routes').then(m => m.FAVORITES_ROUTES) },
  { path: 'users', canActivate: [NavGuard], loadChildren: () => import('./../../../pages/users/users.routes').then(m => m.USERS_ROUTES) },
  { path: 'unauthorized', component: ErrorComponent },
  { path: '**', component: ErrorComponent },
];
