import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.scss'
})
export class AddRoomComponent {
  sideBarOpen = true;
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  roomAddForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private ngxService: NgxUiLoaderService, private userService: UserService, private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.roomAddForm = this.formBuilder.group({
      roomNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.roomNumberRegex)]],
      roomType: [null, [Validators.required, Validators.pattern(GlobalConstants.roomTypeRegex)]],
      price: [null, [Validators.required, Validators.pattern(GlobalConstants.priceRegex)]],
      roomDescription: [null]
    });
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.roomAddForm.value;
    var data = {
      roomNumber: formData.roomNumber,
      roomType: formData.roomType,
      price: formData.price,
      roomDescription: formData.roomDescription
    }
    this.userService.addNewRoom(data).subscribe((response: any) => {
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

}
