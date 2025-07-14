import { Component } from '@angular/core';
import { UserStorageService } from '../services/user-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  isUser: boolean =  false;
  isAdmin: boolean =  false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.updateUserRoles();
    this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
        this.updateUserRoles();
      }
    });
  }

  updateUserRoles(): void {
    const user = UserStorageService.getUser();
    if (user) {
      this.isUser = user.role === 'user';
      this.isAdmin = user.role === 'admin';
    } 
  }
}
