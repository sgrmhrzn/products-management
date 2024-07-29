import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthLayoutComponent } from './core/components/auth-layout/auth-layout.component';
import { AUTH_ROUTES } from './core/components/auth-layout/auth.routes';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: '', component: AuthLayoutComponent, children: AUTH_ROUTES, canActivateChild: [AuthGuard] }
];
