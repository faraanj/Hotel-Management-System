import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { UserStorageService } from '../services/user-storage.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  loginForm: any = FormGroup;
  responseMessage: any;
  constructor(private formBuilder:FormBuilder, private router:Router, private userService:UserService, public dialogRef:MatDialogRef<LoginComponent>, private ngxService:NgxUiLoaderService, private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, [Validators.required]]
    })
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.loginForm.value;
     var data={
        email: formData.email,
        password: formData.password
    }
    this.userService.login(data).subscribe((response: any) => {
      let token = response.token;
      let decodedToken = jwtDecode(token);
      this.dialogRef.close();
      localStorage.setItem('token', response.token);
      this.router.navigate(['/hotel']);
      let payloadList = Object.entries(decodedToken).map(([key, value]) => ({ key, value }));
      let idItem = payloadList.find(item => item.key === 'nameid');
      let roleItem = payloadList.find(item => item.key === 'role');
      let emailItem = payloadList.find(item => item.key === 'email');
      let nameItem = payloadList.find(item => item.key === 'unique_name');
      let idValue = idItem ? idItem.value : null;
      let roleValue = roleItem ? roleItem.value : null;
      let emailValue = emailItem ? emailItem.value : null;
      let nameValue = nameItem ? nameItem.value : null;
      if (roleValue != null) {
        console.log(roleValue)
        const user = {
          id: idValue,
          role: roleValue,
          email: emailValue,
          name: nameValue
        }
        UserStorageService.saveUser(user);
        UserStorageService.saveToken(response.token);
        if(UserStorageService.isAdminLoggedIn()){
          this.router.navigate(['/room']);
        }else if (UserStorageService.isUserLoggedIn()){
          this.router.navigate(['/hotel']);
        }
        this.ngxService.stop();

      }
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
