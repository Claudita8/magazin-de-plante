import { Injectable, inject } from '@angular/core';
import { UsersService } from '../service/users.service';
import { Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdministratorGuard {
  userService = inject(UsersService);
  router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    if (this.userService.currentUserProfile()?.isAdmin) {
      return of(true);
    } else {
      this.router.navigate(['/']);
      return of(false);
    }
  }
}
