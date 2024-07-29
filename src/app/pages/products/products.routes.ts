import { Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductDrawerComponent } from './components/product-drawer/product-drawer.component';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '', component: ProductsComponent,
    children: [
      { path: 'add', component: ProductDrawerComponent, outlet: 'drawer' },
      { path: 'edit/:id', component: ProductDrawerComponent, outlet: 'drawer' },
    ]
  }
];
