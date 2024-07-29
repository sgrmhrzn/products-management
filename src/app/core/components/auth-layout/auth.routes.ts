import { Routes } from '@angular/router';
import { ErrorComponent } from './../../../pages/error/error.component';
// import { LoginComponent } from './pages/login/login.component';
// import { AuthLayoutComponent } from './pages/auth-layout/auth-layout.component';

export const AUTH_ROUTES: Routes = [
  { path: 'products', loadChildren: () => import('./../../../pages/products/products.routes').then(m => m.PRODUCTS_ROUTES) },
  { path: 'favorites', loadChildren: () => import('./../../../pages/favorites/favorites.routes').then(m => m.FAVORITES_ROUTES) },
  { path: 'users', loadChildren: () => import('./../../../pages/users/users.routes').then(m => m.USERS_ROUTES) },
  { path: 'unauthorized', component: ErrorComponent },
  { path: '**', component: ErrorComponent },
];
