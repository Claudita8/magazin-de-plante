import { Injectable, inject } from '@angular/core';
import { UsersService } from '../service/users.service';

@Injectable({
  providedIn: 'root',
})
export class AdministratorGuard {
  userService = inject(UsersService);

  checkAdmin() {
    return this.userService.currentUserProfile()?.isAdmin ?? false;
  }

  canActivate() {
    return this.checkAdmin();
  }
}
