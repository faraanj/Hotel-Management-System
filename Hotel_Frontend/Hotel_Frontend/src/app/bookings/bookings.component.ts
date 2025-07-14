import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { UserStorageService } from '../services/user-storage.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss',
  animations: [
    trigger('statusChange', [
      state('Pending', style({
        backgroundColor: '#FFCA28', // amber
        transform: 'scale(1)'
      })),
      state('Approved', style({
        backgroundColor: '#66BB6A', // green
        transform: 'scale(1)'
      })),
      state('Canceled', style({
        backgroundColor: '#EF5350', // red
        transform: 'scale(1)'
      })),
      transition('* => Pending', animate('300ms ease-in')),
      transition('* => Approved', animate('300ms ease-in')),
      transition('* => Canceled', animate('300ms ease-in'))
    ])
  ]
})
export class BookingsComponent {

  sideBarOpen = true;
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  currentPage = 0;
  reservations = [];
  total: any;
  loading = false;
  responseMessage: any;
  displayedColumns: string[] = ['roomName', 'roomType', 'checkInDate', 'checkOutDate', 'price', 'status'];

  constructor(private userService: UserService, private snackbarService: SnackbarService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getUserReservations();
  }

  getUserReservations() {
    this.userService.getUserReservations(this.currentPage + 1, +UserStorageService.getUserID()).subscribe(response => {
      console.log(response);
      this.reservations = response.reservations;
      this.total = response.totalReservations;
    })
  }

  pageIndexChange(event: PageEvent) {
    console.log(event)
    this.currentPage = event.pageIndex;
    this.getUserReservations();
  }

}
