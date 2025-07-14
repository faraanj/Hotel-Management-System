import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserStorageService } from './user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdminService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    const user = UserStorageService.getUser();
    const currentUrl = this.router.url;

    if (!token || !user) {
      this.router.navigate([currentUrl]);
      return false;
    }
    if (user.role === 'user') {
      this.router.navigate(['/hotel']);
      return false;
    }
    if (user.role !== 'admin') {
      return false;
    }
    return true;
  }
}
