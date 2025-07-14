import { Component, EventEmitter, Output } from '@angular/core';
import { UserStorageService } from '../services/user-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  username:string 

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.username = UserStorageService.getUser().name;
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();

  }

  logout() {
    UserStorageService.signOut();
    this.router.navigate(['/']);
  }

}
