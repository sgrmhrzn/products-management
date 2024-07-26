import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  constructor(private router: Router) {

  }

  add() {
    this.router.navigate([{ outlets: { 'drawer': ['products','add'] } }]);
  }
}
