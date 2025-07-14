import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { GlobalConstants } from '../shared/global-constants';
import { PageEvent } from '@angular/material/paginator';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { UserStorageService } from '../services/user-storage.service';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  sideBarOpen = true;
  currentPage = 0;
  rooms = [];
  total: any;
  loading = false;
  responseMessage: any;
  checkInDate: Date;
  checkOutDate: Date;
  userID: number;
  roomID: string;

  constructor(
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAvailableRooms();
  }

  sideBarToggler(): void {
    this.sideBarOpen = !this.sideBarOpen;
  }

  getAvailableRooms(): void {
    this.loading = true;
    this.userService.getAvailableRooms(this.currentPage + 1).subscribe({
      next: (response) => {
        this.rooms = response.availableRooms;
        this.total = response.totalAvailableRooms;
        this.loading = false;
      },
      error: (error) => {
        this.responseMessage = error.message;
        this.loading = false;
        this.snackbarService.openSnackBar(this.responseMessage, 'error');
      }
    });
  }

  pageIndexChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.getAvailableRooms();
  }

  openDialog(roomID: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.data = { roomID }; 
    const dialogRef = this.dialog.open(DatePickerComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const formattedCheckInDate = formatDate(result.start, 'yyyy-MM-dd', 'en-US');
        const formattedCheckOutDate = formatDate(result.end, 'yyyy-MM-dd', 'en-US');
        const data = {
          userID: UserStorageService.getUserID(),
          roomID: roomID,
          checkInDate: formattedCheckInDate,
          checkOutDate: formattedCheckOutDate
        };
        console.log('The dialog was closed: ' + JSON.stringify(data, null, 2));
        this.userService.bookRooms(data).subscribe((response: any) => {
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
    });
  }
}
