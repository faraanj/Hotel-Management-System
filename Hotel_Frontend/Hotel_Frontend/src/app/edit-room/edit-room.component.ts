import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.scss'
})
export class EditRoomComponent {
  sideBarOpen = true;
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  updateRoomForm: any = FormGroup;
  responseMessage: any;
  id = this.activatedRoute.snapshot.params['id'];

  constructor(private formBuilder: FormBuilder, private router: Router, private ngxService: NgxUiLoaderService, private userService: UserService, private snackbarService: SnackbarService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.updateRoomForm = this.formBuilder.group({
      roomNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.roomNumberRegex)]],
      roomType: [null, [Validators.required, Validators.pattern(GlobalConstants.roomTypeRegex)]],
      price: [null, [Validators.required, Validators.pattern(GlobalConstants.priceRegex)]],
      roomDescription: [null]
    });
    this.getRoomById();
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.updateRoomForm.value;
    var data = {
      roomID: this.id,
      roomNumber: formData.roomNumber,
      roomType: formData.roomType,
      price: formData.price,
      roomDescription: formData.roomDescription
    }
    this.userService.updateRoom(this.id, data).subscribe((response: any) => {
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, '');
      this.router.navigate(['/room']);
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  getRoomById() {
    this.userService.getRoomById(this.id).subscribe((response: any) => {
      this.updateRoomForm.patchValue(response);
    }, (error) => {
      this.ngxService.stop();
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
