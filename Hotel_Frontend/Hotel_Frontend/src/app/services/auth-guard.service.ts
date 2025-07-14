import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserStorageService } from './user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    const user = UserStorageService.getUser();
    const currentUrl = this.router.url;
    if (!token || !user) {
      this.router.navigate([currentUrl]);
      return false;
    }
    if (user.role === 'admin') {
      this.router.navigate(['/room']);
      return false;
    }
    if (user.role !== 'user') {
      return false;
    }
    return true;
  }

}
