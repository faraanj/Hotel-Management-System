import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent {

  sideBarOpen = true;
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  currentPage = 0;
  rooms = [];
  total: any;
  loading = false;
  responseMessage: any;

  constructor(private userService: UserService, private snackbarService: SnackbarService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    this.userService.getRooms(this.currentPage+1).subscribe(response => {
      console.log(response);
      this.rooms = response.rooms;
      this.total = response.totalRooms;
    })
  }

  pageIndexChange(event: PageEvent) {
    console.log(event)
    this.currentPage = event.pageIndex;
    this.getRooms();
  }

  deleteRoom(roomId: number) {
    this.userService.deleteRoom(roomId).subscribe(response => {
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, '');
      this.getRooms();
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

}
