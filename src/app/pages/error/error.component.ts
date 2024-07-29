import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule, NzExceptionStatusType } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [NzResultModule, NzButtonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
/**
 * Error page component to handle 404 and 403 status inside the system
 */
export class ErrorComponent implements OnInit {
  message = '';
  statusCode: NzExceptionStatusType = '404';
  constructor(private router: Router) {

  }
  ngOnInit(): void {
    if (this.router.url.includes('unauthorized')) {
      this.message = "Sorry, you are not authorized to access this page.";
      this.statusCode = '403';
    } else {
      this.message = "Sorry, the page you visited does not exist.";
      this.statusCode = "404"
    }
  }
}
