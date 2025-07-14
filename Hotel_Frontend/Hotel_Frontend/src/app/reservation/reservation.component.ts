import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { PageEvent } from '@angular/material/paginator';
import { GlobalConstants } from '../shared/global-constants';
import { MatDialog } from '@angular/material/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
  animations: [
    trigger('statusChange', [
      state('Pending', style({
        backgroundColor: '#FFCA28', // yellow
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
      transition('* => Pending', animate('500ms ease-in')),
      transition('* => Approved', animate('500ms ease-in')),
      transition('* => Canceled', animate('500ms ease-in'))
    ])
  ]
})
export class ReservationComponent {
  sideBarOpen = true;
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  currentPage = 0;
  reservations = [];
  total: any;
  loading = false;
  responseMessage: any;
  displayedColumns: string[] = ['roomName', 'roomType', 'checkInDate', 'checkOutDate', 'username', 'price', 'status', 'action'];

  constructor(private userService: UserService, private snackbarService: SnackbarService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getReservations();
  }

  getReservations() {
    this.userService.getReservations(this.currentPage + 1).subscribe(response => {
      console.log(response);
      this.reservations = response.reservations;
      this.total = response.totalReservations;
    })
  }

  approveReservation(reservation: any) {
    if (reservation.reservationStatus === 'Pending' ) {
      reservation.reservationStatus = 'Approved';
      this.userService.updateReservationStatus(reservation).subscribe(response => {
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, '');
      }, (error) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        }
        else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      })
    }
    console.log('Approving reservation', reservation);
  }

  cancelReservation(reservation: any) {
    if (reservation.reservationStatus === 'Pending') {
      reservation.reservationStatus = 'Canceled';
      this.userService.updateReservationStatus(reservation).subscribe(response => {
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, '');
      }, (error) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        }
        else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      })
    }
    console.log('Canceling reservation', reservation);
  }

  pageIndexChange(event: PageEvent) {
    console.log(event)
    this.currentPage = event.pageIndex;
    this.getReservations();
  }

}
