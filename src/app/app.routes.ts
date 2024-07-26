import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/products' },
  { path: 'products', loadChildren: () => import('./pages/products/products.routes').then(m => m.PRODUCTS_ROUTES) },
  { path: 'users', loadChildren: () => import('./pages/users/users.routes').then(m => m.USERS_ROUTES) }
];
